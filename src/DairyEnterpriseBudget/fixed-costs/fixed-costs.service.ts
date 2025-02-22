import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ProductionDetailsInput } from '../schemas/inputs/ProductionDetailsInput.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductionDetailsOutput } from '../schemas/outputs/ProductionDetailsOutput.schema';
import { User } from 'src/user/schemas/user.schema';
import { FixedCostsInput } from '../schemas/inputs/FixedCostsInput.schema';
import { FixedCostsOutput } from '../schemas/outputs/FixedCostsOutput.schema';
import { FixedCostsInputDto } from '../dto/fixed-costs-input.dto';
import { ReceiptsInput } from '../schemas/inputs/ReceiptsInput.schema';

@Injectable()
export class FixedCostsService {
  private readonly logger = new Logger(FixedCostsService.name);

  constructor(
    @InjectModel(FixedCostsInput.name)
    private fixedCostsInputModel: Model<FixedCostsInput>,
    @InjectModel(FixedCostsOutput.name)
    private fixedCostsOutputModel: Model<FixedCostsOutput>,
    @InjectModel(ProductionDetailsInput.name)
    private productionDetailsInputModel: Model<ProductionDetailsInput>,
    // @InjectModel(ProductionDetailsOutput.name) private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
    @InjectModel(ReceiptsInput.name)
    private receiptsInputModel: Model<ReceiptsInput>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateInput(email: string, updateDto: FixedCostsInputDto) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();
    this.logger.log(`Updating inputs for user: ${userId}`);
    const updateData: any = {};

    //Handling Financial Assumptions
    if (updateDto.financialAssumptions) {
      for (const [key, value] of Object.entries(updateDto.financialAssumptions)) {
        if (value !== undefined) {
          updateData[`financialAssumptions.${key}`] = value;
        }
      }
      this.logger.log(
        `Financial Assumptions Data: ${JSON.stringify(updateDto.financialAssumptions)}`,
      );
    }

    // Handling Cattle Fixed Costs
    if (updateDto.cattleFixedCost) {
      for (const [key, value] of Object.entries(updateDto.cattleFixedCost)) {
        if (value !== undefined) {
          updateData[`cattleFixedCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Cattle Fixed Cost Data: ${JSON.stringify(updateDto.cattleFixedCost)}`,
      );
    }

    // Handling Facilities and Buildings Fixed Costs
    if (updateDto.facilitiesAndBuildingsFixedCost) {
      for (const [key, value] of Object.entries(
        updateDto.facilitiesAndBuildingsFixedCost,
      )) {
        if (value !== undefined) {
          updateData[`facilitiesAndBuildingsFixedCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Facilities and Buildings Fixed Costs Data: ${JSON.stringify(updateDto.facilitiesAndBuildingsFixedCost)}`,
      );
    }

    // Handling Waste Management Fixed Costs
    if (updateDto.wasteManagementFixedCosts) {
      for (const [key, value] of Object.entries(
        updateDto.wasteManagementFixedCosts,
      )) {
        if (value !== undefined) {
          updateData[`wasteManagementFixedCosts.${key}`] = value;
        }
      }
      this.logger.log(
        `Waste Management Fixed Costs Data: ${JSON.stringify(updateDto.wasteManagementFixedCosts)}`,
      );
    }

    // Handling Machinery Fixed Costs
    if (updateDto.machineryFixedCosts) {
      for (const [key, value] of Object.entries(
        updateDto.machineryFixedCosts,
      )) {
        if (value !== undefined) {
          updateData[`machineryFixedCosts.${key}`] = value;
        }
      }
      this.logger.log(
        `Machinery Fixed Costs Data: ${JSON.stringify(updateDto.machineryFixedCosts)}`,
      );
    }

    // Handling Detailed Machinery Fixed Costs
    if (updateDto.detailedMachineryFixedCosts) {
      for (const [key, value] of Object.entries(
        updateDto.detailedMachineryFixedCosts,
      )) {
        if (value !== undefined) {
          updateData[`detailedMachineryFixedCosts.${key}`] = value;
        }
      }
      this.logger.log(
        `Detailed Machinery Fixed Costs Data: ${JSON.stringify(updateDto.detailedMachineryFixedCosts)}`,
      );
    }

    // Handling Land Fixed Costs
    if (updateDto.landFixedCosts) {
      for (const [key, value] of Object.entries(updateDto.landFixedCosts)) {
        if (value !== undefined) {
          updateData[`landFixedCosts.${key}`] = value;
        }
      }
      this.logger.log(
        `Land Fixed Costs Data: ${JSON.stringify(updateDto.landFixedCosts)}`,
      );
    }

    // Handling isDetailedMachineryCosts
    if (updateDto.isDetailedMachineryCosts !== undefined) {
      updateData[`isDetailedMachineryCosts`] =
        updateDto.isDetailedMachineryCosts;
      this.logger.log(
        `isDetailedMachineryCosts Data: ${updateDto.isDetailedMachineryCosts}`,
      );
    }

    try {
      const updatedDocument = await this.fixedCostsInputModel.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, upsert: true },
      );

      if (!updatedDocument) {
        this.logger.warn(`User not found: ${userId}`);
        throw new Error('User not found');
      }

      this.logger.log(`Successfully updated inputs for user: ${userId}`);

      // If successful, we need to call another service that calculates the output
      // and updates the output schema accordingly
      return await this.calculateFixedCostsOutput(userId, updatedDocument);
    } catch (error) {
      this.logger.error(`Failed to update user inputs: ${error.message}`);
      throw new Error(`Failed to update user inputs: ${error.message}`);
    }
  }

  async calculateFixedCostsOutput(
    userId: string,
    updatedDocument: FixedCostsInput,
  ) {
    this.logger.log(`Calculating fixed costs output for user: ${userId}`);

    //Get any other required documents from other tables
    const productionDetailsInputs = await this.productionDetailsInputModel.findOne({ userId }).exec();
    const receiptsInput = await this.receiptsInputModel.findOne({ userId }).exec();

    // ------->>> Inputs from fixed costs
    
    // Financial Assumptions
    const shortTermInterestRate = updatedDocument.financialAssumptions.shortTermInterestRate;
    const propertyTaxRate = updatedDocument.financialAssumptions.propertyTaxRate;
    const propertyInsuranceRate = updatedDocument.financialAssumptions.propertyInsuranceRate;
    const buildingAndStructuresInsuranceCoverageRequired = updatedDocument.financialAssumptions.buildingAndStructuresInsuranceCoverageRequired;
    const longTermInterestRate = updatedDocument.financialAssumptions.longTermInterestRate;
    const livestockInsuranceRate = updatedDocument.financialAssumptions.livestockInsuranceRate;
    const machineryAndEquipmentInsuranceRate = updatedDocument.financialAssumptions.machineryAndEquipmentInsuranceRate;

    const cowPurchaseValue = updatedDocument.cattleFixedCost.cowPurchaseValue;
    const overheadCostPerCow = updatedDocument.cattleFixedCost.overheadCostPerCow;
    const numberOfBredHeifers = updatedDocument.cattleFixedCost.numberOfBredHeifers;
    const bredHeiferPurchaseValue = updatedDocument.cattleFixedCost.bredHeiferPurchaseValue;
    const numberOfOneYearOldHeifers = updatedDocument.cattleFixedCost.numberOfOneYearOldHeifers;
    const oneYearOldHeiferPurchaseValue = updatedDocument.cattleFixedCost.oneYearOldHeiferPurchaseValue;
    const numberOfWeanedHeiferCalves = updatedDocument.cattleFixedCost.numberOfWeanedHeiferCalves;
    const weanedHeiferCalvesPurchaseValue = updatedDocument.cattleFixedCost.weanedHeiferCalvesPurchaseValue;

    //Facilities and Buildings
    const farmShopAndGeneralRoadsInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.farmShopAndGeneralRoadsInitialInvestment;
    const farmShopAndGeneralRoadsYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.farmShopAndGeneralRoadsYearsOfUsefulLife;

    const milkingParlorAndEquipmentInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.milkingParlorAndEquipmentInitialInvestment;
    const milkingParlorAndEquipmentYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.milkingParlorAndEquipmentYearsOfUsefulLife;

    const feedingEquipmentInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .feedingEquipmentInitialInvestment;
    const feedingEquipmentYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .feedingEquipmentYearsOfUsefulLife;

    const freestallHousingAndLanesInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .freestallHousingAndLanesInitialInvestment;
    const freestallHousingAndLanesYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .freestallHousingAndLanesYearsOfUsefulLife;

    const threePhasePowerSupplyInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .threePhasePowerSupplyInitialInvestment;
    const threePhasePowerSupplyYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .threePhasePowerSupplyYearsOfUsefulLife;

    const waterSystemInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .waterSystemInitialInvestment;
    const waterSystemYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .waterSystemYearsOfUsefulLife;

    const hayShedInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost.hayShedInitialInvestment;
    const hayShedYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost.hayShedYearsOfUsefulLife;

    const trenchSilosInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .trenchSilosInitialInvestment;
    const trenchSilosYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .trenchSilosYearsOfUsefulLife;

    const fencesInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.fencesInitialInvestment;
    const fencesYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.fencesYearsOfUsefulLife;

    const commodityBarnInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .commodityBarnInitialInvestment;
    const commodityBarnYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .commodityBarnYearsOfUsefulLife;

    const calfOrHeiferBarnInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .calfOrHeiferBarnInitialInvestment;
    const calfOrHeiferBarnYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .calfOrHeiferBarnYearsOfUsefulLife;

    const tiltTableInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .tiltTableInitialInvestment;
    const tiltTableYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .tiltTableYearsOfUsefulLife;

    const cattleHandlingFacilitiesInitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .cattleHandlingFacilitiesInitialInvestment;
    const cattleHandlingFacilitiesYearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .cattleHandlingFacilitiesYearsOfUsefulLife;

    const otherFacilitiesAndBuildings1InitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .otherFacilitiesAndBuildings1InitialInvestment;
    const otherFacilitiesAndBuildings1YearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .otherFacilitiesAndBuildings1YearsOfUsefulLife;

    const otherFacilitiesAndBuildings2InitialInvestment =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .otherFacilitiesAndBuildings2InitialInvestment;
    const otherFacilitiesAndBuildings2YearsOfUsefulLife =
      updatedDocument.facilitiesAndBuildingsFixedCost
        .otherFacilitiesAndBuildings2YearsOfUsefulLife;

    //Waste management
    const wasteStoragePondInitialInvestment =
      updatedDocument.wasteManagementFixedCosts
        .wasteStoragePondInitialInvestment;
    const wasteStoragePondYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts
        .wasteStoragePondYearsOfUsefulLife;

    const compactClayLinerInitialInvestment =
      updatedDocument.wasteManagementFixedCosts
        .compactClayLinerInitialInvestment;
    const compactClayLinerYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts
        .compactClayLinerYearsOfUsefulLife;

    const monitoringWellsInitialInvestment =
      updatedDocument.wasteManagementFixedCosts
        .monitoringWellsInitialInvestment;
    const monitoringWellsYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts
        .monitoringWellsYearsOfUsefulLife;

    const solidsSeparatorInitialInvestment =
      updatedDocument.wasteManagementFixedCosts
        .solidsSeparatorInitialInvestment;
    const solidsSeparatorYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts
        .solidsSeparatorYearsOfUsefulLife;

    const lagoonPumpInitialInvestment =
      updatedDocument.wasteManagementFixedCosts.lagoonPumpInitialInvestment;
    const lagoonPumpYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts.lagoonPumpYearsOfUsefulLife;

    const pipesInitialInvestment =
      updatedDocument.wasteManagementFixedCosts.pipesInitialInvestment;
    const pipesYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts.pipesYearsOfUsefulLife;

    const powerUnitInitialInvestment =
      updatedDocument.wasteManagementFixedCosts.powerUnitInitialInvestment;
    const powerUnitYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts.powerUnitYearsOfUsefulLife;

    const irrigationSystemInitialInvestment =
      updatedDocument.wasteManagementFixedCosts
        .irrigationSystemInitialInvestment;
    const irrigationSystemYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts
        .irrigationSystemYearsOfUsefulLife;

    const agitatorInitialInvestment =
      updatedDocument.wasteManagementFixedCosts.agitatorInitialInvestment;
    const agitatorYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts.agitatorYearsOfUsefulLife;

    const manureSpreaderInitialInvestment =
      updatedDocument.wasteManagementFixedCosts.manureSpreaderInitialInvestment;
    const manureSpreaderYearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts.manureSpreaderYearsOfUsefulLife;

    const otherManureManagementStructure1InitialInvestment =
      updatedDocument.wasteManagementFixedCosts
        .otherManureManagementStructure1InitialInvestment;
    const otherManureManagementStructure1YearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts
        .otherManureManagementStructure1YearsOfUsefulLife;

    const otherManureManagementStructure2InitialInvestment =
      updatedDocument.wasteManagementFixedCosts
        .otherManureManagementStructure2InitialInvestment;
    const otherManureManagementStructure2YearsOfUsefulLife =
      updatedDocument.wasteManagementFixedCosts
        .otherManureManagementStructure2YearsOfUsefulLife;

    const machineryFixedCostTotalEstimate =
      updatedDocument.machineryFixedCosts.machineryFixedCostTotalEstimate;

    const acres = updatedDocument.landFixedCosts.acres;
    const rentalCost = updatedDocument.landFixedCosts.rentalCost;

    // DETAILED MACHINERY FIXED COSTS
    // Articulated Loaders
    const articulatedLoadersInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.articulatedLoadersInitialInvestmentPerUnit;
    const numberOfArticulatedLoaders =
      updatedDocument.detailedMachineryFixedCosts?.numberOfArticulatedLoaders;
    const articulatedLoadersTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.articulatedLoadersTotalHoursOfUse;
    const articulatedLoadersDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.articulatedLoadersDairyHoursOfUse;
    const articulatedLoadersCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.articulatedLoadersCroppingHoursOfUse;
    const articulatedLoadersEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.articulatedLoadersEquipmentAge;
    const articulatedLoadersYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.articulatedLoadersYearsOfUsefulLife;

    // Skid Steer Loaders
    const skidSteerLoadersInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.skidSteerLoadersInitialInvestmentPerUnit;
    const numberOfSkidSteerLoaders =
      updatedDocument.detailedMachineryFixedCosts?.numberOfSkidSteerLoaders;
    const skidSteerLoadersTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.skidSteerLoadersTotalHoursOfUse;
    const skidSteerLoadersDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.skidSteerLoadersDairyHoursOfUse;
    const skidSteerLoadersCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.skidSteerLoadersCroppingHoursOfUse;
    const skidSteerLoadersEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.skidSteerLoadersEquipmentAge;
    const skidSteerLoadersYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.skidSteerLoadersYearsOfUsefulLife;

    // 130 hp Tractor - MFWD
    const hpTractorMFWD130InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor130MfwDInitialInvestmentPerUnit;
    const numberOfHpTractorMFWD130 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractorMFWD130;
    const hpTractorMFWD130TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor130MfwDTotalHoursOfUse;
    const hpTractorMFWD130DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor130MfwDDairyHoursOfUse;
    const hpTractorMFWD130CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor130MfwDCroppingHoursOfUse;
    const hpTractorMFWD130EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor130MfwDEquipmentAge;
    const hpTractorMFWD130YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor130MfwDYearsOfUsefulLife;

    // 75 hp Tractor - 2wd
    const hpTractor2wd75InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor75InitialInvestmentPerUnit;
    const numberOfHpTractor2wd75 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractor75;
    const hpTractor2wd75TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor75TotalHoursOfUse;
    const hpTractor2wd75DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor75DairyHoursOfUse;
    const hpTractor2wd75CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor75CroppingHoursOfUse;
    const hpTractor2wd75EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor75EquipmentAge;
    const hpTractor2wd75YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor75YearsOfUsefulLife;

    // 50 hp Tractor - 2wd
    const tractor50Hp2wdInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor50InitialInvestmentPerUnit;
    const numberOfHpTractor2wd50 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractor50;
    const tractor50Hp2wdTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor50TotalHoursOfUse;
    const tractor50Hp2wdDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor50DairyHoursOfUse;
    const tractor50Hp2wdCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor50CroppingHoursOfUse;
    const hpTractor2wd50EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor50EquipmentAge;
    const hpTractor2wd50YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor50YearsOfUsefulLife;

    // Mixer Wagon - 650 cubic feet
    const mixerWagon650InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.mixerWagon650InitialInvestmentPerUnit;
    const numberOfMixerWagon650 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfMixerWagon650;
    const mixerWagon650TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.mixerWagon650TotalHoursOfUse;
    const mixerWagon650DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.mixerWagon650DairyHoursOfUse;
    const mixerWagon650CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.mixerWagon650CroppingHoursOfUse;
    const mixerWagon650EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.mixerWagon650EquipmentAge;
    const mixerWagon650YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.mixerWagon650YearsOfUsefulLife;

    // ¾ ton pickup
    const threeQuarterTonPickupInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.threeQuarterTonPickupInitialInvestmentPerUnit;
    const numberOfThreeQuarterTonPickup =
      updatedDocument.detailedMachineryFixedCosts
        ?.numberOfThreeQuarterTonPickup;
    const threeQuarterTonPickupTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.threeQuarterTonPickupTotalHoursOfUse;
    const threeQuarterTonPickupDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.threeQuarterTonPickupDairyHoursOfUse;
    const threeQuarterTonPickupCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.threeQuarterTonPickupCroppingHoursOfUse;
    const threeQuarterTonPickupEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.threeQuarterTonPickupEquipmentAge;
    const threeQuarterTonPickupYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.threeQuarterTonPickupYearsOfUsefulLife;

    // ½ ton pickup
    const halfTonPickupInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.halfTonPickupInitialInvestmentPerUnit;
    const numberOfHalfTonPickup =
      updatedDocument.detailedMachineryFixedCosts?.numberOfHalfTonPickup;
    const halfTonPickupTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.halfTonPickupTotalHoursOfUse;
    const halfTonPickupDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.halfTonPickupDairyHoursOfUse;
    const halfTonPickupCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.halfTonPickupCroppingHoursOfUse;
    const halfTonPickupEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.halfTonPickupEquipmentAge;
    const halfTonPickupYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.halfTonPickupYearsOfUsefulLife;

    // JD Gator
    const jdGatorInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.jdGatorInitialInvestmentPerUnit;
    const numberOfJdGator =
      updatedDocument.detailedMachineryFixedCosts?.numberOfJdGator;
    const jdGatorTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.jdGatorTotalHoursOfUse;
    const jdGatorDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.jdGatorDairyHoursOfUse;
    const jdGatorCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.jdGatorCroppingHoursOfUse;
    const jdGatorEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.jdGatorEquipmentAge;
    const jdGatorYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts?.jdGatorYearsOfUsefulLife;

    // Sand Spreader
    const sandSpreaderInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.sandSpreaderInitialInvestmentPerUnit;
    const numberOfSandSpreader =
      updatedDocument.detailedMachineryFixedCosts?.numberOfSandSpreader;
    const sandSpreaderTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.sandSpreaderTotalHoursOfUse;
    const sandSpreaderDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.sandSpreaderDairyHoursOfUse;
    const sandSpreaderCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.sandSpreaderCroppingHoursOfUse;
    const sandSpreaderEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.sandSpreaderEquipmentAge;
    const sandSpreaderYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.sandSpreaderYearsOfUsefulLife;

    // 300 hp Tractor - MFWD
    const hpTractorMFWD300InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor300MfwDInitialInvestmentPerUnit;
    const numberOfHpTractorMFWD300 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractorMfwd300;
    const hpTractorMFWD300TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor300MfwDTotalHoursOfUse;
    const hpTractorMFWD300DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor300MfwDDairyHoursOfUse;
    const hpTractorMFWD300CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor300MfwDCroppingHoursOfUse;
    const hpTractorMFWD300EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor300MfwDEquipmentAge;
    const hpTractorMFWD300YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor300MfwDYearsOfUsefulLife;

    // 200 hp Tractor - MFWD
    const hpTractorMFWD200InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor200MfwDInitialInvestmentPerUnit;
    const numberOfHpTractorMFWD200 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractorMFWD200;
    const hpTractorMFWD200TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor200MfwDTotalHoursOfUse;
    const hpTractorMFWD200DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor200MfwDDairyHoursOfUse;
    const hpTractorMFWD200CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor200MfwDCroppingHoursOfUse;
    const hpTractorMFWD200EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.hpTractor200MfwDEquipmentAge;
    const hpTractorMFWD200YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.hpTractor200MfwDYearsOfUsefulLife;

    // 24’ disk harrow
    const diskHarrow24InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.diskHarrow24InitialInvestmentPerUnit;
    const numberOfDiskHarrow24 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfDiskHarrow24;
    const diskHarrow24TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.diskHarrow24TotalHoursOfUse;
    const diskHarrow24DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.diskHarrow24DairyHoursOfUse;
    const diskHarrow24CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.diskHarrow24CroppingHoursOfUse;
    const diskHarrow24EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.diskHarrow24EquipmentAge;
    const diskHarrow24YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.diskHarrow24YearsOfUsefulLife;

    // 8-row 30” strip-till planter
    const stripTillPlanter8RowInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.stripTillPlanter8RowInitialInvestmentPerUnit;
    const numberOfStripTillPlanter8Row =
      updatedDocument.detailedMachineryFixedCosts?.numberOfStripTillPlanter8Row;
    const stripTillPlanter8RowTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.stripTillPlanter8RowTotalHoursOfUse;
    const stripTillPlanter8RowDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.stripTillPlanter8RowDairyHoursOfUse;
    const stripTillPlanter8RowCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.stripTillPlanter8RowCroppingHoursOfUse;
    const stripTillPlanter8RowEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.stripTillPlanter8RowEquipmentAge;
    const stripTillPlanter8RowYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.stripTillPlanter8RowYearsOfUsefulLife;

    // 40’ folding sprayer
    const foldingSprayer40InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingSprayer40InitialInvestmentPerUnit;
    const numberOfFoldingSprayer40 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfFoldingSprayer40;
    const foldingSprayer40TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingSprayer40TotalHoursOfUse;
    const foldingSprayer40DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingSprayer40DairyHoursOfUse;
    const foldingSprayer40CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingSprayer40CroppingHoursOfUse;
    const foldingSprayer40EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.foldingSprayer40EquipmentAge;
    const foldingSprayer40YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingSprayer40YearsOfUsefulLife;

    // Field Cultivator
    const fieldCultivatorInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.fieldCultivatorInitialInvestmentPerUnit;
    const numberOfFieldCultivator =
      updatedDocument.detailedMachineryFixedCosts?.numberOfFieldCultivator;
    const fieldCultivatorTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.fieldCultivatorTotalHoursOfUse;
    const fieldCultivatorDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.fieldCultivatorDairyHoursOfUse;
    const fieldCultivatorCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.fieldCultivatorCroppingHoursOfUse;
    const fieldCultivatorEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.fieldCultivatorEquipmentAge;
    const fieldCultivatorYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.fieldCultivatorYearsOfUsefulLife;

    // Grain drill - 15’ no-till
    const grainDrill15NoTillInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.grainDrill15NoTillInitialInvestmentPerUnit;
    const numberOfGrainDrill15NoTill =
      updatedDocument.detailedMachineryFixedCosts?.numberOfGrainDrill15NoTill;
    const grainDrill15NoTillTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.grainDrill15NoTillTotalHoursOfUse;
    const grainDrill15NoTillDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.grainDrill15NoTillDairyHoursOfUse;
    const grainDrill15NoTillCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.grainDrill15NoTillCroppingHoursOfUse;
    const grainDrill15NoTillEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.grainDrill15NoTillEquipmentAge;
    const grainDrill15NoTillYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.grainDrill15NoTillYearsOfUsefulLife;

    // Mower conditioner (self-propelled)
    const mowerConditionerSelfPropelledInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.mowerConditionerSelfPropelledInitialInvestmentPerUnit;
    const numberOfMowerConditionerSelfPropelled =
      updatedDocument.detailedMachineryFixedCosts
        ?.numberOfMowerConditionerSelfPropelled;
    const mowerConditionerSelfPropelledTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.mowerConditionerSelfPropelledTotalHoursOfUse;
    const mowerConditionerSelfPropelledDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.mowerConditionerSelfPropelledDairyHoursOfUse;
    const mowerConditionerSelfPropelledCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.mowerConditionerSelfPropelledCroppingHoursOfUse;
    const mowerConditionerSelfPropelledEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.mowerConditionerSelfPropelledEquipmentAge;
    const mowerConditionerSelfPropelledYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.mowerConditionerSelfPropelledYearsOfUsefulLife;

    // Tedder
    const tedderInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.tedderInitialInvestmentPerUnit;
    const numberOfTedder =
      updatedDocument.detailedMachineryFixedCosts?.numberOfTedder;
    const tedderTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.tedderTotalHoursOfUse;
    const tedderDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.tedderDairyHoursOfUse;
    const tedderCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.tedderCroppingHoursOfUse;
    const tedderEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.tedderEquipmentAge;
    const tedderYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts?.tedderYearsOfUsefulLife;

    // Power Rake
    const powerRakeInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.powerRakeInitialInvestmentPerUnit;
    const numberOfPowerRake =
      updatedDocument.detailedMachineryFixedCosts?.numberOfPowerRake;
    const powerRakeTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.powerRakeTotalHoursOfUse;
    const powerRakeDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.powerRakeDairyHoursOfUse;
    const powerRakeCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.powerRakeCroppingHoursOfUse;
    const powerRakeEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.powerRakeEquipmentAge;
    const powerRakeYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts?.powerRakeYearsOfUsefulLife;

    // 15’ Folding Rotary Mower
    const foldingRotaryMower15InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingRotaryMower15InitialInvestmentPerUnit;
    const numberOfFoldingRotaryMower15 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfFoldingRotaryMower15;
    const foldingRotaryMower15TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingRotaryMower15TotalHoursOfUse;
    const foldingRotaryMower15DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingRotaryMower15DairyHoursOfUse;
    const foldingRotaryMower15CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingRotaryMower15CroppingHoursOfUse;
    const foldingRotaryMower15EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingRotaryMower15EquipmentAge;
    const foldingRotaryMower15YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.foldingRotaryMower15YearsOfUsefulLife;

    // Deep-ripper
    const deepRipperInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.deepRipperInitialInvestmentPerUnit;
    const numberOfDeepRipper =
      updatedDocument.detailedMachineryFixedCosts?.numberOfDeepRipper;
    const deepRipperTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.deepRipperTotalHoursOfUse;
    const deepRipperDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.deepRipperDairyHoursOfUse;
    const deepRipperCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.deepRipperCroppingHoursOfUse;
    const deepRipperEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.deepRipperEquipmentAge;
    const deepRipperYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts?.deepRipperYearsOfUsefulLife;

    // 24’ Livestock Trailer
    const livestockTrailer24InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.livestockTrailer24InitialInvestmentPerUnit;
    const numberOfLivestockTrailer24 =
      updatedDocument.detailedMachineryFixedCosts?.numberOfLivestockTrailer24;
    const livestockTrailer24TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.livestockTrailer24TotalHoursOfUse;
    const livestockTrailer24DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.livestockTrailer24DairyHoursOfUse;
    const livestockTrailer24CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.livestockTrailer24CroppingHoursOfUse;
    const livestockTrailer24EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.livestockTrailer24EquipmentAge;
    const livestockTrailer24YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.livestockTrailer24YearsOfUsefulLife;

    // Round Baler
    const roundBalerInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.roundBalerInitialInvestmentPerUnit;
    const numberOfRoundBaler =
      updatedDocument.detailedMachineryFixedCosts?.numberOfRoundBaler;
    const roundBalerTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.roundBalerTotalHoursOfUse;
    const roundBalerDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.roundBalerDairyHoursOfUse;
    const roundBalerCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.roundBalerCroppingHoursOfUse;
    const roundBalerEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.roundBalerEquipmentAge;
    const roundBalerYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts?.roundBalerYearsOfUsefulLife;

    // Tub Grinder
    const tubGrinderInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.tubGrinderInitialInvestmentPerUnit;
    const numberOfTubGrinder =
      updatedDocument.detailedMachineryFixedCosts?.numberOfTubGrinder;
    const tubGrinderTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.tubGrinderTotalHoursOfUse;
    const tubGrinderDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.tubGrinderDairyHoursOfUse;
    const tubGrinderCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts?.tubGrinderCroppingHoursOfUse;
    const tubGrinderEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts?.tubGrinderEquipmentAge;
    const tubGrinderYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts?.tubGrinderYearsOfUsefulLife;

    // Miscellaneous Equipment
    const miscellaneousEquipmentInitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.miscellaneousEquipmentInitialInvestmentPerUnit;
    const numberOfMiscellaneousEquipment =
      updatedDocument.detailedMachineryFixedCosts
        ?.numberOfMiscellaneousEquipment;
    const miscellaneousEquipmentTotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.miscellaneousEquipmentTotalHoursOfUse;
    const miscellaneousEquipmentDairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.miscellaneousEquipmentDairyHoursOfUse;
    const miscellaneousEquipmentCroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.miscellaneousEquipmentCroppingHoursOfUse;
    const miscellaneousEquipmentEquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.miscellaneousEquipmentEquipmentAge;
    const miscellaneousEquipmentYearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.miscellaneousEquipmentYearsOfUsefulLife;

    // Other Machinery and Equipment 1
    const otherMachineryEquipment1InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment1InitialInvestmentPerUnit;
    const numberOfOtherMachineryEquipment1 =
      updatedDocument.detailedMachineryFixedCosts
        ?.numberOfOtherMachineryEquipment1;
    const otherMachineryEquipment1TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment1TotalHoursOfUse;
    const otherMachineryEquipment1DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment1DairyHoursOfUse;
    const otherMachineryEquipment1CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment1CroppingHoursOfUse;
    const otherMachineryEquipment1EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment1EquipmentAge;
    const otherMachineryEquipment1YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment1YearsOfUsefulLife;

    // Other Machinery and Equipment 2
    const otherMachineryEquipment2InitialInvestmentPerUnit =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment2InitialInvestmentPerUnit;
    const numberOfOtherMachineryEquipment2 =
      updatedDocument.detailedMachineryFixedCosts
        ?.numberOfOtherMachineryEquipment2;
    const otherMachineryEquipment2TotalHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment2TotalHoursOfUse;
    const otherMachineryEquipment2DairyHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment2DairyHoursOfUse;
    const otherMachineryEquipment2CroppingHoursOfUse =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment2CroppingHoursOfUse;
    const otherMachineryEquipment2EquipmentAge =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment2EquipmentAge;
    const otherMachineryEquipment2YearsOfUsefulLife =
      updatedDocument.detailedMachineryFixedCosts
        ?.otherMachineryEquipment2YearsOfUsefulLife;

    //------->>>Temp variables required to calculate operating costs output
    const totalNumberOfCows =
      productionDetailsInputs.milkProduction.totalNumberOfCows;
    const cullCowsPrice = receiptsInput.cullCowsPrice;
    const cowDeathLossRate =
      productionDetailsInputs.heiferProduction.cowDeathLossRate;
    const cullingRate = productionDetailsInputs.heiferProduction.cullingRate;

    // const livestockInsuranceRate = 0.35;
    // const propertyTaxRate = 0.7;
    // const propertyInsuranceRate = 0.25;
    // const machineryAndEquipmentInsuranceRate = 0.286;
    // const longTermInterestRate = 4.5;
    // const shortTermInterestRate = 5.5;

    //Map for Age and its categories
    const ageCategories = new Map([
      [
        1,
        {
          HarvestingCrop: 69,
          HarvestingForage: 56,
          Misc: 61,
          Planters: 65,
          Tilage: 61,
          Tractor_150hp: 67,
          Tractors_80_149hp: 68,
        },
      ],
      [
        2,
        {
          HarvestingCrop: 58,
          HarvestingForage: 50,
          Misc: 54,
          Planters: 60,
          Tilage: 54,
          Tractor_150hp: 59,
          Tractors_80_149hp: 62,
        },
      ],
      [
        3,
        {
          HarvestingCrop: 50,
          HarvestingForage: 46,
          Misc: 49,
          Planters: 56,
          Tilage: 49,
          Tractor_150hp: 54,
          Tractors_80_149hp: 57,
        },
      ],
      [
        4,
        {
          HarvestingCrop: 44,
          HarvestingForage: 42,
          Misc: 45,
          Planters: 53,
          Tilage: 45,
          Tractor_150hp: 49,
          Tractors_80_149hp: 53,
        },
      ],
      [
        5,
        {
          HarvestingCrop: 39,
          HarvestingForage: 39,
          Misc: 42,
          Planters: 50,
          Tilage: 42,
          Tractor_150hp: 45,
          Tractors_80_149hp: 49,
        },
      ],
      [
        6,
        {
          HarvestingCrop: 35,
          HarvestingForage: 37,
          Misc: 39,
          Planters: 48,
          Tilage: 39,
          Tractor_150hp: 42,
          Tractors_80_149hp: 46,
        },
      ],
      [
        7,
        {
          HarvestingCrop: 31,
          HarvestingForage: 34,
          Misc: 36,
          Planters: 46,
          Tilage: 36,
          Tractor_150hp: 39,
          Tractors_80_149hp: 44,
        },
      ],
      [
        8,
        {
          HarvestingCrop: 28,
          HarvestingForage: 32,
          Misc: 34,
          Planters: 44,
          Tilage: 34,
          Tractor_150hp: 36,
          Tractors_80_149hp: 41,
        },
      ],
      [
        9,
        {
          HarvestingCrop: 25,
          HarvestingForage: 30,
          Misc: 31,
          Planters: 42,
          Tilage: 31,
          Tractor_150hp: 34,
          Tractors_80_149hp: 39,
        },
      ],
      [
        10,
        {
          HarvestingCrop: 22,
          HarvestingForage: 28,
          Misc: 30,
          Planters: 40,
          Tilage: 30,
          Tractor_150hp: 32,
          Tractors_80_149hp: 37,
        },
      ],
      [
        11,
        {
          HarvestingCrop: 20,
          HarvestingForage: 27,
          Misc: 28,
          Planters: 39,
          Tilage: 28,
          Tractor_150hp: 30,
          Tractors_80_149hp: 35,
        },
      ],
      [
        12,
        {
          HarvestingCrop: 18,
          HarvestingForage: 25,
          Misc: 26,
          Planters: 38,
          Tilage: 26,
          Tractor_150hp: 28,
          Tractors_80_149hp: 34,
        },
      ],
    ]);

    //------->>>Few other variables required to calculate operating costs output
    const cowInitialInvestmentValue = totalNumberOfCows * cowPurchaseValue;
    const cowEstimatedSalvageValue =
      totalNumberOfCows * cullCowsPrice * (1 - cowDeathLossRate / 100);
    const cowYearsOfUsefulLife = 1 / (cullingRate / 100);
    const cowAnnualAmortization =
      ((cowInitialInvestmentValue - cowEstimatedSalvageValue) *
        (shortTermInterestRate / 100)) /
        (1 - Math.pow(1 + shortTermInterestRate / 100, -cowYearsOfUsefulLife)) +
      cowEstimatedSalvageValue * (shortTermInterestRate / 100);
    const cowInsurance =
      cowInitialInvestmentValue * (livestockInsuranceRate / 100);
    const cowTotalAnnualEconomicCost = cowAnnualAmortization + cowInsurance;

    const bredHeiferInitialInvestment =
      numberOfBredHeifers * bredHeiferPurchaseValue;
    const bredHeiferSalvageValue =
      numberOfBredHeifers * cullCowsPrice * (1 - cowDeathLossRate / 100);
    const bredHeiferYearsofUsefulLife = 1 / (cullingRate / 100) + 1;
    const bredHeiferAnnualAmortization =
      ((bredHeiferInitialInvestment - bredHeiferSalvageValue) *
        (shortTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + shortTermInterestRate / 100,
            -bredHeiferYearsofUsefulLife,
          )) +
      bredHeiferSalvageValue * (shortTermInterestRate / 100);
    const bredHeiferInsurance =
      bredHeiferInitialInvestment * (livestockInsuranceRate / 100);
    const bredHeiferTotalAnnualEconomicCost =
      bredHeiferAnnualAmortization + bredHeiferInsurance;

    //FACILITIES and BUILDINGS
    const farmShopandGeneralRoadsEstimatedSalvageValue =
      farmShopAndGeneralRoadsInitialInvestment * (3 / 10);
    const farmShopandGeneralRoadsAnnualAmortization =
      ((farmShopAndGeneralRoadsInitialInvestment -
        farmShopandGeneralRoadsEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -farmShopAndGeneralRoadsYearsOfUsefulLife,
          )) +
      farmShopandGeneralRoadsEstimatedSalvageValue *
        (longTermInterestRate / 100);
    const farmShopandGeneralRoadsPropertyTax =
      farmShopAndGeneralRoadsInitialInvestment * (propertyTaxRate / 100);
    const farmShopandGeneralRoadsPropertyInsurance =
      farmShopAndGeneralRoadsInitialInvestment * (propertyInsuranceRate / 100);
    const farmShopandGeneralRoadsTotalAnnualEconomicCost =
      farmShopandGeneralRoadsAnnualAmortization +
      farmShopandGeneralRoadsPropertyTax +
      farmShopandGeneralRoadsPropertyInsurance;

    const milkingParlorAndEquipmentEstimatedSalvageValue =
      milkingParlorAndEquipmentInitialInvestment * (3 / 10);
    const milkingParlorAndEquipmentAnnualAmortization =
      ((milkingParlorAndEquipmentInitialInvestment -
        milkingParlorAndEquipmentEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -milkingParlorAndEquipmentYearsOfUsefulLife,
          )) +
      milkingParlorAndEquipmentEstimatedSalvageValue *
        (longTermInterestRate / 100);
    const milkingParlorAndEquipmentPropertyTax =
      milkingParlorAndEquipmentInitialInvestment * (propertyTaxRate / 100);
    const milkingParlorAndEquipmentPropertyInsurance =
      milkingParlorAndEquipmentInitialInvestment *
      (propertyInsuranceRate / 100);
    const milkingParlorAndEquipmentTotalAnnualEconomicCost =
      milkingParlorAndEquipmentAnnualAmortization +
      milkingParlorAndEquipmentPropertyTax +
      milkingParlorAndEquipmentPropertyInsurance;

    const feedingEquipmentEstimatedSalvageValue =
      feedingEquipmentInitialInvestment * (3 / 10);
    const feedingEquipmentAnnualAmortization =
      ((feedingEquipmentInitialInvestment -
        feedingEquipmentEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -feedingEquipmentYearsOfUsefulLife,
          )) +
      feedingEquipmentEstimatedSalvageValue * (longTermInterestRate / 100);
    const feedingEquipmentPropertyTax =
      feedingEquipmentInitialInvestment * (propertyTaxRate / 100);
    const feedingEquipmentPropertyInsurance =
      feedingEquipmentInitialInvestment * (propertyInsuranceRate / 100);
    const feedingEquipmentTotalAnnualEconomicCost =
      feedingEquipmentAnnualAmortization +
      feedingEquipmentPropertyTax +
      feedingEquipmentPropertyInsurance;

    const freestallHousingandLanesEstimatedSalvageValue =
      freestallHousingAndLanesInitialInvestment * (3 / 10);
    const freestallHousingandLanesAnnualAmortization =
      ((freestallHousingAndLanesInitialInvestment -
        freestallHousingandLanesEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -freestallHousingAndLanesYearsOfUsefulLife,
          )) +
      freestallHousingandLanesEstimatedSalvageValue *
        (longTermInterestRate / 100);
    const freestallHousingandLanesPropertyTax =
      freestallHousingAndLanesInitialInvestment * (propertyTaxRate / 100);
    const freestallHousingandLanesPropertyInsurance =
      freestallHousingAndLanesInitialInvestment * (propertyInsuranceRate / 100);
    const freestallHousingandLanesTotalAnnualEconomicCost =
      freestallHousingandLanesAnnualAmortization +
      freestallHousingandLanesPropertyTax +
      freestallHousingandLanesPropertyInsurance;

    const threePhasePowerSupplyEstimatedSalvageValue =
      threePhasePowerSupplyInitialInvestment * (3 / 10);
    const threePhasePowerSupplyAnnualAmortization =
      ((threePhasePowerSupplyInitialInvestment -
        threePhasePowerSupplyEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -threePhasePowerSupplyYearsOfUsefulLife,
          )) +
      threePhasePowerSupplyEstimatedSalvageValue * (longTermInterestRate / 100);
    const threePhasePowerSupplyPropertyTax =
      threePhasePowerSupplyInitialInvestment * (propertyTaxRate / 100);
    const threePhasePowerSupplyPropertyInsurance =
      threePhasePowerSupplyInitialInvestment * (propertyInsuranceRate / 100);
    const threePhasePowerSupplyTotalAnnualEconomicCost =
      threePhasePowerSupplyAnnualAmortization +
      threePhasePowerSupplyPropertyTax +
      threePhasePowerSupplyPropertyInsurance;

    const waterSystemEstimatedSalvageValue =
      waterSystemInitialInvestment * (3 / 10);
    const waterSystemAnnualAmortization =
      ((waterSystemInitialInvestment - waterSystemEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -waterSystemYearsOfUsefulLife,
          )) +
      waterSystemEstimatedSalvageValue * (longTermInterestRate / 100);
    const waterSystemPropertyTax =
      waterSystemInitialInvestment * (propertyTaxRate / 100);
    const waterSystemPropertyInsurance =
      waterSystemInitialInvestment * (propertyInsuranceRate / 100);
    const waterSystemTotalAnnualEconomicCost =
      waterSystemAnnualAmortization +
      waterSystemPropertyTax +
      waterSystemPropertyInsurance;

    const hayShedEstimatedSalvageValue = hayShedInitialInvestment * (3 / 10);
    const hayShedAnnualAmortization =
      ((hayShedInitialInvestment - hayShedEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(1 + longTermInterestRate / 100, -hayShedYearsOfUsefulLife)) +
      hayShedEstimatedSalvageValue * (longTermInterestRate / 100);
    const hayShedPropertyTax =
      hayShedInitialInvestment * (propertyTaxRate / 100);
    const hayShedPropertyInsurance =
      hayShedInitialInvestment * (propertyInsuranceRate / 100);
    const hayShedTotalAnnualEconomicCost =
      hayShedAnnualAmortization + hayShedPropertyTax + hayShedPropertyInsurance;

    const trenchSilosEstimatedSalvageValue =
      trenchSilosInitialInvestment * (3 / 10);
    const trenchSilosAnnualAmortization =
      ((trenchSilosInitialInvestment - trenchSilosEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -trenchSilosYearsOfUsefulLife,
          )) +
      trenchSilosEstimatedSalvageValue * (longTermInterestRate / 100);
    const trenchSilosPropertyTax =
      trenchSilosInitialInvestment * (propertyTaxRate / 100);
    const trenchSilosPropertyInsurance =
      trenchSilosInitialInvestment * (propertyInsuranceRate / 100);
    const trenchSilosTotalAnnualEconomicCost =
      trenchSilosAnnualAmortization +
      trenchSilosPropertyTax +
      trenchSilosPropertyInsurance;

    const fencesEstimatedSalvageValue = fencesInitialInvestment * (3 / 10);
    const fencesAnnualAmortization =
      ((fencesInitialInvestment - fencesEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(1 + longTermInterestRate / 100, -fencesYearsOfUsefulLife)) +
      fencesEstimatedSalvageValue * (longTermInterestRate / 100);
    const fencesPropertyTax = fencesInitialInvestment * (propertyTaxRate / 100);
    const fencesPropertyInsurance =
      fencesInitialInvestment * (propertyInsuranceRate / 100);
    const fencesTotalAnnualEconomicCost =
      fencesAnnualAmortization + fencesPropertyTax + fencesPropertyInsurance;

    const commodityBarnEstimatedSalvageValue =
      commodityBarnInitialInvestment * (3 / 10);
    const commodityBarnAnnualAmortization =
      ((commodityBarnInitialInvestment - commodityBarnEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -commodityBarnYearsOfUsefulLife,
          )) +
      commodityBarnEstimatedSalvageValue * (longTermInterestRate / 100);
    const commodityBarnPropertyTax =
      commodityBarnInitialInvestment * (propertyTaxRate / 100);
    const commodityBarnPropertyInsurance =
      commodityBarnInitialInvestment * (propertyInsuranceRate / 100);
    const commodityBarnTotalAnnualEconomicCost =
      commodityBarnAnnualAmortization +
      commodityBarnPropertyTax +
      commodityBarnPropertyInsurance;

    const calfOrHeiferBarnEstimatedSalvageValue =
      calfOrHeiferBarnInitialInvestment * (3 / 10);
    const calfOrHeiferBarnAnnualAmortization =
      ((calfOrHeiferBarnInitialInvestment -
        calfOrHeiferBarnEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -calfOrHeiferBarnYearsOfUsefulLife,
          )) +
      calfOrHeiferBarnEstimatedSalvageValue * (longTermInterestRate / 100);
    const calfOrHeiferBarnPropertyTax =
      calfOrHeiferBarnInitialInvestment * (propertyTaxRate / 100);
    const calfOrHeiferBarnPropertyInsurance =
      calfOrHeiferBarnInitialInvestment * (propertyInsuranceRate / 100);
    const calfOrHeiferBarnTotalAnnualEconomicCost =
      calfOrHeiferBarnAnnualAmortization +
      calfOrHeiferBarnPropertyTax +
      calfOrHeiferBarnPropertyInsurance;

    const tiltTableEstimatedSalvageValue =
      tiltTableInitialInvestment * (3 / 10);
    const tiltTableAnnualAmortization =
      ((tiltTableInitialInvestment - tiltTableEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -tiltTableYearsOfUsefulLife,
          )) +
      tiltTableEstimatedSalvageValue * (longTermInterestRate / 100);
    const tiltTablePropertyTax =
      tiltTableInitialInvestment * (propertyTaxRate / 100);
    const tiltTablePropertyInsurance =
      tiltTableInitialInvestment * (propertyInsuranceRate / 100);
    const tiltTableTotalAnnualEconomicCost =
      tiltTableAnnualAmortization +
      tiltTablePropertyTax +
      tiltTablePropertyInsurance;

    const cattleHandlingFacilitiesEstimatedSalvageValue =
      cattleHandlingFacilitiesInitialInvestment * (3 / 10);
    const cattleHandlingFacilitiesAnnualAmortization =
      ((cattleHandlingFacilitiesInitialInvestment -
        cattleHandlingFacilitiesEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -cattleHandlingFacilitiesYearsOfUsefulLife,
          )) +
      cattleHandlingFacilitiesEstimatedSalvageValue *
        (longTermInterestRate / 100);
    const cattleHandlingFacilitiesPropertyTax =
      cattleHandlingFacilitiesInitialInvestment * (propertyTaxRate / 100);
    const cattleHandlingFacilitiesPropertyInsurance =
      cattleHandlingFacilitiesInitialInvestment * (propertyInsuranceRate / 100);
    const cattleHandlingFacilitiesTotalAnnualEconomicCost =
      cattleHandlingFacilitiesAnnualAmortization +
      cattleHandlingFacilitiesPropertyTax +
      cattleHandlingFacilitiesPropertyInsurance;

    const otherFacilitiesAndBuildings1EstimatedSalvageValue =
      otherFacilitiesAndBuildings1InitialInvestment * (3 / 10);
    const otherFacilitiesAndBuildings1AnnualAmortization =
      ((otherFacilitiesAndBuildings1InitialInvestment -
        otherFacilitiesAndBuildings1EstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -otherFacilitiesAndBuildings1YearsOfUsefulLife,
          )) +
      otherFacilitiesAndBuildings1EstimatedSalvageValue *
        (longTermInterestRate / 100);
    const otherFacilitiesAndBuildings1PropertyTax =
      otherFacilitiesAndBuildings1InitialInvestment * (propertyTaxRate / 100);
    const otherFacilitiesAndBuildings1PropertyInsurance =
      otherFacilitiesAndBuildings1InitialInvestment *
      (propertyInsuranceRate / 100);
    const otherFacilitiesAndBuildings1TotalAnnualEconomicCost =
      otherFacilitiesAndBuildings1AnnualAmortization +
      otherFacilitiesAndBuildings1PropertyTax +
      otherFacilitiesAndBuildings1PropertyInsurance;

    const otherFacilitiesAndBuildings2EstimatedSalvageValue =
      otherFacilitiesAndBuildings2InitialInvestment * (3 / 10);
    const otherFacilitiesAndBuildings2AnnualAmortization =
      ((otherFacilitiesAndBuildings2InitialInvestment -
        otherFacilitiesAndBuildings2EstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -otherFacilitiesAndBuildings2YearsOfUsefulLife,
          )) +
      otherFacilitiesAndBuildings2EstimatedSalvageValue *
        (longTermInterestRate / 100);
    const otherFacilitiesAndBuildings2PropertyTax =
      otherFacilitiesAndBuildings2InitialInvestment * (propertyTaxRate / 100);
    const otherFacilitiesAndBuildings2PropertyInsurance =
      otherFacilitiesAndBuildings2InitialInvestment *
      (propertyInsuranceRate / 100);
    const otherFacilitiesAndBuildings2TotalAnnualEconomicCost =
      otherFacilitiesAndBuildings2AnnualAmortization +
      otherFacilitiesAndBuildings2PropertyTax +
      otherFacilitiesAndBuildings2PropertyInsurance;

    //WASTE MANAGEMENT
    const wasteStoragePondEstimatedSalvageValue =
      wasteStoragePondInitialInvestment * (3 / 10);
    const wasteStoragePondAnnualAmortization =
      ((wasteStoragePondInitialInvestment -
        wasteStoragePondEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -wasteStoragePondYearsOfUsefulLife,
          )) +
      wasteStoragePondEstimatedSalvageValue * (longTermInterestRate / 100);
    const wasteStoragePondPropertyTax =
      wasteStoragePondInitialInvestment * (propertyTaxRate / 100);
    const wasteStoragePondPropertyInsurance =
      wasteStoragePondInitialInvestment * (propertyInsuranceRate / 100);
    const wasteStoragePondTotalAnnualEconomicCost =
      wasteStoragePondAnnualAmortization +
      wasteStoragePondPropertyTax +
      wasteStoragePondPropertyInsurance;

    const compactClayLinerEstimatedSalvageValue =
      compactClayLinerInitialInvestment * (3 / 10);
    const compactClayLinerAnnualAmortization =
      ((compactClayLinerInitialInvestment -
        compactClayLinerEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -compactClayLinerYearsOfUsefulLife,
          )) +
      compactClayLinerEstimatedSalvageValue * (longTermInterestRate / 100);
    const compactClayLinerPropertyTax =
      compactClayLinerInitialInvestment * (propertyTaxRate / 100);
    const compactClayLinerPropertyInsurance =
      compactClayLinerInitialInvestment * (propertyInsuranceRate / 100);
    const compactClayLinerTotalAnnualEconomicCost =
      compactClayLinerAnnualAmortization +
      compactClayLinerPropertyTax +
      compactClayLinerPropertyInsurance;

    const monitoringWellsEstimatedSalvageValue =
      monitoringWellsInitialInvestment * (3 / 10);
    const monitoringWellsAnnualAmortization =
      ((monitoringWellsInitialInvestment -
        monitoringWellsEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -monitoringWellsYearsOfUsefulLife,
          )) +
      monitoringWellsEstimatedSalvageValue * (longTermInterestRate / 100);
    const monitoringWellsPropertyTax =
      monitoringWellsInitialInvestment * (propertyTaxRate / 100);
    const monitoringWellsPropertyInsurance =
      monitoringWellsInitialInvestment * (propertyInsuranceRate / 100);
    const monitoringWellsTotalAnnualEconomicCost =
      monitoringWellsAnnualAmortization +
      monitoringWellsPropertyTax +
      monitoringWellsPropertyInsurance;

    const solidsSeparatorEstimatedSalvageValue =
      solidsSeparatorInitialInvestment * (3 / 10);
    const solidsSeparatorAnnualAmortization =
      ((solidsSeparatorInitialInvestment -
        solidsSeparatorEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -solidsSeparatorYearsOfUsefulLife,
          )) +
      solidsSeparatorEstimatedSalvageValue * (longTermInterestRate / 100);
    const solidsSeparatorPropertyTax =
      solidsSeparatorInitialInvestment * (propertyTaxRate / 100);
    const solidsSeparatorPropertyInsurance =
      solidsSeparatorInitialInvestment * (propertyInsuranceRate / 100);
    const solidsSeparatorTotalAnnualEconomicCost =
      solidsSeparatorAnnualAmortization +
      solidsSeparatorPropertyTax +
      solidsSeparatorPropertyInsurance;

    const lagoonPumpEstimatedSalvageValue =
      lagoonPumpInitialInvestment * (3 / 10);
    const lagoonPumpAnnualAmortization =
      ((lagoonPumpInitialInvestment - lagoonPumpEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -lagoonPumpYearsOfUsefulLife,
          )) +
      lagoonPumpEstimatedSalvageValue * (longTermInterestRate / 100);
    const lagoonPumpPropertyTax =
      lagoonPumpInitialInvestment * (propertyTaxRate / 100);
    const lagoonPumpPropertyInsurance =
      lagoonPumpInitialInvestment * (propertyInsuranceRate / 100);
    const lagoonPumpTotalAnnualEconomicCost =
      lagoonPumpAnnualAmortization +
      lagoonPumpPropertyTax +
      lagoonPumpPropertyInsurance;

    const pipesEstimatedSalvageValue = pipesInitialInvestment * (3 / 10);
    const pipesAnnualAmortization =
      ((pipesInitialInvestment - pipesEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(1 + longTermInterestRate / 100, -pipesYearsOfUsefulLife)) +
      pipesEstimatedSalvageValue * (longTermInterestRate / 100);
    const pipesPropertyTax = pipesInitialInvestment * (propertyTaxRate / 100);
    const pipesPropertyInsurance =
      pipesInitialInvestment * (propertyInsuranceRate / 100);
    const pipesTotalAnnualEconomicCost =
      pipesAnnualAmortization + pipesPropertyTax + pipesPropertyInsurance;

    const powerUnitEstimatedSalvageValue =
      powerUnitInitialInvestment * (3 / 10);
    const powerUnitAnnualAmortization =
      ((powerUnitInitialInvestment - powerUnitEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -powerUnitYearsOfUsefulLife,
          )) +
      powerUnitEstimatedSalvageValue * (longTermInterestRate / 100);
    const powerUnitPropertyTax =
      powerUnitInitialInvestment * (propertyTaxRate / 100);
    const powerUnitPropertyInsurance =
      powerUnitInitialInvestment * (propertyInsuranceRate / 100);
    const powerUnitTotalAnnualEconomicCost =
      powerUnitAnnualAmortization +
      powerUnitPropertyTax +
      powerUnitPropertyInsurance;

    const irrigationSystemEstimatedSalvageValue =
      irrigationSystemInitialInvestment * (3 / 10);
    const irrigationSystemAnnualAmortization =
      ((irrigationSystemInitialInvestment -
        irrigationSystemEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -irrigationSystemYearsOfUsefulLife,
          )) +
      irrigationSystemEstimatedSalvageValue * (longTermInterestRate / 100);
    const irrigationSystemPropertyTax =
      irrigationSystemInitialInvestment * (propertyTaxRate / 100);
    const irrigationSystemPropertyInsurance =
      irrigationSystemInitialInvestment * (propertyInsuranceRate / 100);
    const irrigationSystemTotalAnnualEconomicCost =
      irrigationSystemAnnualAmortization +
      irrigationSystemPropertyTax +
      irrigationSystemPropertyInsurance;

    const agitatorEstimatedSalvageValue = agitatorInitialInvestment * (3 / 10);
    const agitatorAnnualAmortization =
      ((agitatorInitialInvestment - agitatorEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -agitatorYearsOfUsefulLife,
          )) +
      agitatorEstimatedSalvageValue * (longTermInterestRate / 100);
    const agitatorPropertyTax =
      agitatorInitialInvestment * (propertyTaxRate / 100);
    const agitatorPropertyInsurance =
      agitatorInitialInvestment * (propertyInsuranceRate / 100);
    const agitatorTotalAnnualEconomicCost =
      agitatorAnnualAmortization +
      agitatorPropertyTax +
      agitatorPropertyInsurance;

    const manureSpreaderEstimatedSalvageValue =
      manureSpreaderInitialInvestment * (3 / 10);
    const manureSpreaderAnnualAmortization =
      ((manureSpreaderInitialInvestment - manureSpreaderEstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -manureSpreaderYearsOfUsefulLife,
          )) +
      manureSpreaderEstimatedSalvageValue * (longTermInterestRate / 100);
    const manureSpreaderPropertyTax =
      manureSpreaderInitialInvestment * (propertyTaxRate / 100);
    const manureSpreaderPropertyInsurance =
      manureSpreaderInitialInvestment * (propertyInsuranceRate / 100);
    const manureSpreaderTotalAnnualEconomicCost =
      manureSpreaderAnnualAmortization +
      manureSpreaderPropertyTax +
      manureSpreaderPropertyInsurance;

    const otherManureManagementStructure1EstimatedSalvageValue =
      otherManureManagementStructure1InitialInvestment * (3 / 10);
    const otherManureManagementStructure1AnnualAmortization =
      ((otherManureManagementStructure1InitialInvestment -
        otherManureManagementStructure1EstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -otherManureManagementStructure1YearsOfUsefulLife,
          )) +
      otherManureManagementStructure1EstimatedSalvageValue *
        (longTermInterestRate / 100);
    const otherManureManagementStructure1PropertyTax =
      otherManureManagementStructure1InitialInvestment *
      (propertyTaxRate / 100);
    const otherManureManagementStructure1PropertyInsurance =
      otherManureManagementStructure1InitialInvestment *
      (propertyInsuranceRate / 100);
    const otherManureManagementStructure1TotalAnnualEconomicCost =
      otherManureManagementStructure1AnnualAmortization +
      otherManureManagementStructure1PropertyTax +
      otherManureManagementStructure1PropertyInsurance;

    const otherManureManagementStructure2EstimatedSalvageValue =
      otherManureManagementStructure2InitialInvestment * (3 / 10);
    const otherManureManagementStructure2AnnualAmortization =
      ((otherManureManagementStructure2InitialInvestment -
        otherManureManagementStructure2EstimatedSalvageValue) *
        (longTermInterestRate / 100)) /
        (1 -
          Math.pow(
            1 + longTermInterestRate / 100,
            -otherManureManagementStructure2YearsOfUsefulLife,
          )) +
      otherManureManagementStructure2EstimatedSalvageValue *
        (longTermInterestRate / 100);
    const otherManureManagementStructure2PropertyTax =
      otherManureManagementStructure2InitialInvestment *
      (propertyTaxRate / 100);
    const otherManureManagementStructure2PropertyInsurance =
      otherManureManagementStructure2InitialInvestment *
      (propertyInsuranceRate / 100);
    const otherManureManagementStructure2TotalAnnualEconomicCost =
      otherManureManagementStructure2AnnualAmortization +
      otherManureManagementStructure2PropertyTax +
      otherManureManagementStructure2PropertyInsurance;

    //LAND FIXED COSTS
    const totalLandRentalCost = acres * rentalCost;

    let totalMachineryFixedCost: number = machineryFixedCostTotalEstimate;
    let totalCroppingAnnualEconomicCosts: number = 0;

    if (updatedDocument.isDetailedMachineryCosts) {
      // DETAILED MACHINERY FIXED COSTS
      // Articulated Loaders
      const articulatedLoadersInitialInvestment =
        numberOfArticulatedLoaders * articulatedLoadersInitialInvestmentPerUnit;
      const articulatedLoadersEstimatedCurrentSalvageValue =
        articulatedLoadersInitialInvestment *
        (ageCategories.get(articulatedLoadersEquipmentAge).Misc / 100);
      const articulatedLoadersEstimatedFinalSalvageValue =
        articulatedLoadersInitialInvestment *
        (ageCategories.get(articulatedLoadersYearsOfUsefulLife).Misc / 100);
      const articulatedLoadersAnnualAmortization =
        ((articulatedLoadersEstimatedCurrentSalvageValue -
          articulatedLoadersEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                articulatedLoadersYearsOfUsefulLife -
                articulatedLoadersEquipmentAge
              ),
            )) +
        articulatedLoadersEstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const articulatedLoadersPropertyTax =
        articulatedLoadersEstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const articulatedLoadersPropertyInsurance =
        articulatedLoadersInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const articulatedLoadersTotalAnnualEconomicCost =
        (articulatedLoadersAnnualAmortization +
          articulatedLoadersPropertyTax +
          articulatedLoadersPropertyInsurance) *
        (articulatedLoadersDairyHoursOfUse / articulatedLoadersTotalHoursOfUse);
      const articulatedLoadersCroppingAnnualEconomicCost =
        (articulatedLoadersAnnualAmortization +
          articulatedLoadersPropertyTax +
          articulatedLoadersPropertyInsurance) *
        (articulatedLoadersCroppingHoursOfUse /
          articulatedLoadersTotalHoursOfUse);

      // Skid Steer Loaders
      const skidSteerLoadersInitialInvestment =
        numberOfSkidSteerLoaders * skidSteerLoadersInitialInvestmentPerUnit;
      const skidSteerLoadersEstimatedCurrentSalvageValue =
        skidSteerLoadersInitialInvestment *
        (ageCategories.get(skidSteerLoadersEquipmentAge).Misc / 100);
      const skidSteerLoadersEstimatedFinalSalvageValue =
        skidSteerLoadersInitialInvestment *
        (ageCategories.get(skidSteerLoadersYearsOfUsefulLife).Misc / 100);
      const skidSteerLoadersAnnualAmortization =
        ((skidSteerLoadersEstimatedCurrentSalvageValue -
          skidSteerLoadersEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                skidSteerLoadersYearsOfUsefulLife - skidSteerLoadersEquipmentAge
              ),
            )) +
        skidSteerLoadersEstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const skidSteerLoadersPropertyTax =
        skidSteerLoadersEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const skidSteerLoadersPropertyInsurance =
        skidSteerLoadersInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const skidSteerLoadersTotalAnnualEconomicCost =
        (skidSteerLoadersAnnualAmortization +
          skidSteerLoadersPropertyTax +
          skidSteerLoadersPropertyInsurance) *
        (skidSteerLoadersDairyHoursOfUse / skidSteerLoadersTotalHoursOfUse);
      const skidSteerLoadersCroppingAnnualEconomicCost =
        (skidSteerLoadersAnnualAmortization +
          skidSteerLoadersPropertyTax +
          skidSteerLoadersPropertyInsurance) *
        (skidSteerLoadersCroppingHoursOfUse / skidSteerLoadersTotalHoursOfUse);

      // 130 hp Tractor - MFWD
      const hpTractorMFWD130InitialInvestment =
        numberOfHpTractorMFWD130 * hpTractorMFWD130InitialInvestmentPerUnit;
      const hpTractorMFWD130EstimatedCurrentSalvageValue =
        hpTractorMFWD130InitialInvestment *
        (ageCategories.get(hpTractorMFWD130EquipmentAge).Tractors_80_149hp /
          100);
      const hpTractorMFWD130EstimatedFinalSalvageValue =
        hpTractorMFWD130InitialInvestment *
        (ageCategories.get(hpTractorMFWD130YearsOfUsefulLife)
          .Tractors_80_149hp /
          100);
      const hpTractorMFWD130AnnualAmortization =
        ((hpTractorMFWD130EstimatedCurrentSalvageValue -
          hpTractorMFWD130EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                hpTractorMFWD130YearsOfUsefulLife - hpTractorMFWD130EquipmentAge
              ),
            )) +
        hpTractorMFWD130EstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const hpTractorMFWD130PropertyTax =
        hpTractorMFWD130EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const hpTractorMFWD130PropertyInsurance =
        hpTractorMFWD130InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const hpTractorMFWD130TotalAnnualEconomicCost =
        (hpTractorMFWD130AnnualAmortization +
          hpTractorMFWD130PropertyTax +
          hpTractorMFWD130PropertyInsurance) *
        (hpTractorMFWD130DairyHoursOfUse / hpTractorMFWD130TotalHoursOfUse);
      const hpTractorMFWD130CroppingAnnualEconomicCost =
        (hpTractorMFWD130AnnualAmortization +
          hpTractorMFWD130PropertyTax +
          hpTractorMFWD130PropertyInsurance) *
        (hpTractorMFWD130CroppingHoursOfUse / hpTractorMFWD130TotalHoursOfUse);

      // 75 hp Tractor - 2wd
      const hpTractor2wd75InitialInvestment =
        numberOfHpTractor2wd75 * hpTractor2wd75InitialInvestmentPerUnit;
      const hpTractor2wd75EstimatedCurrentSalvageValue =
        hpTractor2wd75InitialInvestment *
        (ageCategories.get(hpTractor2wd75EquipmentAge).Tractors_80_149hp / 100);
      const hpTractor2wd75EstimatedFinalSalvageValue =
        hpTractor2wd75InitialInvestment *
        (ageCategories.get(hpTractor2wd75YearsOfUsefulLife).Tractors_80_149hp /
          100);
      const hpTractor2wd75AnnualAmortization =
        ((hpTractor2wd75EstimatedCurrentSalvageValue -
          hpTractor2wd75EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(hpTractor2wd75YearsOfUsefulLife - hpTractor2wd75EquipmentAge),
            )) +
        hpTractor2wd75EstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const hpTractor2wd75PropertyTax =
        hpTractor2wd75EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const hpTractor2wd75PropertyInsurance =
        hpTractor2wd75InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const hpTractor2wd75TotalAnnualEconomicCost =
        (hpTractor2wd75AnnualAmortization +
          hpTractor2wd75PropertyTax +
          hpTractor2wd75PropertyInsurance) *
        (hpTractor2wd75DairyHoursOfUse / hpTractor2wd75TotalHoursOfUse);
      const hpTractor2wd75CroppingAnnualEconomicCost =
        (hpTractor2wd75AnnualAmortization +
          hpTractor2wd75PropertyTax +
          hpTractor2wd75PropertyInsurance) *
        (hpTractor2wd75CroppingHoursOfUse / hpTractor2wd75TotalHoursOfUse);

      // 50 hp Tractor - 2wd
      const tractor50Hp2wdInitialInvestment =
        numberOfHpTractor2wd50 * tractor50Hp2wdInitialInvestmentPerUnit;
      const tractor50Hp2wdEstimatedCurrentSalvageValue =
        tractor50Hp2wdInitialInvestment *
        (ageCategories.get(hpTractor2wd50EquipmentAge).Tractors_80_149hp / 100);
      const tractor50Hp2wdEstimatedFinalSalvageValue =
        tractor50Hp2wdInitialInvestment *
        (ageCategories.get(hpTractor2wd50YearsOfUsefulLife).Tractors_80_149hp /
          100);
      const tractor50Hp2wdAnnualAmortization =
        ((tractor50Hp2wdEstimatedCurrentSalvageValue -
          tractor50Hp2wdEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(hpTractor2wd50YearsOfUsefulLife - hpTractor2wd50EquipmentAge),
            )) +
        tractor50Hp2wdEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const tractor50Hp2wdPropertyTax =
        tractor50Hp2wdEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const tractor50Hp2wdPropertyInsurance =
        tractor50Hp2wdInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const hpTractor2wd50TotalAnnualEconomicCost =
        (tractor50Hp2wdAnnualAmortization +
          tractor50Hp2wdPropertyTax +
          tractor50Hp2wdPropertyInsurance) *
        (tractor50Hp2wdDairyHoursOfUse / tractor50Hp2wdTotalHoursOfUse);
      const hpTractor2wd50CroppingAnnualEconomicCost =
        (tractor50Hp2wdAnnualAmortization +
          tractor50Hp2wdPropertyTax +
          tractor50Hp2wdPropertyInsurance) *
        (tractor50Hp2wdCroppingHoursOfUse / tractor50Hp2wdTotalHoursOfUse);

      // Mixer Wagon - 650 cubic feet
      const mixerWagon650InitialInvestment =
        numberOfMixerWagon650 * mixerWagon650InitialInvestmentPerUnit;
      const mixerWagon650EstimatedCurrentSalvageValue =
        mixerWagon650InitialInvestment *
        (ageCategories.get(mixerWagon650EquipmentAge).Misc / 100);
      const mixerWagon650EstimatedFinalSalvageValue =
        mixerWagon650InitialInvestment *
        (ageCategories.get(mixerWagon650YearsOfUsefulLife).Misc / 100);
      const mixerWagon650AnnualAmortization =
        ((mixerWagon650EstimatedCurrentSalvageValue -
          mixerWagon650EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(mixerWagon650YearsOfUsefulLife - mixerWagon650EquipmentAge),
            )) +
        mixerWagon650EstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const mixerWagon650PropertyTax =
        mixerWagon650EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const mixerWagon650PropertyInsurance =
        mixerWagon650InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const mixerWagon650TotalAnnualEconomicCost =
        (mixerWagon650AnnualAmortization +
          mixerWagon650PropertyTax +
          mixerWagon650PropertyInsurance) *
        (mixerWagon650DairyHoursOfUse / mixerWagon650TotalHoursOfUse);
      const mixerWagon650CroppingAnnualEconomicCost =
        (mixerWagon650AnnualAmortization +
          mixerWagon650PropertyTax +
          mixerWagon650PropertyInsurance) *
        (mixerWagon650CroppingHoursOfUse / mixerWagon650TotalHoursOfUse);

      // ¾ ton pickup
      const threeQuarterTonPickupInitialInvestment =
        numberOfThreeQuarterTonPickup *
        threeQuarterTonPickupInitialInvestmentPerUnit;
      const threeQuarterTonPickupEstimatedCurrentSalvageValue =
        threeQuarterTonPickupInitialInvestment *
        (ageCategories.get(threeQuarterTonPickupEquipmentAge).Misc / 100);
      const threeQuarterTonPickupEstimatedFinalSalvageValue =
        threeQuarterTonPickupInitialInvestment *
        (ageCategories.get(threeQuarterTonPickupYearsOfUsefulLife).Misc / 100);
      const threeQuarterTonPickupAnnualAmortization =
        ((threeQuarterTonPickupEstimatedCurrentSalvageValue -
          threeQuarterTonPickupEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                threeQuarterTonPickupYearsOfUsefulLife -
                threeQuarterTonPickupEquipmentAge
              ),
            )) +
        threeQuarterTonPickupEstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const threeQuarterTonPickupPropertyTax =
        threeQuarterTonPickupEstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const threeQuarterTonPickupPropertyInsurance =
        threeQuarterTonPickupInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const threeQuarterTonPickupTotalAnnualEconomicCost =
        (threeQuarterTonPickupAnnualAmortization +
          threeQuarterTonPickupPropertyTax +
          threeQuarterTonPickupPropertyInsurance) *
        (threeQuarterTonPickupDairyHoursOfUse /
          threeQuarterTonPickupTotalHoursOfUse);
      const threeQuarterTonPickupCroppingAnnualEconomicCost =
        (threeQuarterTonPickupAnnualAmortization +
          threeQuarterTonPickupPropertyTax +
          threeQuarterTonPickupPropertyInsurance) *
        (threeQuarterTonPickupCroppingHoursOfUse /
          threeQuarterTonPickupTotalHoursOfUse);

      // ½ ton pickup
      const halfTonPickupInitialInvestment =
        numberOfHalfTonPickup * halfTonPickupInitialInvestmentPerUnit;
      const halfTonPickupEstimatedCurrentSalvageValue =
        halfTonPickupInitialInvestment *
        (ageCategories.get(halfTonPickupEquipmentAge).Misc / 100);
      const halfTonPickupEstimatedFinalSalvageValue =
        halfTonPickupInitialInvestment *
        (ageCategories.get(halfTonPickupYearsOfUsefulLife).Misc / 100);
      const halfTonPickupAnnualAmortization =
        ((halfTonPickupEstimatedCurrentSalvageValue -
          halfTonPickupEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(halfTonPickupYearsOfUsefulLife - halfTonPickupEquipmentAge),
            )) +
        halfTonPickupEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const halfTonPickupPropertyTax =
        halfTonPickupEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const halfTonPickupPropertyInsurance =
        halfTonPickupInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const halfTonPickupTotalAnnualEconomicCost =
        (halfTonPickupAnnualAmortization +
          halfTonPickupPropertyTax +
          halfTonPickupPropertyInsurance) *
        (halfTonPickupDairyHoursOfUse / halfTonPickupTotalHoursOfUse);
      const halfTonPickupCroppingAnnualEconomicCost =
        (halfTonPickupAnnualAmortization +
          halfTonPickupPropertyTax +
          halfTonPickupPropertyInsurance) *
        (halfTonPickupCroppingHoursOfUse / halfTonPickupTotalHoursOfUse);

      // JD Gator
      const jdGatorInitialInvestment =
        numberOfJdGator * jdGatorInitialInvestmentPerUnit;
      const jdGatorEstimatedCurrentSalvageValue =
        jdGatorInitialInvestment *
        (ageCategories.get(jdGatorEquipmentAge).Misc / 100);
      const jdGatorEstimatedFinalSalvageValue =
        jdGatorInitialInvestment *
        (ageCategories.get(jdGatorYearsOfUsefulLife).Misc / 100);
      const jdGatorAnnualAmortization =
        ((jdGatorEstimatedCurrentSalvageValue -
          jdGatorEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(jdGatorYearsOfUsefulLife - jdGatorEquipmentAge),
            )) +
        jdGatorEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const jdGatorPropertyTax =
        jdGatorEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const jdGatorPropertyInsurance =
        jdGatorInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const jdGatorTotalAnnualEconomicCost =
        (jdGatorAnnualAmortization +
          jdGatorPropertyTax +
          jdGatorPropertyInsurance) *
        (jdGatorDairyHoursOfUse / jdGatorTotalHoursOfUse);
      const jdGatorCroppingAnnualEconomicCost =
        (jdGatorAnnualAmortization +
          jdGatorPropertyTax +
          jdGatorPropertyInsurance) *
        (jdGatorCroppingHoursOfUse / jdGatorTotalHoursOfUse);

      // Sand Spreader
      const sandSpreaderInitialInvestment =
        numberOfSandSpreader * sandSpreaderInitialInvestmentPerUnit;
      const sandSpreaderEstimatedCurrentSalvageValue =
        sandSpreaderInitialInvestment *
        (ageCategories.get(sandSpreaderEquipmentAge).Misc / 100);
      const sandSpreaderEstimatedFinalSalvageValue =
        sandSpreaderInitialInvestment *
        (ageCategories.get(sandSpreaderYearsOfUsefulLife).Misc / 100);
      const sandSpreaderAnnualAmortization =
        ((sandSpreaderEstimatedCurrentSalvageValue -
          sandSpreaderEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(sandSpreaderYearsOfUsefulLife - sandSpreaderEquipmentAge),
            )) +
        sandSpreaderEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const sandSpreaderPropertyTax =
        sandSpreaderEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const sandSpreaderPropertyInsurance =
        sandSpreaderInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const sandSpreaderTotalAnnualEconomicCost =
        (sandSpreaderAnnualAmortization +
          sandSpreaderPropertyTax +
          sandSpreaderPropertyInsurance) *
        (sandSpreaderDairyHoursOfUse / sandSpreaderTotalHoursOfUse);
      const sandSpreaderCroppingAnnualEconomicCost =
        (sandSpreaderAnnualAmortization +
          sandSpreaderPropertyTax +
          sandSpreaderPropertyInsurance) *
        (sandSpreaderCroppingHoursOfUse / sandSpreaderTotalHoursOfUse);

      // 300 hp Tractor - MFWD
      const hpTractorMFWD300InitialInvestment =
        numberOfHpTractorMFWD300 * hpTractorMFWD300InitialInvestmentPerUnit;
      const hpTractorMFWD300EstimatedCurrentSalvageValue =
        hpTractorMFWD300InitialInvestment *
        (ageCategories.get(hpTractorMFWD300EquipmentAge).Tractor_150hp / 100);
      const hpTractorMFWD300EstimatedFinalSalvageValue =
        hpTractorMFWD300InitialInvestment *
        (ageCategories.get(hpTractorMFWD300YearsOfUsefulLife).Tractor_150hp /
          100);
      const hpTractorMFWD300AnnualAmortization =
        ((hpTractorMFWD300EstimatedCurrentSalvageValue -
          hpTractorMFWD300EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                hpTractorMFWD300YearsOfUsefulLife - hpTractorMFWD300EquipmentAge
              ),
            )) +
        hpTractorMFWD300EstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const hpTractorMFWD300PropertyTax =
        hpTractorMFWD300EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const hpTractorMFWD300PropertyInsurance =
        hpTractorMFWD300InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const hpTractorMFWD300TotalAnnualEconomicCost =
        (hpTractorMFWD300AnnualAmortization +
          hpTractorMFWD300PropertyTax +
          hpTractorMFWD300PropertyInsurance) *
        (hpTractorMFWD300DairyHoursOfUse / hpTractorMFWD300TotalHoursOfUse);
      const hpTractorMFWD300CroppingAnnualEconomicCost =
        (hpTractorMFWD300AnnualAmortization +
          hpTractorMFWD300PropertyTax +
          hpTractorMFWD300PropertyInsurance) *
        (hpTractorMFWD300CroppingHoursOfUse / hpTractorMFWD300TotalHoursOfUse);

      // 200 hp Tractor - MFWD
      const hpTractorMFWD200InitialInvestment =
        numberOfHpTractorMFWD200 * hpTractorMFWD200InitialInvestmentPerUnit;
      const hpTractorMFWD200EstimatedCurrentSalvageValue =
        hpTractorMFWD200InitialInvestment *
        (ageCategories.get(hpTractorMFWD200EquipmentAge).Tractor_150hp / 100);
      const hpTractorMFWD200EstimatedFinalSalvageValue =
        hpTractorMFWD200InitialInvestment *
        (ageCategories.get(hpTractorMFWD200YearsOfUsefulLife).Tractor_150hp /
          100);
      const hpTractorMFWD200AnnualAmortization =
        ((hpTractorMFWD200EstimatedCurrentSalvageValue -
          hpTractorMFWD200EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                hpTractorMFWD200YearsOfUsefulLife - hpTractorMFWD200EquipmentAge
              ),
            )) +
        hpTractorMFWD200EstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const hpTractorMFWD200PropertyTax =
        hpTractorMFWD200EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const hpTractorMFWD200PropertyInsurance =
        hpTractorMFWD200InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const hpTractorMFWD200TotalAnnualEconomicCost =
        (hpTractorMFWD200AnnualAmortization +
          hpTractorMFWD200PropertyTax +
          hpTractorMFWD200PropertyInsurance) *
        (hpTractorMFWD200DairyHoursOfUse / hpTractorMFWD200TotalHoursOfUse);
      const hpTractorMFWD200CroppingAnnualEconomicCost =
        (hpTractorMFWD200AnnualAmortization +
          hpTractorMFWD200PropertyTax +
          hpTractorMFWD200PropertyInsurance) *
        (hpTractorMFWD200CroppingHoursOfUse / hpTractorMFWD200TotalHoursOfUse);

      // 24’ Disk Harrow
      const diskHarrow24InitialInvestment =
        numberOfDiskHarrow24 * diskHarrow24InitialInvestmentPerUnit;
      const diskHarrow24EstimatedCurrentSalvageValue =
        diskHarrow24InitialInvestment *
        (ageCategories.get(diskHarrow24EquipmentAge).Tilage / 100);
      const diskHarrow24EstimatedFinalSalvageValue =
        diskHarrow24InitialInvestment *
        (ageCategories.get(diskHarrow24YearsOfUsefulLife).Tilage / 100);
      const diskHarrow24AnnualAmortization =
        ((diskHarrow24EstimatedCurrentSalvageValue -
          diskHarrow24EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(diskHarrow24YearsOfUsefulLife - diskHarrow24EquipmentAge),
            )) +
        diskHarrow24EstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const diskHarrow24PropertyTax =
        diskHarrow24EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const diskHarrow24PropertyInsurance =
        diskHarrow24InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const diskHarrow24TotalAnnualEconomicCost =
        (diskHarrow24AnnualAmortization +
          diskHarrow24PropertyTax +
          diskHarrow24PropertyInsurance) *
        (diskHarrow24DairyHoursOfUse / diskHarrow24TotalHoursOfUse);
      const diskHarrow24CroppingAnnualEconomicCost =
        (diskHarrow24AnnualAmortization +
          diskHarrow24PropertyTax +
          diskHarrow24PropertyInsurance) *
        (diskHarrow24CroppingHoursOfUse / diskHarrow24TotalHoursOfUse);

      // 8-row 30” Strip-Till Planter
      const stripTillPlanter8RowInitialInvestment =
        numberOfStripTillPlanter8Row *
        stripTillPlanter8RowInitialInvestmentPerUnit;
      const stripTillPlanter8RowEstimatedCurrentSalvageValue =
        stripTillPlanter8RowInitialInvestment *
        (ageCategories.get(stripTillPlanter8RowEquipmentAge).Planters / 100);
      const stripTillPlanter8RowEstimatedFinalSalvageValue =
        stripTillPlanter8RowInitialInvestment *
        (ageCategories.get(stripTillPlanter8RowYearsOfUsefulLife).Planters /
          100);
      const stripTillPlanter8RowAnnualAmortization =
        ((stripTillPlanter8RowEstimatedCurrentSalvageValue -
          stripTillPlanter8RowEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                stripTillPlanter8RowYearsOfUsefulLife -
                stripTillPlanter8RowEquipmentAge
              ),
            )) +
        stripTillPlanter8RowEstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const stripTillPlanter8RowPropertyTax =
        stripTillPlanter8RowEstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const stripTillPlanter8RowPropertyInsurance =
        stripTillPlanter8RowInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const stripTillPlanter8RowTotalAnnualEconomicCost =
        (stripTillPlanter8RowAnnualAmortization +
          stripTillPlanter8RowPropertyTax +
          stripTillPlanter8RowPropertyInsurance) *
        (stripTillPlanter8RowDairyHoursOfUse /
          stripTillPlanter8RowTotalHoursOfUse);
      const stripTillPlanter8RowCroppingAnnualEconomicCost =
        (stripTillPlanter8RowAnnualAmortization +
          stripTillPlanter8RowPropertyTax +
          stripTillPlanter8RowPropertyInsurance) *
        (stripTillPlanter8RowCroppingHoursOfUse /
          stripTillPlanter8RowTotalHoursOfUse);

      // 40’ Folding Sprayer
      const foldingSprayer40InitialInvestment =
        numberOfFoldingSprayer40 * foldingSprayer40InitialInvestmentPerUnit;
      const foldingSprayer40EstimatedCurrentSalvageValue =
        foldingSprayer40InitialInvestment *
        (ageCategories.get(foldingSprayer40EquipmentAge).Misc / 100);
      const foldingSprayer40EstimatedFinalSalvageValue =
        foldingSprayer40InitialInvestment *
        (ageCategories.get(foldingSprayer40YearsOfUsefulLife).Misc / 100);
      const foldingSprayer40AnnualAmortization =
        ((foldingSprayer40EstimatedCurrentSalvageValue -
          foldingSprayer40EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                foldingSprayer40YearsOfUsefulLife - foldingSprayer40EquipmentAge
              ),
            )) +
        foldingSprayer40EstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const foldingSprayer40PropertyTax =
        foldingSprayer40EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const foldingSprayer40PropertyInsurance =
        foldingSprayer40InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const foldingSprayer40TotalAnnualEconomicCost =
        (foldingSprayer40AnnualAmortization +
          foldingSprayer40PropertyTax +
          foldingSprayer40PropertyInsurance) *
        (foldingSprayer40DairyHoursOfUse / foldingSprayer40TotalHoursOfUse);
      const foldingSprayer40CroppingAnnualEconomicCost =
        (foldingSprayer40AnnualAmortization +
          foldingSprayer40PropertyTax +
          foldingSprayer40PropertyInsurance) *
        (foldingSprayer40CroppingHoursOfUse / foldingSprayer40TotalHoursOfUse);

      // Field Cultivator
      const fieldCultivatorInitialInvestment =
        numberOfFieldCultivator * fieldCultivatorInitialInvestmentPerUnit;
      const fieldCultivatorEstimatedCurrentSalvageValue =
        fieldCultivatorInitialInvestment *
        (ageCategories.get(fieldCultivatorEquipmentAge).Tilage / 100);
      const fieldCultivatorEstimatedFinalSalvageValue =
        fieldCultivatorInitialInvestment *
        (ageCategories.get(fieldCultivatorYearsOfUsefulLife).Tilage / 100);
      const fieldCultivatorAnnualAmortization =
        ((fieldCultivatorEstimatedCurrentSalvageValue -
          fieldCultivatorEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(fieldCultivatorYearsOfUsefulLife - fieldCultivatorEquipmentAge),
            )) +
        fieldCultivatorEstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const fieldCultivatorPropertyTax =
        fieldCultivatorEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const fieldCultivatorPropertyInsurance =
        fieldCultivatorInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const fieldCultivatorTotalAnnualEconomicCost =
        (fieldCultivatorAnnualAmortization +
          fieldCultivatorPropertyTax +
          fieldCultivatorPropertyInsurance) *
        (fieldCultivatorDairyHoursOfUse / fieldCultivatorTotalHoursOfUse);
      const fieldCultivatorCroppingAnnualEconomicCost =
        (fieldCultivatorAnnualAmortization +
          fieldCultivatorPropertyTax +
          fieldCultivatorPropertyInsurance) *
        (fieldCultivatorCroppingHoursOfUse / fieldCultivatorTotalHoursOfUse);

      // Grain Drill - 15’ No-Till
      const grainDrill15NoTillInitialInvestment =
        numberOfGrainDrill15NoTill * grainDrill15NoTillInitialInvestmentPerUnit;
      const grainDrill15NoTillEstimatedCurrentSalvageValue =
        grainDrill15NoTillInitialInvestment *
        (ageCategories.get(grainDrill15NoTillEquipmentAge).Planters / 100);
      const grainDrill15NoTillEstimatedFinalSalvageValue =
        grainDrill15NoTillInitialInvestment *
        (ageCategories.get(grainDrill15NoTillYearsOfUsefulLife).Planters / 100);
      const grainDrill15NoTillAnnualAmortization =
        ((grainDrill15NoTillEstimatedCurrentSalvageValue -
          grainDrill15NoTillEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                grainDrill15NoTillYearsOfUsefulLife -
                grainDrill15NoTillEquipmentAge
              ),
            )) +
        grainDrill15NoTillEstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const grainDrill15NoTillPropertyTax =
        grainDrill15NoTillEstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const grainDrill15NoTillPropertyInsurance =
        grainDrill15NoTillInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const grainDrill15NoTillTotalAnnualEconomicCost =
        (grainDrill15NoTillAnnualAmortization +
          grainDrill15NoTillPropertyTax +
          grainDrill15NoTillPropertyInsurance) *
        (grainDrill15NoTillDairyHoursOfUse / grainDrill15NoTillTotalHoursOfUse);
      const grainDrill15NoTillCroppingAnnualEconomicCost =
        (grainDrill15NoTillAnnualAmortization +
          grainDrill15NoTillPropertyTax +
          grainDrill15NoTillPropertyInsurance) *
        (grainDrill15NoTillCroppingHoursOfUse /
          grainDrill15NoTillTotalHoursOfUse);

      // Mower Conditioner (Self-Propelled)
      const mowerConditionerSelfPropelledInitialInvestment =
        numberOfMowerConditionerSelfPropelled *
        mowerConditionerSelfPropelledInitialInvestmentPerUnit;
      const mowerConditionerSelfPropelledEstimatedCurrentSalvageValue =
        mowerConditionerSelfPropelledInitialInvestment *
        (ageCategories.get(mowerConditionerSelfPropelledEquipmentAge)
          .HarvestingForage /
          100);
      const mowerConditionerSelfPropelledEstimatedFinalSalvageValue =
        mowerConditionerSelfPropelledInitialInvestment *
        (ageCategories.get(mowerConditionerSelfPropelledYearsOfUsefulLife)
          .HarvestingForage /
          100);
      const mowerConditionerSelfPropelledAnnualAmortization =
        ((mowerConditionerSelfPropelledEstimatedCurrentSalvageValue -
          mowerConditionerSelfPropelledEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                mowerConditionerSelfPropelledYearsOfUsefulLife -
                mowerConditionerSelfPropelledEquipmentAge
              ),
            )) +
        mowerConditionerSelfPropelledEstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const mowerConditionerSelfPropelledPropertyTax =
        mowerConditionerSelfPropelledEstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const mowerConditionerSelfPropelledPropertyInsurance =
        mowerConditionerSelfPropelledInitialInvestment *
        (machineryAndEquipmentInsuranceRate / 100);
      const mowerConditionerSelfPropelledTotalAnnualEconomicCost =
        (mowerConditionerSelfPropelledAnnualAmortization +
          mowerConditionerSelfPropelledPropertyTax +
          mowerConditionerSelfPropelledPropertyInsurance) *
        (mowerConditionerSelfPropelledDairyHoursOfUse /
          mowerConditionerSelfPropelledTotalHoursOfUse);
      const mowerConditionerSelfPropelledCroppingAnnualEconomicCost =
        (mowerConditionerSelfPropelledAnnualAmortization +
          mowerConditionerSelfPropelledPropertyTax +
          mowerConditionerSelfPropelledPropertyInsurance) *
        (mowerConditionerSelfPropelledCroppingHoursOfUse /
          mowerConditionerSelfPropelledTotalHoursOfUse);

      // Tedder
      const tedderInitialInvestment =
        numberOfTedder * tedderInitialInvestmentPerUnit;
      const tedderEstimatedCurrentSalvageValue =
        tedderInitialInvestment *
        (ageCategories.get(tedderEquipmentAge).HarvestingForage / 100);
      const tedderEstimatedFinalSalvageValue =
        tedderInitialInvestment *
        (ageCategories.get(tedderYearsOfUsefulLife).HarvestingForage / 100);
      const tedderAnnualAmortization =
        ((tedderEstimatedCurrentSalvageValue -
          tedderEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(tedderYearsOfUsefulLife - tedderEquipmentAge),
            )) +
        tedderEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const tedderPropertyTax =
        tedderEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const tedderPropertyInsurance =
        tedderInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const tedderTotalAnnualEconomicCost =
        (tedderAnnualAmortization +
          tedderPropertyTax +
          tedderPropertyInsurance) *
        (tedderDairyHoursOfUse / tedderTotalHoursOfUse);
      const tedderCroppingAnnualEconomicCost =
        (tedderAnnualAmortization +
          tedderPropertyTax +
          tedderPropertyInsurance) *
        (tedderCroppingHoursOfUse / tedderTotalHoursOfUse);

      // Power Rake
      const powerRakeInitialInvestment =
        numberOfPowerRake * powerRakeInitialInvestmentPerUnit;
      const powerRakeEstimatedCurrentSalvageValue =
        powerRakeInitialInvestment *
        (ageCategories.get(powerRakeEquipmentAge).HarvestingForage / 100);
      const powerRakeEstimatedFinalSalvageValue =
        powerRakeInitialInvestment *
        (ageCategories.get(powerRakeYearsOfUsefulLife).HarvestingForage / 100);
      const powerRakeAnnualAmortization =
        ((powerRakeEstimatedCurrentSalvageValue -
          powerRakeEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(powerRakeYearsOfUsefulLife - powerRakeEquipmentAge),
            )) +
        powerRakeEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const powerRakePropertyTax =
        powerRakeEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const powerRakePropertyInsurance =
        powerRakeInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const powerRakeTotalAnnualEconomicCost =
        (powerRakeAnnualAmortization +
          powerRakePropertyTax +
          powerRakePropertyInsurance) *
        (powerRakeDairyHoursOfUse / powerRakeTotalHoursOfUse);
      const powerRakeCroppingAnnualEconomicCost =
        (powerRakeAnnualAmortization +
          powerRakePropertyTax +
          powerRakePropertyInsurance) *
        (powerRakeCroppingHoursOfUse / powerRakeTotalHoursOfUse);

      // 15’ Folding Rotary Mower
      const foldingRotaryMower15InitialInvestment = numberOfFoldingRotaryMower15 * foldingRotaryMower15InitialInvestmentPerUnit;
      const foldingRotaryMower15EstimatedCurrentSalvageValue = foldingRotaryMower15InitialInvestment * (ageCategories.get(foldingRotaryMower15EquipmentAge).HarvestingForage / 100);
      const foldingRotaryMower15EstimatedFinalSalvageValue = foldingRotaryMower15InitialInvestment *(ageCategories.get(foldingRotaryMower15YearsOfUsefulLife).HarvestingForage / 100);
      const foldingRotaryMower15AnnualAmortization =
        ((foldingRotaryMower15EstimatedCurrentSalvageValue -
          foldingRotaryMower15EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                foldingRotaryMower15YearsOfUsefulLife -
                foldingRotaryMower15EquipmentAge
              ),
            )) +
        foldingRotaryMower15EstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const foldingRotaryMower15PropertyTax =
        foldingRotaryMower15EstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const foldingRotaryMower15PropertyInsurance =
        foldingRotaryMower15InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const foldingRotaryMower15TotalAnnualEconomicCost =
        (foldingRotaryMower15AnnualAmortization +
          foldingRotaryMower15PropertyTax +
          foldingRotaryMower15PropertyInsurance) *
        (foldingRotaryMower15DairyHoursOfUse /
          foldingRotaryMower15TotalHoursOfUse);
      const foldingRotaryMower15CroppingAnnualEconomicCost =
        (foldingRotaryMower15AnnualAmortization +
          foldingRotaryMower15PropertyTax +
          foldingRotaryMower15PropertyInsurance) *
        (foldingRotaryMower15CroppingHoursOfUse /
          foldingRotaryMower15TotalHoursOfUse);

      // Deep-Ripper
      const deepRipperInitialInvestment =
        numberOfDeepRipper * deepRipperInitialInvestmentPerUnit;
      const deepRipperEstimatedCurrentSalvageValue =
        deepRipperInitialInvestment *
        (ageCategories.get(deepRipperEquipmentAge).Tilage / 100);
      const deepRipperEstimatedFinalSalvageValue =
        deepRipperInitialInvestment *
        (ageCategories.get(deepRipperYearsOfUsefulLife).Tilage / 100);
      const deepRipperAnnualAmortization =
        ((deepRipperEstimatedCurrentSalvageValue -
          deepRipperEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(deepRipperYearsOfUsefulLife - deepRipperEquipmentAge),
            )) +
        deepRipperEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const deepRipperPropertyTax =
        deepRipperEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const deepRipperPropertyInsurance =
        deepRipperInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const deepRipperTotalAnnualEconomicCost =
        (deepRipperAnnualAmortization +
          deepRipperPropertyTax +
          deepRipperPropertyInsurance) *
        (deepRipperDairyHoursOfUse / deepRipperTotalHoursOfUse);
      const deepRipperCroppingAnnualEconomicCost =
        (deepRipperAnnualAmortization +
          deepRipperPropertyTax +
          deepRipperPropertyInsurance) *
        (deepRipperCroppingHoursOfUse / deepRipperTotalHoursOfUse);

      // 24’ Livestock Trailer
      const livestockTrailer24InitialInvestment =
        numberOfLivestockTrailer24 * livestockTrailer24InitialInvestmentPerUnit;
      const livestockTrailer24EstimatedCurrentSalvageValue =
        livestockTrailer24InitialInvestment *
        (ageCategories.get(livestockTrailer24EquipmentAge).Misc / 100);
      const livestockTrailer24EstimatedFinalSalvageValue =
        livestockTrailer24InitialInvestment *
        (ageCategories.get(livestockTrailer24YearsOfUsefulLife).Misc / 100);
      const livestockTrailer24AnnualAmortization =
        ((livestockTrailer24EstimatedCurrentSalvageValue -
          livestockTrailer24EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                livestockTrailer24YearsOfUsefulLife -
                livestockTrailer24EquipmentAge
              ),
            )) +
        livestockTrailer24EstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const livestockTrailer24PropertyTax =
        livestockTrailer24EstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const livestockTrailer24PropertyInsurance =
        livestockTrailer24InitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const livestockTrailer24TotalAnnualEconomicCost =
        (livestockTrailer24AnnualAmortization +
          livestockTrailer24PropertyTax +
          livestockTrailer24PropertyInsurance) *
        (livestockTrailer24DairyHoursOfUse / livestockTrailer24TotalHoursOfUse);
      const livestockTrailer24CroppingAnnualEconomicCost =
        (livestockTrailer24AnnualAmortization +
          livestockTrailer24PropertyTax +
          livestockTrailer24PropertyInsurance) *
        (livestockTrailer24CroppingHoursOfUse /
          livestockTrailer24TotalHoursOfUse);

      // Round Baler
      const roundBalerInitialInvestment =
        numberOfRoundBaler * roundBalerInitialInvestmentPerUnit;
      const roundBalerEstimatedCurrentSalvageValue =
        roundBalerInitialInvestment *
        (ageCategories.get(roundBalerEquipmentAge).HarvestingCrop / 100);
      const roundBalerEstimatedFinalSalvageValue =
        roundBalerInitialInvestment *
        (ageCategories.get(roundBalerYearsOfUsefulLife).HarvestingForage / 100);
      const roundBalerAnnualAmortization =
        ((roundBalerEstimatedCurrentSalvageValue -
          roundBalerEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(roundBalerYearsOfUsefulLife - roundBalerEquipmentAge),
            )) +
        roundBalerEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const roundBalerPropertyTax =
        roundBalerEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const roundBalerPropertyInsurance =
        roundBalerInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const roundBalerTotalAnnualEconomicCost =
        (roundBalerAnnualAmortization +
          roundBalerPropertyTax +
          roundBalerPropertyInsurance) *
        (roundBalerDairyHoursOfUse / roundBalerTotalHoursOfUse);
      const roundBalerCroppingAnnualEconomicCost =
        (roundBalerAnnualAmortization +
          roundBalerPropertyTax +
          roundBalerPropertyInsurance) *
        (roundBalerCroppingHoursOfUse / roundBalerTotalHoursOfUse);

      // Tub Grinder
      const tubGrinderInitialInvestment = numberOfTubGrinder * tubGrinderInitialInvestmentPerUnit;
      const tubGrinderEstimatedCurrentSalvageValue = tubGrinderInitialInvestment * (ageCategories.get(tubGrinderEquipmentAge).Misc / 100);
      const tubGrinderEstimatedFinalSalvageValue = tubGrinderInitialInvestment * (ageCategories.get(tubGrinderYearsOfUsefulLife).Misc / 100);
      const tubGrinderAnnualAmortization =
        ((tubGrinderEstimatedCurrentSalvageValue -
          tubGrinderEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(tubGrinderYearsOfUsefulLife - tubGrinderEquipmentAge),
            )) +
        tubGrinderEstimatedFinalSalvageValue * (longTermInterestRate / 100);
      const tubGrinderPropertyTax = tubGrinderEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
      const tubGrinderPropertyInsurance =
        tubGrinderInitialInvestment * (machineryAndEquipmentInsuranceRate / 100);
      const tubGrinderTotalAnnualEconomicCost =
        (tubGrinderAnnualAmortization +
          tubGrinderPropertyTax +
          tubGrinderPropertyInsurance) *
        (tubGrinderDairyHoursOfUse / tubGrinderTotalHoursOfUse);
      const tubGrinderCroppingAnnualEconomicCost =
        (tubGrinderAnnualAmortization +
          tubGrinderPropertyTax +
          tubGrinderPropertyInsurance) *
        (tubGrinderCroppingHoursOfUse / tubGrinderTotalHoursOfUse);

      // Miscellaneous Equipment
      const miscellaneousEquipmentInitialInvestment =
        numberOfMiscellaneousEquipment *
        miscellaneousEquipmentInitialInvestmentPerUnit;
      const miscellaneousEquipmentEstimatedCurrentSalvageValue =
        miscellaneousEquipmentInitialInvestment *
        (ageCategories.get(miscellaneousEquipmentEquipmentAge).Misc / 100);
      const miscellaneousEquipmentEstimatedFinalSalvageValue =
        miscellaneousEquipmentInitialInvestment *
        (ageCategories.get(miscellaneousEquipmentYearsOfUsefulLife).Misc / 100);
      const miscellaneousEquipmentAnnualAmortization =
        ((miscellaneousEquipmentEstimatedCurrentSalvageValue -
          miscellaneousEquipmentEstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                miscellaneousEquipmentYearsOfUsefulLife -
                miscellaneousEquipmentEquipmentAge
              ),
            )) +
        miscellaneousEquipmentEstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const miscellaneousEquipmentPropertyTax =
        miscellaneousEquipmentEstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const miscellaneousEquipmentPropertyInsurance =
        miscellaneousEquipmentInitialInvestment *
        (machineryAndEquipmentInsuranceRate / 100);
      const miscellaneousEquipmentTotalAnnualEconomicCost =
        (miscellaneousEquipmentAnnualAmortization +
          miscellaneousEquipmentPropertyTax +
          miscellaneousEquipmentPropertyInsurance) *
        (miscellaneousEquipmentDairyHoursOfUse /
          miscellaneousEquipmentTotalHoursOfUse);
      const miscellaneousEquipmentCroppingAnnualEconomicCost =
        (miscellaneousEquipmentAnnualAmortization +
          miscellaneousEquipmentPropertyTax +
          miscellaneousEquipmentPropertyInsurance) *
        (miscellaneousEquipmentCroppingHoursOfUse /
          miscellaneousEquipmentTotalHoursOfUse);

      // Other Machinery and Equipment 1
      const otherMachineryEquipment1InitialInvestment =
        numberOfOtherMachineryEquipment1 *
        otherMachineryEquipment1InitialInvestmentPerUnit;
      const otherMachineryEquipment1EstimatedCurrentSalvageValue =
        otherMachineryEquipment1InitialInvestment *
        (ageCategories.get(otherMachineryEquipment1EquipmentAge).Misc / 100);
      const otherMachineryEquipment1EstimatedFinalSalvageValue =
        otherMachineryEquipment1InitialInvestment *
        (ageCategories.get(otherMachineryEquipment1YearsOfUsefulLife).Misc /
          100);
      const otherMachineryEquipment1AnnualAmortization =
        ((otherMachineryEquipment1EstimatedCurrentSalvageValue -
          otherMachineryEquipment1EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                otherMachineryEquipment1YearsOfUsefulLife -
                otherMachineryEquipment1EquipmentAge
              ),
            )) +
        otherMachineryEquipment1EstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const otherMachineryEquipment1PropertyTax =
        otherMachineryEquipment1EstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const otherMachineryEquipment1PropertyInsurance =
        otherMachineryEquipment1InitialInvestment *
        (machineryAndEquipmentInsuranceRate / 100);
      const otherMachineryEquipment1TotalAnnualEconomicCost =
        (otherMachineryEquipment1AnnualAmortization +
          otherMachineryEquipment1PropertyTax +
          otherMachineryEquipment1PropertyInsurance) *
        (otherMachineryEquipment1DairyHoursOfUse /
          otherMachineryEquipment1TotalHoursOfUse);
      const otherMachineryEquipment1CroppingAnnualEconomicCost =
        (otherMachineryEquipment1AnnualAmortization +
          otherMachineryEquipment1PropertyTax +
          otherMachineryEquipment1PropertyInsurance) *
        (otherMachineryEquipment1CroppingHoursOfUse /
          otherMachineryEquipment1TotalHoursOfUse);

      // Other Machinery and Equipment 2
      const otherMachineryEquipment2InitialInvestment =
        numberOfOtherMachineryEquipment2 *
        otherMachineryEquipment2InitialInvestmentPerUnit;
      const otherMachineryEquipment2EstimatedCurrentSalvageValue =
        otherMachineryEquipment2InitialInvestment *
        (ageCategories.get(otherMachineryEquipment2EquipmentAge).Misc / 100);
      const otherMachineryEquipment2EstimatedFinalSalvageValue =
        otherMachineryEquipment2InitialInvestment *
        (ageCategories.get(otherMachineryEquipment2YearsOfUsefulLife).Misc /
          100);
      const otherMachineryEquipment2AnnualAmortization =
        ((otherMachineryEquipment2EstimatedCurrentSalvageValue -
          otherMachineryEquipment2EstimatedFinalSalvageValue) *
          (longTermInterestRate / 100)) /
          (1 -
            Math.pow(
              1 + longTermInterestRate / 100,
              -(
                otherMachineryEquipment2YearsOfUsefulLife -
                otherMachineryEquipment2EquipmentAge
              ),
            )) +
        otherMachineryEquipment2EstimatedFinalSalvageValue *
          (longTermInterestRate / 100);
      const otherMachineryEquipment2PropertyTax =
        otherMachineryEquipment2EstimatedCurrentSalvageValue *
        (propertyTaxRate / 100);
      const otherMachineryEquipment2PropertyInsurance =
        otherMachineryEquipment2InitialInvestment *
        (machineryAndEquipmentInsuranceRate / 100);
      const otherMachineryEquipment2TotalAnnualEconomicCost = (otherMachineryEquipment2AnnualAmortization + otherMachineryEquipment2PropertyTax + otherMachineryEquipment2PropertyInsurance) *
        (otherMachineryEquipment2DairyHoursOfUse / otherMachineryEquipment2TotalHoursOfUse);
      const otherMachineryEquipment2CroppingAnnualEconomicCost = (otherMachineryEquipment2AnnualAmortization + otherMachineryEquipment2PropertyTax + otherMachineryEquipment2PropertyInsurance) *
        (otherMachineryEquipment2CroppingHoursOfUse / otherMachineryEquipment2TotalHoursOfUse);

      //Finally calculating the total machinery fixed cost from detailed machinery cost variables
      totalMachineryFixedCost =
        articulatedLoadersTotalAnnualEconomicCost +
        skidSteerLoadersTotalAnnualEconomicCost +
        hpTractorMFWD130TotalAnnualEconomicCost +
        hpTractor2wd75TotalAnnualEconomicCost +
        hpTractor2wd50TotalAnnualEconomicCost +
        mixerWagon650TotalAnnualEconomicCost +
        threeQuarterTonPickupTotalAnnualEconomicCost +
        halfTonPickupTotalAnnualEconomicCost +
        jdGatorTotalAnnualEconomicCost +
        sandSpreaderTotalAnnualEconomicCost +
        hpTractorMFWD300TotalAnnualEconomicCost +
        hpTractorMFWD200TotalAnnualEconomicCost +
        diskHarrow24TotalAnnualEconomicCost +
        stripTillPlanter8RowTotalAnnualEconomicCost +
        foldingSprayer40TotalAnnualEconomicCost +
        fieldCultivatorTotalAnnualEconomicCost +
        grainDrill15NoTillTotalAnnualEconomicCost +
        mowerConditionerSelfPropelledTotalAnnualEconomicCost +
        tedderTotalAnnualEconomicCost +
        powerRakeTotalAnnualEconomicCost +
        foldingRotaryMower15TotalAnnualEconomicCost +
        deepRipperTotalAnnualEconomicCost +
        livestockTrailer24TotalAnnualEconomicCost +
        roundBalerTotalAnnualEconomicCost +
        tubGrinderTotalAnnualEconomicCost +
        miscellaneousEquipmentTotalAnnualEconomicCost +
        otherMachineryEquipment1TotalAnnualEconomicCost +
        otherMachineryEquipment2TotalAnnualEconomicCost;

      totalCroppingAnnualEconomicCosts = 
        articulatedLoadersCroppingAnnualEconomicCost +
        skidSteerLoadersCroppingAnnualEconomicCost +
        hpTractorMFWD130CroppingAnnualEconomicCost +
        hpTractor2wd75CroppingAnnualEconomicCost +
        hpTractor2wd50CroppingAnnualEconomicCost +
        mixerWagon650CroppingAnnualEconomicCost +
        threeQuarterTonPickupCroppingAnnualEconomicCost +
        halfTonPickupCroppingAnnualEconomicCost + 
        jdGatorCroppingAnnualEconomicCost +
        sandSpreaderCroppingAnnualEconomicCost + 
        hpTractorMFWD300CroppingAnnualEconomicCost +
        hpTractorMFWD200CroppingAnnualEconomicCost +
        diskHarrow24CroppingAnnualEconomicCost +
        stripTillPlanter8RowCroppingAnnualEconomicCost +
        foldingSprayer40CroppingAnnualEconomicCost +
        fieldCultivatorCroppingAnnualEconomicCost +
        grainDrill15NoTillCroppingAnnualEconomicCost +
        mowerConditionerSelfPropelledCroppingAnnualEconomicCost +
        tedderCroppingAnnualEconomicCost +
        powerRakeCroppingAnnualEconomicCost +
        foldingRotaryMower15CroppingAnnualEconomicCost +
        deepRipperCroppingAnnualEconomicCost +
        livestockTrailer24CroppingAnnualEconomicCost +
        roundBalerCroppingAnnualEconomicCost +
        tubGrinderCroppingAnnualEconomicCost +
        miscellaneousEquipmentCroppingAnnualEconomicCost +
        otherMachineryEquipment1CroppingAnnualEconomicCost +
        otherMachineryEquipment2CroppingAnnualEconomicCost
    }

    // -------->>>>Outputs calculated and rounded to 2 decimal points
    const totalCattleFixedCost =
      (cowTotalAnnualEconomicCost + bredHeiferTotalAnnualEconomicCost) *
      (1 + cowDeathLossRate / 100);
    
    const totalFacilitiesAndBuildingsFixedCost =
      farmShopandGeneralRoadsTotalAnnualEconomicCost +
      milkingParlorAndEquipmentTotalAnnualEconomicCost +
      feedingEquipmentTotalAnnualEconomicCost +
      freestallHousingandLanesTotalAnnualEconomicCost +
      threePhasePowerSupplyTotalAnnualEconomicCost +
      waterSystemTotalAnnualEconomicCost +
      hayShedTotalAnnualEconomicCost +
      trenchSilosTotalAnnualEconomicCost +
      fencesTotalAnnualEconomicCost +
      commodityBarnTotalAnnualEconomicCost +
      calfOrHeiferBarnTotalAnnualEconomicCost +
      tiltTableTotalAnnualEconomicCost +
      cattleHandlingFacilitiesTotalAnnualEconomicCost +
      otherFacilitiesAndBuildings1TotalAnnualEconomicCost +
      otherFacilitiesAndBuildings2TotalAnnualEconomicCost;
    const totalWasteManagementSystemsFixedCost =
      wasteStoragePondTotalAnnualEconomicCost +
      compactClayLinerTotalAnnualEconomicCost +
      monitoringWellsTotalAnnualEconomicCost +
      solidsSeparatorTotalAnnualEconomicCost +
      lagoonPumpTotalAnnualEconomicCost +
      pipesTotalAnnualEconomicCost +
      powerUnitTotalAnnualEconomicCost +
      irrigationSystemTotalAnnualEconomicCost +
      agitatorTotalAnnualEconomicCost +
      manureSpreaderTotalAnnualEconomicCost +
      otherManureManagementStructure1TotalAnnualEconomicCost +
      otherManureManagementStructure2TotalAnnualEconomicCost;

    const totalLandFixedCost = totalLandRentalCost;
    const overheadCost = overheadCostPerCow * totalNumberOfCows;

    const totalDairyFixedCost = totalCattleFixedCost + totalFacilitiesAndBuildingsFixedCost + totalWasteManagementSystemsFixedCost +
      totalMachineryFixedCost + totalLandFixedCost + overheadCost;

    // Convert to document object
    const updatedOutputDocument = {
      totalCattleFixedCost: Math.round(totalCattleFixedCost * 100) / 100,
      totalFacilitiesAndBuildingsFixedCost: Math.round(totalFacilitiesAndBuildingsFixedCost * 100) / 100,
      totalWasteManagementSystemsFixedCost: Math.round(totalWasteManagementSystemsFixedCost * 100) / 100,
      totalMachineryFixedCost: Math.round(totalMachineryFixedCost * 100) / 100,
      totalLandFixedCost: Math.round(totalLandFixedCost * 100) / 100,
      overheadCost: Math.round(overheadCost * 100) / 100,
      totalDairyFixedCost: Math.round(totalDairyFixedCost * 100) / 100,
      totalCroppingAnnualEconomicCosts: Math.round(totalCroppingAnnualEconomicCosts * 100) / 100
    };

    try {
      const result = await this.fixedCostsOutputModel.findOneAndUpdate(
        { userId },
        { $set: updatedOutputDocument },
        { new: true, upsert: true },
      );

      this.logger.log(
        `Successfully calculated and updated fixed costs output for user: ${userId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to calculate fixed costs output: ${error.message}`,
      );
      throw new Error(
        `Failed to calculate fixed costs output: ${error.message}`,
      );
    }
  }

  async getFixedCostsOutput(email: string): Promise<FixedCostsOutput | null> {
    //first find the user_id using the email, then find the document using the id
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();

    const outputDocument = await this.fixedCostsOutputModel
      .findOne({ userId })
      .exec();

    if (!outputDocument) {
      throw new HttpException(
        'Output record for this user not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return outputDocument;
  }

  async getFixedCostsInput(email: string): Promise<FixedCostsInput | null> {
    //first find the user_id using the email, then find the document using the id
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();

    const inputDocument = this.fixedCostsInputModel.findOne({ userId }).exec();

    if (!inputDocument) {
      throw new HttpException(
        'Input record for this user not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return inputDocument;
  }
}
