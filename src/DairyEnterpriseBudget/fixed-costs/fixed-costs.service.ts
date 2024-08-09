import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ProductionDetailsInput } from "../schemas/inputs/ProductionDetailsInput.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { User } from "src/user/schemas/user.schema";
import { FixedCostsInput } from "../schemas/inputs/FixedCostsInput.schema";
import { FixedCostsOutput } from "../schemas/outputs/FixedCostsOutput.schema";
import { FixedCostsInputDto } from "../dto/fixed-costs-input.dto";
import { ReceiptsInput } from "../schemas/inputs/ReceiptsInput.schema";

@Injectable()
export class FixedCostsService{
    private readonly logger = new Logger(FixedCostsService.name);

    constructor(
        @InjectModel(FixedCostsInput.name) private fixedCostsInputModel: Model<FixedCostsInput>,
        @InjectModel(FixedCostsOutput.name) private fixedCostsOutputModel: Model<FixedCostsOutput>,
        @InjectModel(ProductionDetailsInput.name) private productionDetailsInputModel: Model<ProductionDetailsInput>,
        @InjectModel(ProductionDetailsOutput.name) private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
        @InjectModel(ReceiptsInput.name) private receiptsInputModel: Model<ReceiptsInput>,
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async updateInput(email: string, updateDto: FixedCostsInputDto) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
        }
    
        const userId = user._id.toString();
        this.logger.log(`Updating inputs for user: ${userId}`);
        const updateData: any = {};
    
        // Handling Cattle Fixed Costs
        if (updateDto.cattleFixedCost) {
            for (const [key, value] of Object.entries(updateDto.cattleFixedCost)) {
                if (value !== undefined) {
                    updateData[`cattleFixedCost.${key}`] = value;
                }
            }
            this.logger.log(`Cattle Fixed Cost Data: ${JSON.stringify(updateDto.cattleFixedCost)}`);
        }
    
        // Handling Facilities and Buildings Fixed Costs
        if (updateDto.facilitiesAndBuildingsFixedCost) {
            for (const [key, value] of Object.entries(updateDto.facilitiesAndBuildingsFixedCost)) {
                if (value !== undefined) {
                    updateData[`facilitiesAndBuildingsFixedCost.${key}`] = value;
                }
            }
            this.logger.log(`Facilities and Buildings Fixed Costs Data: ${JSON.stringify(updateDto.facilitiesAndBuildingsFixedCost)}`);
        }
    
        // Handling Waste Management Fixed Costs
        if (updateDto.wasteManagementFixedCosts) {
            for (const [key, value] of Object.entries(updateDto.wasteManagementFixedCosts)) {
                if (value !== undefined) {
                    updateData[`wasteManagementFixedCosts.${key}`] = value;
                }
            }
            this.logger.log(`Waste Management Fixed Costs Data: ${JSON.stringify(updateDto.wasteManagementFixedCosts)}`);
        }
    
        // Handling Machinery Fixed Costs
        if (updateDto.machineryFixedCosts) {
            for (const [key, value] of Object.entries(updateDto.machineryFixedCosts)) {
                if (value !== undefined) {
                    updateData[`machineryFixedCosts.${key}`] = value;
                }
            }
            this.logger.log(`Machinery Fixed Costs Data: ${JSON.stringify(updateDto.machineryFixedCosts)}`);
        }

        // Handling Detailed Machinery Fixed Costs
        if (updateDto.detailedMachineryFixedCosts) {
            for (const [key, value] of Object.entries(updateDto.detailedMachineryFixedCosts)) {
                if (value !== undefined) {
                    updateData[`detailedMachineryFixedCosts.${key}`] = value;
                }
            }
            this.logger.log(`Detailed Machinery Fixed Costs Data: ${JSON.stringify(updateDto.detailedMachineryFixedCosts)}`);
        }
    
        // Handling Land Fixed Costs
        if (updateDto.landFixedCosts) {
            for (const [key, value] of Object.entries(updateDto.landFixedCosts)) {
                if (value !== undefined) {
                    updateData[`landFixedCosts.${key}`] = value;
                }
            }
            this.logger.log(`Land Fixed Costs Data: ${JSON.stringify(updateDto.landFixedCosts)}`);
        }

        // Handling isDetailedMachineryCosts
        if (updateDto.isDetailedMachineryCosts !== undefined) {
            updateData[`isDetailedMachineryCosts`] = updateDto.isDetailedMachineryCosts;
            this.logger.log(`isDetailedMachineryCosts Data: ${updateDto.isDetailedMachineryCosts}`);
        }
    
        try {
            const updatedDocument = await this.fixedCostsInputModel.findOneAndUpdate(
                { userId },
                { $set: updateData },
                { new: true, upsert: true }
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

    async calculateFixedCostsOutput(userId: string, updatedDocument: FixedCostsInput) {
        this.logger.log(`Calculating fixed costs output for user: ${userId}`);
        
        //Get the required documents from ProductionDetails Inputs and Outputs
        const productionDetailsInputs = await this.productionDetailsInputModel.findOne({userId}).exec();
        const receiptsInput = await this.receiptsInputModel.findOne({userId}).exec();
      
        // ------->>> Inputs from operating costs
        const cowPurchaseValue = updatedDocument.cattleFixedCost.cowPurchaseValue;
        const overheadCostPerCow = updatedDocument.cattleFixedCost.overheadCostPerCow;
        const numberOfBredHeifers = updatedDocument.cattleFixedCost.numberOfBredHeifers;
        const bredHeiferPurchaseValue = updatedDocument.cattleFixedCost.bredHeiferPurchaseValue;
        const numberOfOneYearOldHeifers = updatedDocument.cattleFixedCost.numberOfOneYearOldHeifers;
        const oneYearOldHeiferPurchaseValue = updatedDocument.cattleFixedCost.oneYearOldHeiferPurchaseValue;
        const numberOfWeanedHeiferCalves = updatedDocument.cattleFixedCost.numberOfWeanedHeiferCalves;
        const weanedHeiferCalvesPurchaseValue = updatedDocument.cattleFixedCost.weanedHeiferCalvesPurchaseValue;

        const farmShopAndGeneralRoadsInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.farmShopAndGeneralRoadsInitialInvestment;
        const farmShopAndGeneralRoadsYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.farmShopAndGeneralRoadsYearsOfUsefulLife;
        
        const milkingParlorAndEquipmentInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.milkingParlorAndEquipmentInitialInvestment;
        const milkingParlorAndEquipmentYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.milkingParlorAndEquipmentYearsOfUsefulLife;
        
        const feedingEquipmentYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.feedingEquipmentYearsOfUsefulLife;
        
        const freestallHousingAndLanesYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.freestallHousingAndLanesYearsOfUsefulLife;
        
        const threePhasePowerSupplyInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.threePhasePowerSupplyInitialInvestment;
        const threePhasePowerSupplyYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.threePhasePowerSupplyYearsOfUsefulLife;

        const wasteStoragePondInitialInvestment = updatedDocument.wasteManagementFixedCosts.wasteStoragePondInitialInvestment;
        const wasteStoragePondYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.wasteStoragePondYearsOfUsefulLife;
        
        const compactClayLinerInitialInvestment = updatedDocument.wasteManagementFixedCosts.compactClayLinerInitialInvestment;
        const compactClayLinerYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.compactClayLinerYearsOfUsefulLife;
        
        const monitoringWellsInitialInvestment = updatedDocument.wasteManagementFixedCosts.monitoringWellsInitialInvestment;
        const monitoringWellsYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.monitoringWellsYearsOfUsefulLife;

        const machineryFixedCostTotalEstimate = updatedDocument.machineryFixedCosts.machineryFixedCostTotalEstimate;

        const acres = updatedDocument.landFixedCosts.acres;
        const rentalCost = updatedDocument.landFixedCosts.rentalCost;

        //------->>>Temp variables required to calculate operating costs output
        const totalNumberOfCows = productionDetailsInputs.milkProduction.totalNumberOfCows;
        const cullCowsPrice = receiptsInput.cullCowsPrice;
        const cowDeathLossRate = productionDetailsInputs.heiferProduction.cowDeathLossRate;
        const cullingRate = productionDetailsInputs.heiferProduction.cullingRate;
        const livestockInsuranceRate = 0.35;
        const propertyTaxRate = 0.7;
        const propertyInsuranceRate = 0.25;
        
        //Facilities and Buildings
        const milkingParlorandEquipmentInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost?.milkingParlorAndEquipmentInitialInvestment || 1250000;
        const feedingEquipmentInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.feedingEquipmentInitialInvestment || 500000;
        const freestallHousingAndLanesInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.freestallHousingAndLanesInitialInvestment || 800000;
        const waterSystemInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.waterSystemInitialInvestment || 70000;
        const hayShedInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.hayShedInitialInvestment || 75000
        const trenchSilosInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.trenchSilosInitialInvestment || 200000;
        const fencesInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.fencesInitialInvestment || 100000;
        const commodityBarnInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.commodityBarnInitialInvestment || 250000;
        const calfOrHeiferBarnInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.calfOrHeiferBarnInitialInvestment || 115000;
        const tiltTableInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.tiltTableInitialInvestment || 10000;
        const cattleHandlingFacilitiesInitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.cattleHandlingFacilitiesInitialInvestment || 50000;
        const otherFacilitiesAndBuildings1InitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.otherFacilitiesAndBuildings1InitialInvestment || 0;
        const otherFacilitiesAndBuildings2InitialInvestment = updatedDocument.facilitiesAndBuildingsFixedCost.otherFacilitiesAndBuildings2InitialInvestment || 0;
        
        //Waste management
        const solidsSeparatorInitialInvestment = updatedDocument.wasteManagementFixedCosts.solidsSeparatorInitialInvestment || 110000;
        const lagoonPumpInitialInvestment = updatedDocument.wasteManagementFixedCosts.lagoonPumpInitialInvestment || 15000;
        const pipesInitialInvestment = updatedDocument.wasteManagementFixedCosts.pipesInitialInvestment || 20000;
        const powerUnitInitialInvestment = updatedDocument.wasteManagementFixedCosts.powerUnitInitialInvestment || 20000;
        const irrigationSystemInitialInvestment = updatedDocument.wasteManagementFixedCosts.irrigationSystemInitialInvestment || 1000000;
        const agitatorInitialInvestment = updatedDocument.wasteManagementFixedCosts.agitatorInitialInvestment || 35000;
        const manureSpreaderInitialInvestment = updatedDocument.wasteManagementFixedCosts.manureSpreaderInitialInvestment || 40000;
        const otherManureManagementStructure1InitialInvestment = updatedDocument.wasteManagementFixedCosts.otherManureManagementEquipment1InitialInvestment || 0;
        const otherManureManagementStructure2InitialInvestment = updatedDocument.wasteManagementFixedCosts.otherManureManagementEquipment2InitialInvestment || 0;

        //years of useful life default values
        // Facilities and Buildings
        const waterSystemYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.waterSystemYearsOfUsefulLife || 15;
        const hayShedYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.hayShedYearsOfUsefulLife || 20;
        const trenchSilosYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.trenchSilosYearsOfUsefulLife || 15;
        const fencesYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.fencesYearsOfUsefulLife || 15;
        const commodityBarnYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.commodityBarnYearsOfUsefulLife || 20;
        const calfOrHeiferBarnYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.calfOrHeiferBarnYearsOfUsefulLife || 5;
        const tiltTableYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.tiltTableYearsOfUsefulLife || 5;
        const cattleHandlingFacilitiesYearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.cattleHandlingFacilitiesYearsOfUsefulLife || 5;
        const otherFacilitiesAndBuildings1YearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.otherFacilitiesAndBuildings1YearsOfUsefulLife || 0;
        const otherFacilitiesAndBuildings2YearsOfUsefulLife = updatedDocument.facilitiesAndBuildingsFixedCost.otherFacilitiesAndBuildings2YearsOfUsefulLife || 0;

        // Waste Management
        const solidsSeparatorYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.solidsSeparatorYearsOfUsefulLife || 10;
        const lagoonPumpYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.lagoonPumpYearsOfUsefulLife || 7;
        const pipesYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.pipesYearsOfUsefulLife || 10;
        const powerUnitYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.powerUnitYearsOfUsefulLife || 10;
        const irrigationSystemYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.irrigationSystemYearsOfUsefulLife || 15;
        const agitatorYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.agitatorYearsOfUsefulLife || 15;
        const manureSpreaderYearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.manureSpreaderYearsOfUsefulLife || 15;
        const otherManureManagementStructure1YearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.otherManureManagementEquipment1YearsOfUsefulLife || 15;
        const otherManureManagementStructure2YearsOfUsefulLife = updatedDocument.wasteManagementFixedCosts.otherManureManagementEquipment2YearsOfUsefulLife || 15;

        const machineryInsuranceRate = 20;
        const longTermInterestRate = 30;
        const shortTermInterestRate = 30;

        //Map for Age and its categories
        const ageCategories = new Map([
            [1, { HarvestingCrop: 69, HarvestingForage: 56, Misc: 61, Planters: 65, Tilage: 61, Tractor_150hp: 67, Tractors_80_149hp: 68 }],
            [2, { HarvestingCrop: 58, HarvestingForage: 50, Misc: 54, Planters: 60, Tilage: 54, Tractor_150hp: 59, Tractors_80_149hp: 62 }],
            [3, { HarvestingCrop: 50, HarvestingForage: 46, Misc: 49, Planters: 56, Tilage: 49, Tractor_150hp: 54, Tractors_80_149hp: 57 }],
            [4, { HarvestingCrop: 44, HarvestingForage: 42, Misc: 45, Planters: 53, Tilage: 45, Tractor_150hp: 49, Tractors_80_149hp: 53 }],
            [5, { HarvestingCrop: 39, HarvestingForage: 39, Misc: 42, Planters: 50, Tilage: 42, Tractor_150hp: 45, Tractors_80_149hp: 49 }],
            [6, { HarvestingCrop: 35, HarvestingForage: 37, Misc: 39, Planters: 48, Tilage: 39, Tractor_150hp: 42, Tractors_80_149hp: 46 }],
            [7, { HarvestingCrop: 31, HarvestingForage: 34, Misc: 36, Planters: 46, Tilage: 36, Tractor_150hp: 39, Tractors_80_149hp: 44 }],
            [8, { HarvestingCrop: 28, HarvestingForage: 32, Misc: 34, Planters: 44, Tilage: 34, Tractor_150hp: 36, Tractors_80_149hp: 41 }],
            [9, { HarvestingCrop: 25, HarvestingForage: 30, Misc: 31, Planters: 42, Tilage: 31, Tractor_150hp: 34, Tractors_80_149hp: 39 }],
            [10, { HarvestingCrop: 22, HarvestingForage: 28, Misc: 30, Planters: 40, Tilage: 30, Tractor_150hp: 32, Tractors_80_149hp: 37 }],
            [11, { HarvestingCrop: 20, HarvestingForage: 27, Misc: 28, Planters: 39, Tilage: 28, Tractor_150hp: 30, Tractors_80_149hp: 35 }],
            [12, { HarvestingCrop: 18, HarvestingForage: 25, Misc: 26, Planters: 38, Tilage: 26, Tractor_150hp: 28, Tractors_80_149hp: 34 }]
        ]);

        // if(updatedDocument.isDetailedMachineryCosts?){
        //DETAILED MACHINERY FIXED COSTS
        // Articulated Loaders
        const articulatedLoadersInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.articulatedLoadersInitialInvestmentPerUnit || 125000;
        const numberOfArticulatedLoaders = updatedDocument.detailedMachineryFixedCosts?.numberOfArticulatedLoaders || 1;
        const articulatedLoadersTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.articulatedLoadersTotalHoursOfUse || 500;
        const articulatedLoadersDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.articulatedLoadersDairyHoursOfUse || 500;
        const articulatedLoadersEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.articulatedLoadersEquipmentAge || 1;
        const articulatedLoadersYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.articulatedLoadersYearsOfUsefulLife || 12;

        // Skid Steer Loaders
        const skidSteerLoadersInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.skidSteerLoadersInitialInvestmentPerUnit || 45000;
        const numberOfSkidSteerLoaders = updatedDocument.detailedMachineryFixedCosts?.numberOfSkidSteerLoaders || 1;
        const skidSteerLoadersTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.skidSteerLoadersTotalHoursOfUse || 500;
        const skidSteerLoadersDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.skidSteerLoadersDairyHoursOfUse || 500;
        const skidSteerLoadersEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.skidSteerLoadersEquipmentAge || 1;
        const skidSteerLoadersYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.skidSteerLoadersYearsOfUsefulLife || 12;

        // 130 hp Tractor - MFWD
        const hpTractorMFWD130InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.hpTractor130MfwDInitialInvestmentPerUnit || 80000;
        const numberOfHpTractorMFWD130 = updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractorMFWD130 || 1;
        const hpTractorMFWD130TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor130MfwDTotalHoursOfUse || 500;
        const hpTractorMFWD130DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor130MfwDDairyHoursOfUse || 150;
        const hpTractorMFWD130EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.hpTractor130MfwDEquipmentAge || 1;
        const hpTractorMFWD130YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.hpTractor130MfwDYearsOfUsefulLife || 12;

        // 75 hp Tractor - 2wd
        const hpTractor2wd75InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.hpTractor75InitialInvestmentPerUnit || 30000;
        const numberOfHpTractor2wd75 = updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractor75 || 1;
        const hpTractor2wd75TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor75TotalHoursOfUse || 500;
        const hpTractor2wd75DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor75DairyHoursOfUse || 200;
        const hpTractor2wd75EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.hpTractor75EquipmentAge || 1;
        const hpTractor2wd75YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.hpTractor75YearsOfUsefulLife || 12;

        // 50 hp Tractor - 2wd
        const tractor50Hp2wdInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.hpTractor50InitialInvestmentPerUnit || 20000;
        const numberOfHpTractor2wd50 = updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractor50 || 1;
        const tractor50Hp2wdTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor50TotalHoursOfUse || 500;
        const tractor50Hp2wdDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor50DairyHoursOfUse || 250;
        const hpTractor2wd50EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.hpTractor50EquipmentAge || 1;
        const hpTractor2wd50YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.hpTractor50YearsOfUsefulLife || 12;

        // Mixer Wagon - 650 cubic feet
        const mixerWagon650InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.mixerWagon650InitialInvestmentPerUnit || 60000;
        const numberOfMixerWagon650 = updatedDocument.detailedMachineryFixedCosts?.numberOfMixerWagon650 || 1;
        const mixerWagon650TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.mixerWagon650TotalHoursOfUse || 500;
        const mixerWagon650DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.mixerWagon650DairyHoursOfUse || 500;
        const mixerWagon650EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.mixerWagon650EquipmentAge || 1;
        const mixerWagon650YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.mixerWagon650YearsOfUsefulLife || 12;

        // ¾ ton pickup
        const threeQuarterTonPickupInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.threeQuarterTonPickupInitialInvestmentPerUnit || 45000;
        const numberOfThreeQuarterTonPickup = updatedDocument.detailedMachineryFixedCosts?.numberOfThreeQuarterTonPickup || 1;
        const threeQuarterTonPickupTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.threeQuarterTonPickupTotalHoursOfUse || 500;
        const threeQuarterTonPickupDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.threeQuarterTonPickupDairyHoursOfUse || 400;
        const threeQuarterTonPickupEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.threeQuarterTonPickupEquipmentAge || 1;
        const threeQuarterTonPickupYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.threeQuarterTonPickupYearsOfUsefulLife || 12;

        // ½ ton pickup
        const halfTonPickupInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.halfTonPickupInitialInvestmentPerUnit || 40000;
        const numberOfHalfTonPickup = updatedDocument.detailedMachineryFixedCosts?.numberOfHalfTonPickup || 1;
        const halfTonPickupTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.halfTonPickupTotalHoursOfUse || 500;
        const halfTonPickupDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.halfTonPickupDairyHoursOfUse || 250;
        const halfTonPickupEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.halfTonPickupEquipmentAge || 1;
        const halfTonPickupYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.halfTonPickupYearsOfUsefulLife || 12;

        // JD Gator
        const jdGatorInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.jdGatorInitialInvestmentPerUnit || 10000;
        const numberOfJdGator = updatedDocument.detailedMachineryFixedCosts?.numberOfJdGator || 1;
        const jdGatorTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.jdGatorTotalHoursOfUse || 500;
        const jdGatorDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.jdGatorDairyHoursOfUse || 300;
        const jdGatorEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.jdGatorEquipmentAge || 1;
        const jdGatorYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.jdGatorYearsOfUsefulLife || 12;

        // Sand Spreader
        const sandSpreaderInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.sandSpreaderInitialInvestmentPerUnit || 20000;
        const numberOfSandSpreader = updatedDocument.detailedMachineryFixedCosts?.numberOfSandSpreader || 1;
        const sandSpreaderTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.sandSpreaderTotalHoursOfUse || 500;
        const sandSpreaderDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.sandSpreaderDairyHoursOfUse || 500;
        const sandSpreaderEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.sandSpreaderEquipmentAge || 1;
        const sandSpreaderYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.sandSpreaderYearsOfUsefulLife || 12;

        // 300 hp Tractor - MFWD
        const hpTractorMFWD300InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.hpTractor300MfwDInitialInvestmentPerUnit || 250000;
        const numberOfHpTractorMFWD300 = updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractorMfwd300 || 1;
        const hpTractorMFWD300TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor300MfwDTotalHoursOfUse || 500;
        const hpTractorMFWD300DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor300MfwDDairyHoursOfUse || 200;
        const hpTractorMFWD300EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.hpTractor300MfwDEquipmentAge || 1;
        const hpTractorMFWD300YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.hpTractor300MfwDYearsOfUsefulLife || 12;

        // 200 hp Tractor - MFWD
        const hpTractorMFWD200InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.hpTractor200MfwDInitialInvestmentPerUnit || 210000;
        const numberOfHpTractorMFWD200 = updatedDocument.detailedMachineryFixedCosts?.numberOfHpTractorMFWD200 || 1;
        const hpTractorMFWD200TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor200MfwDTotalHoursOfUse || 500;
        const hpTractorMFWD200DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.hpTractor200MfwDDairyHoursOfUse || 150;
        const hpTractorMFWD200EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.hpTractor200MfwDEquipmentAge || 1;
        const hpTractorMFWD200YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.hpTractor200MfwDYearsOfUsefulLife || 12;

        // 24’ disk harrow
        const diskHarrow24InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.diskHarrow24InitialInvestmentPerUnit || 35000;
        const numberOfDiskHarrow24 = updatedDocument.detailedMachineryFixedCosts?.numberOfDiskHarrow24 || 1;
        const diskHarrow24TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.diskHarrow24TotalHoursOfUse || 500;
        const diskHarrow24DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.diskHarrow24DairyHoursOfUse || 0;
        const diskHarrow24EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.diskHarrow24EquipmentAge || 1;
        const diskHarrow24YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.diskHarrow24YearsOfUsefulLife || 12;

        // 8-row 30” strip-till planter
        const stripTillPlanter8RowInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.stripTillPlanter8RowInitialInvestmentPerUnit || 70000;
        const numberOfStripTillPlanter8Row = updatedDocument.detailedMachineryFixedCosts?.numberOfStripTillPlanter8Row || 1;
        const stripTillPlanter8RowTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.stripTillPlanter8RowTotalHoursOfUse || 500;
        const stripTillPlanter8RowDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.stripTillPlanter8RowDairyHoursOfUse || 0;
        const stripTillPlanter8RowEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.stripTillPlanter8RowEquipmentAge || 1;
        const stripTillPlanter8RowYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.stripTillPlanter8RowYearsOfUsefulLife || 12;

        // 40’ folding sprayer
        const foldingSprayer40InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.foldingSprayer40InitialInvestmentPerUnit || 20000;
        const numberOfFoldingSprayer40 = updatedDocument.detailedMachineryFixedCosts?.numberOfFoldingSprayer40 || 1;
        const foldingSprayer40TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.foldingSprayer40TotalHoursOfUse || 500;
        const foldingSprayer40DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.foldingSprayer40DairyHoursOfUse || 0;
        const foldingSprayer40EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.foldingSprayer40EquipmentAge || 1;
        const foldingSprayer40YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.foldingSprayer40YearsOfUsefulLife || 12;

        // Field Cultivator
        const fieldCultivatorInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.fieldCultivatorInitialInvestmentPerUnit || 15000;
        const numberOfFieldCultivator = updatedDocument.detailedMachineryFixedCosts?.numberOfFieldCultivator || 1;
        const fieldCultivatorTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.fieldCultivatorTotalHoursOfUse || 500;
        const fieldCultivatorDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.fieldCultivatorDairyHoursOfUse || 0;
        const fieldCultivatorEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.fieldCultivatorEquipmentAge || 1;
        const fieldCultivatorYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.fieldCultivatorYearsOfUsefulLife || 12;

        // Grain drill - 15’ no-till
        const grainDrill15NoTillInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.grainDrill15NoTillInitialInvestmentPerUnit || 60000;
        const numberOfGrainDrill15NoTill = updatedDocument.detailedMachineryFixedCosts?.numberOfGrainDrill15NoTill || 1;
        const grainDrill15NoTillTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.grainDrill15NoTillTotalHoursOfUse || 500;
        const grainDrill15NoTillDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.grainDrill15NoTillDairyHoursOfUse || 0;
        const grainDrill15NoTillEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.grainDrill15NoTillEquipmentAge || 1;
        const grainDrill15NoTillYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.grainDrill15NoTillYearsOfUsefulLife || 12;

        // Mower conditioner (self-propelled)
        const mowerConditionerSelfPropelledInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.mowerConditionerSelfPropelledInitialInvestmentPerUnit || 165000;
        const numberOfMowerConditionerSelfPropelled = updatedDocument.detailedMachineryFixedCosts?.numberOfMowerConditionerSelfPropelled || 1;
        const mowerConditionerSelfPropelledTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.mowerConditionerSelfPropelledTotalHoursOfUse || 500;
        const mowerConditionerSelfPropelledDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.mowerConditionerSelfPropelledDairyHoursOfUse || 0;
        const mowerConditionerSelfPropelledEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.mowerConditionerSelfPropelledEquipmentAge || 1;
        const mowerConditionerSelfPropelledYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.mowerConditionerSelfPropelledYearsOfUsefulLife || 12;

        // Tedder
        const tedderInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.tedderInitialInvestmentPerUnit || 10000;
        const numberOfTedder = updatedDocument.detailedMachineryFixedCosts?.numberOfTedder || 1;
        const tedderTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.tedderTotalHoursOfUse || 500;
        const tedderDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.tedderDairyHoursOfUse || 0;
        const tedderEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.tedderEquipmentAge || 1;
        const tedderYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.tedderYearsOfUsefulLife || 12;

        // Power Rake
        const powerRakeInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.powerRakeInitialInvestmentPerUnit || 40000;
        const numberOfPowerRake = updatedDocument.detailedMachineryFixedCosts?.numberOfPowerRake || 1;
        const powerRakeTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.powerRakeTotalHoursOfUse || 500;
        const powerRakeDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.powerRakeDairyHoursOfUse || 0;
        const powerRakeEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.powerRakeEquipmentAge || 1;
        const powerRakeYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.powerRakeYearsOfUsefulLife || 12;

        // 15’ Folding Rotary Mower
        const foldingRotaryMower15InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.foldingRotaryMower15InitialInvestmentPerUnit || 25000;
        const numberOfFoldingRotaryMower15 = updatedDocument.detailedMachineryFixedCosts?.numberOfFoldingRotaryMower15 || 1;
        const foldingRotaryMower15TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.foldingRotaryMower15TotalHoursOfUse || 500;
        const foldingRotaryMower15DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.foldingRotaryMower15DairyHoursOfUse || 0;
        const foldingRotaryMower15EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.foldingRotaryMower15EquipmentAge || 1;
        const foldingRotaryMower15YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.foldingRotaryMower15YearsOfUsefulLife || 12;

        // Deep-ripper
        const deepRipperInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.deepRipperInitialInvestmentPerUnit || 20000;
        const numberOfDeepRipper = updatedDocument.detailedMachineryFixedCosts?.numberOfDeepRipper || 1;
        const deepRipperTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.deepRipperTotalHoursOfUse || 500;
        const deepRipperDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.deepRipperDairyHoursOfUse || 0;
        const deepRipperEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.deepRipperEquipmentAge || 1;
        const deepRipperYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.deepRipperYearsOfUsefulLife || 12;

        // 24’ Livestock Trailer
        const livestockTrailer24InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.livestockTrailer24InitialInvestmentPerUnit || 20000;
        const numberOfLivestockTrailer24 = updatedDocument.detailedMachineryFixedCosts?.numberOfLivestockTrailer24 || 1;
        const livestockTrailer24TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.livestockTrailer24TotalHoursOfUse || 500;
        const livestockTrailer24DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.livestockTrailer24DairyHoursOfUse || 500;
        const livestockTrailer24EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.livestockTrailer24EquipmentAge || 1;
        const livestockTrailer24YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.livestockTrailer24YearsOfUsefulLife || 12;

        // Round Baler
        const roundBalerInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.roundBalerInitialInvestmentPerUnit || 40000;
        const numberOfRoundBaler = updatedDocument.detailedMachineryFixedCosts?.numberOfRoundBaler || 1;
        const roundBalerTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.roundBalerTotalHoursOfUse || 500;
        const roundBalerDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.roundBalerDairyHoursOfUse || 0;
        const roundBalerEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.roundBalerEquipmentAge || 1;
        const roundBalerYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.roundBalerYearsOfUsefulLife || 12;

        // Tub Grinder
        const tubGrinderInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.tubGrinderInitialInvestmentPerUnit || 35000;
        const numberOfTubGrinder = updatedDocument.detailedMachineryFixedCosts?.numberOfTubGrinder || 1;
        const tubGrinderTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.tubGrinderTotalHoursOfUse || 500;
        const tubGrinderDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.tubGrinderDairyHoursOfUse || 500;
        const tubGrinderEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.tubGrinderEquipmentAge || 1;
        const tubGrinderYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.tubGrinderYearsOfUsefulLife || 12;

        // Miscellaneous Equipment
        const miscellaneousEquipmentInitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.miscellaneousEquipmentInitialInvestmentPerUnit || 0;
        const numberOfMiscellaneousEquipment = updatedDocument.detailedMachineryFixedCosts?.numberOfMiscellaneousEquipment || 0;
        const miscellaneousEquipmentTotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.miscellaneousEquipmentTotalHoursOfUse || 0;
        const miscellaneousEquipmentDairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.miscellaneousEquipmentDairyHoursOfUse || 0;
        const miscellaneousEquipmentEquipmentAge = updatedDocument.detailedMachineryFixedCosts?.miscellaneousEquipmentEquipmentAge || 1;
        const miscellaneousEquipmentYearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.miscellaneousEquipmentYearsOfUsefulLife || 12;

        // Other Machinery and Equipment 1
        const otherMachineryEquipment1InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment1InitialInvestmentPerUnit || 0;
        const numberOfOtherMachineryEquipment1 = updatedDocument.detailedMachineryFixedCosts?.numberOfOtherMachineryEquipment1 || 0;
        const otherMachineryEquipment1TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment1TotalHoursOfUse || 0;
        const otherMachineryEquipment1DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment1DairyHoursOfUse || 0;
        const otherMachineryEquipment1EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment1EquipmentAge || 1;
        const otherMachineryEquipment1YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment1YearsOfUsefulLife || 12;

        // Other Machinery and Equipment 2
        const otherMachineryEquipment2InitialInvestmentPerUnit = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment2InitialInvestmentPerUnit || 0;
        const numberOfOtherMachineryEquipment2 = updatedDocument.detailedMachineryFixedCosts?.numberOfOtherMachineryEquipment2 || 0;
        const otherMachineryEquipment2TotalHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment2TotalHoursOfUse || 0;
        const otherMachineryEquipment2DairyHoursOfUse = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment2DairyHoursOfUse || 0;
        const otherMachineryEquipment2EquipmentAge = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment2EquipmentAge || 1;
        const otherMachineryEquipment2YearsOfUsefulLife = updatedDocument.detailedMachineryFixedCosts?.otherMachineryEquipment2YearsOfUsefulLife || 12;
        // }

        //------->>>Some other Variables required to calculate operating costs output
        const cowInitialInvestmentValue = (totalNumberOfCows)*(cowPurchaseValue);
        const cowEstimatedSalvageValue = ((totalNumberOfCows) * (cullCowsPrice)) *(1 - (cowDeathLossRate/100));
        const cowYearsOfUsefulLife = 1/(cullingRate/100)
        const cowAnnualAmortization = (((cowInitialInvestmentValue) - (cowEstimatedSalvageValue)) * (shortTermInterestRate)) / (1 - (1 + (shortTermInterestRate)) ** (-(cowYearsOfUsefulLife))) + ((cowEstimatedSalvageValue) * (shortTermInterestRate));
        const cowInsurance = (cowInitialInvestmentValue)*(livestockInsuranceRate);
        const cowTotalAnnualEconomicCost = (cowAnnualAmortization) + (cowInsurance);
        
        const bredHeiferInitialInvestment = (numberOfBredHeifers)*(bredHeiferPurchaseValue);
        const bredHeiferSalvageValue = (numberOfBredHeifers)*(cullCowsPrice)*(1-(cowDeathLossRate/100));
        const bredHeiferYearsofUsefulLife =  1/(cullingRate/100) + 1;
        const bredHeiferAnnualAmortization = (((bredHeiferInitialInvestment - bredHeiferSalvageValue) * shortTermInterestRate) /(1 - (1 + shortTermInterestRate) ** (-bredHeiferYearsofUsefulLife))) + (bredHeiferSalvageValue * shortTermInterestRate);
        const bredHeiferInsurance = (bredHeiferInitialInvestment)*(livestockInsuranceRate/100);
        const bredHeiferTotalAnnualEconomicCost = (bredHeiferAnnualAmortization) + (bredHeiferInsurance);
        
        //FACILITIES and BUILDINGS
        const farmShopandGeneralRoadsEstimatedSalvageValue = (farmShopAndGeneralRoadsInitialInvestment) * (3/10);
        const farmShopandGeneralRoadsAnnualAmortization = (((farmShopAndGeneralRoadsInitialInvestment - farmShopandGeneralRoadsEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -farmShopAndGeneralRoadsYearsOfUsefulLife))) + (farmShopandGeneralRoadsEstimatedSalvageValue * (longTermInterestRate / 100));
        const farmShopandGeneralRoadsPropertyTax = (farmShopAndGeneralRoadsInitialInvestment) * (propertyTaxRate/100);
        const farmShopandGeneralRoadsPropertyInsurance =  (farmShopAndGeneralRoadsInitialInvestment) * (propertyTaxRate/100);
        const farmShopandGeneralRoadsTotalAnnualEconomicCost = (farmShopandGeneralRoadsAnnualAmortization) + (farmShopandGeneralRoadsPropertyTax) + (farmShopandGeneralRoadsPropertyInsurance);

        const milkingParlorandEquipmentEstimatedSalvageValue = (milkingParlorandEquipmentInitialInvestment) * (3/10) ;
        const milkingParlorandEquipmentAnnualAmortization =  (((milkingParlorAndEquipmentInitialInvestment)-(milkingParlorandEquipmentEstimatedSalvageValue)) * (longTermInterestRate/100)) / (1 - (1 + (longTermInterestRate/100))^(-(milkingParlorAndEquipmentYearsOfUsefulLife))) + ((milkingParlorandEquipmentEstimatedSalvageValue) * (longTermInterestRate/100)) 
        const milkingParlorandEquipmentPropertyTax = (milkingParlorAndEquipmentInitialInvestment)*(propertyInsuranceRate);
        const milkingParlorandEquipmentPropertyInsurance = (milkingParlorAndEquipmentInitialInvestment)*(propertyInsuranceRate/100);
        const milkingParlorandEquipmentTotalAnnualEconomicCost = (milkingParlorandEquipmentAnnualAmortization) + (milkingParlorandEquipmentPropertyTax) + (milkingParlorandEquipmentPropertyInsurance);
        
        const feedingEquipmentEstimatedSalvageValue = (feedingEquipmentInitialInvestment)*(3/10);
        const feedingEquipmentAnnualAmortization = (((feedingEquipmentInitialInvestment)-(feedingEquipmentEstimatedSalvageValue)) * (longTermInterestRate/100)) / (1 - (1 + (longTermInterestRate/100))^(-(feedingEquipmentYearsOfUsefulLife))) + ((feedingEquipmentEstimatedSalvageValue) * (longTermInterestRate/100));
        const feedingEquipmentPropertyTax = (feedingEquipmentInitialInvestment) * (propertyTaxRate/100);
        const feedingEquipmentPropertyInsurance = (feedingEquipmentInitialInvestment) * (propertyInsuranceRate/100);
        const feedingEquipmentTotalAnnualEconomicCost = (feedingEquipmentAnnualAmortization) + (feedingEquipmentPropertyTax) + (feedingEquipmentPropertyInsurance);
        
        const freestallHousingandLanesEstimatedSalvageValue = (freestallHousingAndLanesInitialInvestment) * (3/10);
        const freestallHousingandLanesAnnualAmortization = (((freestallHousingAndLanesInitialInvestment)-(freestallHousingandLanesEstimatedSalvageValue)) * (longTermInterestRate/100)) / (1 - (1 + (longTermInterestRate/100))^(-(freestallHousingAndLanesYearsOfUsefulLife))) + ((freestallHousingandLanesEstimatedSalvageValue) * (longTermInterestRate/100)) 
        const freestallHousingandLanesPropertyTax = (freestallHousingAndLanesInitialInvestment) * (propertyTaxRate/100);
        const freestallHousingandLanesPropertyInsurance = (freestallHousingAndLanesInitialInvestment) * (propertyInsuranceRate/100);
        const freestallHousingandLanesTotalAnnualEconomicCost = (freestallHousingandLanesAnnualAmortization) + (freestallHousingandLanesPropertyTax) + (freestallHousingandLanesPropertyInsurance);
        
        const threePhasePowerSupplyEstimatedSalvageValue = (threePhasePowerSupplyInitialInvestment) * (3/10);
        const threePhasePowerSupplyAnnualAmortization = (((threePhasePowerSupplyInitialInvestment - threePhasePowerSupplyEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -threePhasePowerSupplyYearsOfUsefulLife))) + (threePhasePowerSupplyEstimatedSalvageValue * (longTermInterestRate / 100));
        const threePhasePowerSupplyPropertyTax = (threePhasePowerSupplyInitialInvestment) * (propertyTaxRate/100);
        const threePhasePowerSupplyPropertyInsurance = (threePhasePowerSupplyInitialInvestment) * (propertyInsuranceRate/100);
        const threePhasePowerSupplyTotalAnnualEconomicCost = (threePhasePowerSupplyAnnualAmortization) + (threePhasePowerSupplyPropertyTax) + (threePhasePowerSupplyPropertyInsurance);
        
        const waterSystemEstimatedSalvageValue = (waterSystemInitialInvestment) * (3/10);
        const waterSystemAnnualAmortization = (((waterSystemInitialInvestment - waterSystemEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -waterSystemYearsOfUsefulLife))) + (waterSystemEstimatedSalvageValue * (longTermInterestRate / 100));
        const waterSystemPropertyTax = (waterSystemInitialInvestment)*(propertyTaxRate/100);
        const waterSystemPropertyInsurance = (waterSystemInitialInvestment)*(propertyInsuranceRate/100);
        const waterSystemTotalAnnualEconomicCost = (waterSystemAnnualAmortization) + (waterSystemPropertyTax) + (waterSystemPropertyInsurance);
        
        const hayShedEstimatedSalvageValue = (hayShedInitialInvestment) * (3/10);
        const hayShedAnnualAmortization = (((hayShedInitialInvestment - hayShedEstimatedSalvageValue) * (longTermInterestRate / 100)) / 
                                  (1 - Math.pow((1 + (longTermInterestRate / 100)), -hayShedYearsOfUsefulLife))) + 
                                  (hayShedEstimatedSalvageValue * (longTermInterestRate / 100));
        const hayShedPropertyTax = (hayShedInitialInvestment) * (propertyTaxRate/100);
        const hayShedPropertyInsurance = (hayShedInitialInvestment) * (propertyInsuranceRate/100);
        const hayShedTotalAnnualEconomicCost = (hayShedAnnualAmortization) + (hayShedPropertyTax) + (hayShedPropertyInsurance);
        
        const trenchSilosEstimatedSalvageValue = (trenchSilosInitialInvestment) * (3/10);
        const trenchSilosAnnualAmortization = (((trenchSilosInitialInvestment - trenchSilosEstimatedSalvageValue) * (longTermInterestRate / 100)) / 
                                      (1 - Math.pow((1 + (longTermInterestRate / 100)), -trenchSilosYearsOfUsefulLife))) + 
                                      (trenchSilosEstimatedSalvageValue * (longTermInterestRate / 100));
        const trenchSilosPropertyTax = (trenchSilosInitialInvestment) * (propertyTaxRate/100);
        const trenchSilosPropertyInsurance = (trenchSilosInitialInvestment) * (propertyInsuranceRate/100);
        const trenchSilosTotalAnnualEconomicCost = (trenchSilosAnnualAmortization) + (trenchSilosPropertyTax) + (trenchSilosPropertyInsurance);
        
        const fencesEstimatedSalvageValue = (fencesInitialInvestment) * (3/10);
        const fencesAnnualAmortization = (((fencesInitialInvestment - fencesEstimatedSalvageValue) * (longTermInterestRate / 100)) / 
                                  (1 - Math.pow((1 + (longTermInterestRate / 100)), -fencesYearsOfUsefulLife))) + 
                                  (fencesEstimatedSalvageValue * (longTermInterestRate / 100));
        const fencesPropertyTax = (fencesInitialInvestment) * (propertyTaxRate/100);
        const fencesPropertyInsurance = (fencesInitialInvestment) * (propertyInsuranceRate/100);
        const fencesTotalAnnualEconomicCost = (fencesAnnualAmortization) + (fencesPropertyTax) + (fencesPropertyInsurance);
        
        const commodityBarnEstimatedSalvageValue = (commodityBarnInitialInvestment) * (3 / 10);
        const commodityBarnAnnualAmortization = (((commodityBarnInitialInvestment - commodityBarnEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-commodityBarnYearsOfUsefulLife))) + (commodityBarnEstimatedSalvageValue * (longTermInterestRate / 100));
        const commodityBarnPropertyTax = (commodityBarnInitialInvestment) * (propertyTaxRate / 100);
        const commodityBarnPropertyInsurance = (commodityBarnInitialInvestment) * (propertyInsuranceRate / 100);
        const commodityBarnTotalAnnualEconomicCost = (commodityBarnAnnualAmortization) + (commodityBarnPropertyTax) + (commodityBarnPropertyInsurance);
        
        const calfOrHeiferBarnEstimatedSalvageValue = (calfOrHeiferBarnInitialInvestment) * (3 / 10);
        const calfOrHeiferBarnAnnualAmortization = (((calfOrHeiferBarnInitialInvestment - calfOrHeiferBarnEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-calfOrHeiferBarnYearsOfUsefulLife))) + (calfOrHeiferBarnEstimatedSalvageValue * (longTermInterestRate / 100));
        const calfOrHeiferBarnPropertyTax = (calfOrHeiferBarnInitialInvestment) * (propertyTaxRate / 100);
        const calfOrHeiferBarnPropertyInsurance = (calfOrHeiferBarnInitialInvestment) * (propertyInsuranceRate / 100);
        const calfOrHeiferBarnTotalAnnualEconomicCost = (calfOrHeiferBarnAnnualAmortization) + (calfOrHeiferBarnPropertyTax) + (calfOrHeiferBarnPropertyInsurance);
        
        const tiltTableEstimatedSalvageValue = (tiltTableInitialInvestment) * (3 / 10);
        const tiltTableAnnualAmortization = (((tiltTableInitialInvestment - tiltTableEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-tiltTableYearsOfUsefulLife))) + (tiltTableEstimatedSalvageValue * (longTermInterestRate / 100)); 
        const tiltTablePropertyTax = (tiltTableInitialInvestment) * (propertyTaxRate / 100);
        const tiltTablePropertyInsurance = (tiltTableInitialInvestment) * (propertyInsuranceRate / 100);
        const tiltTableTotalAnnualEconomicCost = (tiltTableAnnualAmortization) + (tiltTablePropertyTax) + (tiltTablePropertyInsurance);
        
        const cattleHandlingFacilitiesEstimatedSalvageValue = (cattleHandlingFacilitiesInitialInvestment) * (3 / 10);
        const cattleHandlingFacilitiesAnnualAmortization = (((cattleHandlingFacilitiesInitialInvestment - cattleHandlingFacilitiesEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-cattleHandlingFacilitiesYearsOfUsefulLife))) + (cattleHandlingFacilitiesEstimatedSalvageValue * (longTermInterestRate / 100));
        const cattleHandlingFacilitiesPropertyTax = (cattleHandlingFacilitiesInitialInvestment) * (propertyTaxRate / 100);
        const cattleHandlingFacilitiesPropertyInsurance = (cattleHandlingFacilitiesInitialInvestment) * (propertyInsuranceRate / 100);
        const cattleHandlingFacilitiesTotalAnnualEconomicCost = (cattleHandlingFacilitiesAnnualAmortization) + (cattleHandlingFacilitiesPropertyTax) + (cattleHandlingFacilitiesPropertyInsurance);

        const otherFacilitiesAndBuildings1EstimatedSalvageValue = (otherFacilitiesAndBuildings1InitialInvestment) * (3 / 10);
        const otherFacilitiesAndBuildings1AnnualAmortization = (((otherFacilitiesAndBuildings1InitialInvestment - otherFacilitiesAndBuildings1EstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-otherFacilitiesAndBuildings1YearsOfUsefulLife))) + (otherFacilitiesAndBuildings1EstimatedSalvageValue * (longTermInterestRate / 100));
        const otherFacilitiesAndBuildings1PropertyTax = (otherFacilitiesAndBuildings1InitialInvestment) * (propertyTaxRate / 100);
        const otherFacilitiesAndBuildings1PropertyInsurance = (otherFacilitiesAndBuildings1InitialInvestment) * (propertyInsuranceRate / 100);
        const otherFacilitiesAndBuildings1TotalAnnualEconomicCost = (otherFacilitiesAndBuildings1AnnualAmortization) + (otherFacilitiesAndBuildings1PropertyTax) + (otherFacilitiesAndBuildings1PropertyInsurance);

        const otherFacilitiesAndBuildings2EstimatedSalvageValue = (otherFacilitiesAndBuildings2InitialInvestment) * (3 / 10);
        const otherFacilitiesAndBuildings2AnnualAmortization = (((otherFacilitiesAndBuildings2InitialInvestment - otherFacilitiesAndBuildings2EstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-otherFacilitiesAndBuildings2YearsOfUsefulLife))) + (otherFacilitiesAndBuildings2EstimatedSalvageValue * (longTermInterestRate / 100));
        const otherFacilitiesAndBuildings2PropertyTax = (otherFacilitiesAndBuildings2InitialInvestment) * (propertyTaxRate / 100);
        const otherFacilitiesAndBuildings2PropertyInsurance = (otherFacilitiesAndBuildings2InitialInvestment) * (propertyInsuranceRate / 100);
        const otherFacilitiesAndBuildings2TotalAnnualEconomicCost = (otherFacilitiesAndBuildings2AnnualAmortization) + (otherFacilitiesAndBuildings2PropertyTax) + (otherFacilitiesAndBuildings2PropertyInsurance);

        //WASTE MANAGEMENT
        const wasteStoragePondEstimatedSalvageValue = wasteStoragePondInitialInvestment * (3 / 10);
        const wasteStoragePondAnnualAmortization = (((wasteStoragePondInitialInvestment - wasteStoragePondEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-wasteStoragePondYearsOfUsefulLife))) + (wasteStoragePondEstimatedSalvageValue * (longTermInterestRate / 100));
        const wasteStoragePondPropertyTax = wasteStoragePondInitialInvestment * (propertyTaxRate / 100);
        const wasteStoragePondPropertyInsurance = wasteStoragePondInitialInvestment * (propertyInsuranceRate / 100);
        const wasteStoragePondTotalAnnualEconomicCost = wasteStoragePondAnnualAmortization + wasteStoragePondPropertyTax + wasteStoragePondPropertyInsurance;

        const compactClayLinerEstimatedSalvageValue = compactClayLinerInitialInvestment * (3 / 10);
        const compactClayLinerAnnualAmortization = (((compactClayLinerInitialInvestment - compactClayLinerEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-compactClayLinerYearsOfUsefulLife))) + (compactClayLinerEstimatedSalvageValue * (longTermInterestRate / 100));
        const compactClayLinerPropertyTax = compactClayLinerInitialInvestment * (propertyTaxRate / 100);
        const compactClayLinerPropertyInsurance = compactClayLinerInitialInvestment * (propertyInsuranceRate / 100);
        const compactClayLinerTotalAnnualEconomicCost = compactClayLinerAnnualAmortization + compactClayLinerPropertyTax + compactClayLinerPropertyInsurance;

        const monitoringWellsEstimatedSalvageValue = monitoringWellsInitialInvestment * (3 / 10);
        const monitoringWellsAnnualAmortization = (((monitoringWellsInitialInvestment - monitoringWellsEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-monitoringWellsYearsOfUsefulLife))) + (monitoringWellsEstimatedSalvageValue * (longTermInterestRate / 100));
        const monitoringWellsPropertyTax = monitoringWellsInitialInvestment * (propertyTaxRate / 100);
        const monitoringWellsPropertyInsurance = monitoringWellsInitialInvestment * (propertyInsuranceRate / 100);
        const monitoringWellsTotalAnnualEconomicCost = monitoringWellsAnnualAmortization + monitoringWellsPropertyTax + monitoringWellsPropertyInsurance;

        const solidsSeparatorEstimatedSalvageValue = solidsSeparatorInitialInvestment * (3 / 10);
        const solidsSeparatorAnnualAmortization = (((solidsSeparatorInitialInvestment - solidsSeparatorEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-solidsSeparatorYearsOfUsefulLife))) + (solidsSeparatorEstimatedSalvageValue * (longTermInterestRate / 100));
        const solidsSeparatorPropertyTax = solidsSeparatorInitialInvestment * (propertyTaxRate / 100);
        const solidsSeparatorPropertyInsurance = solidsSeparatorInitialInvestment * (propertyInsuranceRate / 100);
        const solidsSeparatorTotalAnnualEconomicCost = solidsSeparatorAnnualAmortization + solidsSeparatorPropertyTax + solidsSeparatorPropertyInsurance;

        const lagoonPumpEstimatedSalvageValue = lagoonPumpInitialInvestment * (3 / 10);
        const lagoonPumpAnnualAmortization = (((lagoonPumpInitialInvestment - lagoonPumpEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-lagoonPumpYearsOfUsefulLife))) + (lagoonPumpEstimatedSalvageValue * (longTermInterestRate / 100));
        const lagoonPumpPropertyTax = lagoonPumpInitialInvestment * (propertyTaxRate / 100);
        const lagoonPumpPropertyInsurance = lagoonPumpInitialInvestment * (propertyInsuranceRate / 100);
        const lagoonPumpTotalAnnualEconomicCost = lagoonPumpAnnualAmortization + lagoonPumpPropertyTax + lagoonPumpPropertyInsurance;

        const pipesEstimatedSalvageValue = pipesInitialInvestment * (3 / 10);
        const pipesAnnualAmortization = (((pipesInitialInvestment - pipesEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-pipesYearsOfUsefulLife))) + (pipesEstimatedSalvageValue * (longTermInterestRate / 100));
        const pipesPropertyTax = pipesInitialInvestment * (propertyTaxRate / 100);
        const pipesPropertyInsurance = pipesInitialInvestment * (propertyInsuranceRate / 100);
        const pipesTotalAnnualEconomicCost = pipesAnnualAmortization + pipesPropertyTax + pipesPropertyInsurance;

        const powerUnitEstimatedSalvageValue = powerUnitInitialInvestment * (3 / 10);
        const powerUnitAnnualAmortization = (((powerUnitInitialInvestment - powerUnitEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-powerUnitYearsOfUsefulLife))) + (powerUnitEstimatedSalvageValue * (longTermInterestRate / 100));
        const powerUnitPropertyTax = powerUnitInitialInvestment * (propertyTaxRate / 100);
        const powerUnitPropertyInsurance = powerUnitInitialInvestment * (propertyInsuranceRate / 100);
        const powerUnitTotalAnnualEconomicCost = powerUnitAnnualAmortization + powerUnitPropertyTax + powerUnitPropertyInsurance;

        const irrigationSystemEstimatedSalvageValue = irrigationSystemInitialInvestment * (3 / 10);
        const irrigationSystemAnnualAmortization = (((irrigationSystemInitialInvestment - irrigationSystemEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-irrigationSystemYearsOfUsefulLife))) + (irrigationSystemEstimatedSalvageValue * (longTermInterestRate / 100));
        const irrigationSystemPropertyTax = irrigationSystemInitialInvestment * (propertyTaxRate / 100);
        const irrigationSystemPropertyInsurance = irrigationSystemInitialInvestment * (propertyInsuranceRate / 100);
        const irrigationSystemTotalAnnualEconomicCost = irrigationSystemAnnualAmortization + irrigationSystemPropertyTax + irrigationSystemPropertyInsurance;

        const agitatorEstimatedSalvageValue = agitatorInitialInvestment * (3 / 10);
        const agitatorAnnualAmortization = (((agitatorInitialInvestment - agitatorEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-agitatorYearsOfUsefulLife))) + (agitatorEstimatedSalvageValue * (longTermInterestRate / 100));
        const agitatorPropertyTax = agitatorInitialInvestment * (propertyTaxRate / 100);
        const agitatorPropertyInsurance = agitatorInitialInvestment * (propertyInsuranceRate / 100);
        const agitatorTotalAnnualEconomicCost = agitatorAnnualAmortization + agitatorPropertyTax + agitatorPropertyInsurance;

        const manureSpreaderEstimatedSalvageValue = manureSpreaderInitialInvestment * (3 / 10);
        const manureSpreaderAnnualAmortization = (((manureSpreaderInitialInvestment - manureSpreaderEstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-manureSpreaderYearsOfUsefulLife))) + (manureSpreaderEstimatedSalvageValue * (longTermInterestRate / 100));
        const manureSpreaderPropertyTax = manureSpreaderInitialInvestment * (propertyTaxRate / 100);
        const manureSpreaderPropertyInsurance = manureSpreaderInitialInvestment * (propertyInsuranceRate / 100);
        const manureSpreaderTotalAnnualEconomicCost = manureSpreaderAnnualAmortization + manureSpreaderPropertyTax + manureSpreaderPropertyInsurance;

        const otherManureManagementStructure1EstimatedSalvageValue = otherManureManagementStructure1InitialInvestment * (3 / 10);
        const otherManureManagementStructure1AnnualAmortization = (((otherManureManagementStructure1InitialInvestment - otherManureManagementStructure1EstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-otherManureManagementStructure1YearsOfUsefulLife))) + (otherManureManagementStructure1EstimatedSalvageValue * (longTermInterestRate / 100));
        const otherManureManagementStructure1PropertyTax = otherManureManagementStructure1InitialInvestment * (propertyTaxRate / 100);
        const otherManureManagementStructure1PropertyInsurance = otherManureManagementStructure1InitialInvestment * (propertyInsuranceRate / 100);
        const otherManureManagementStructure1TotalAnnualEconomicCost = otherManureManagementStructure1AnnualAmortization + otherManureManagementStructure1PropertyTax + otherManureManagementStructure1PropertyInsurance;

        const otherManureManagementStructure2EstimatedSalvageValue = otherManureManagementStructure2InitialInvestment * (3 / 10);
        const otherManureManagementStructure2AnnualAmortization = (((otherManureManagementStructure2InitialInvestment - otherManureManagementStructure2EstimatedSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-otherManureManagementStructure2YearsOfUsefulLife))) + (otherManureManagementStructure2EstimatedSalvageValue * (longTermInterestRate / 100));
        const otherManureManagementStructure2PropertyTax = otherManureManagementStructure2InitialInvestment * (propertyTaxRate / 100);
        const otherManureManagementStructure2PropertyInsurance = otherManureManagementStructure2InitialInvestment * (propertyInsuranceRate / 100);
        const otherManureManagementStructure2TotalAnnualEconomicCost = otherManureManagementStructure2AnnualAmortization + otherManureManagementStructure2PropertyTax + otherManureManagementStructure2PropertyInsurance;

        //LAND FIXED COSTS
        const totalLandRentalCost = (acres)*(rentalCost)

        var totalMachineryFixedCost: number = machineryFixedCostTotalEstimate;
        if(updatedDocument.isDetailedMachineryCosts){
            //DETAILED MACHINERY FIXED COSTS
            // Articulated Loaders
            const articulatedLoadersInitialInvestment = numberOfArticulatedLoaders * articulatedLoadersInitialInvestmentPerUnit;
            const articulatedLoadersEstimatedCurrentSalvageValue = articulatedLoadersInitialInvestment * ageCategories.get(articulatedLoadersEquipmentAge).Misc;
            const articulatedLoadersEstimatedFinalSalvageValue = articulatedLoadersInitialInvestment * ageCategories.get(articulatedLoadersYearsOfUsefulLife).Misc;
            const articulatedLoadersAnnualAmortization = ((articulatedLoadersEstimatedCurrentSalvageValue - articulatedLoadersEstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-((articulatedLoadersYearsOfUsefulLife) - (articulatedLoadersEquipmentAge)))) + ((articulatedLoadersEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const articulatedLoadersPropertyTax = articulatedLoadersEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const articulatedLoadersPropertyInsurance = articulatedLoadersInitialInvestment * (machineryInsuranceRate / 100);
            const articulatedLoadersTotalAnnualEconomicCost = (articulatedLoadersAnnualAmortization + articulatedLoadersPropertyTax + articulatedLoadersPropertyInsurance) * (articulatedLoadersDairyHoursOfUse / articulatedLoadersTotalHoursOfUse);

            // Skid Steer Loaders
            const skidSteerLoadersInitialInvestment = numberOfSkidSteerLoaders * skidSteerLoadersInitialInvestmentPerUnit;
            const skidSteerLoadersEstimatedCurrentSalvageValue = skidSteerLoadersInitialInvestment * ageCategories.get(skidSteerLoadersEquipmentAge).Misc;
            const skidSteerLoadersEstimatedFinalSalvageValue = skidSteerLoadersInitialInvestment * ageCategories.get(skidSteerLoadersYearsOfUsefulLife).Misc;
            const skidSteerLoadersAnnualAmortization = ((skidSteerLoadersEstimatedCurrentSalvageValue - skidSteerLoadersEstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-((skidSteerLoadersYearsOfUsefulLife) - (skidSteerLoadersEquipmentAge)))) + ((skidSteerLoadersEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const skidSteerLoadersPropertyTax = skidSteerLoadersEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const skidSteerLoadersPropertyInsurance = skidSteerLoadersInitialInvestment * (machineryInsuranceRate / 100);
            const skidSteerLoadersTotalAnnualEconomicCost = (skidSteerLoadersAnnualAmortization + skidSteerLoadersPropertyTax + skidSteerLoadersPropertyInsurance) * (skidSteerLoadersDairyHoursOfUse / skidSteerLoadersTotalHoursOfUse);
            
            // 130 hp Tractor - MFWD   
            const hpTractorMFWD130InitialInvestment = numberOfHpTractorMFWD130 * hpTractorMFWD130InitialInvestmentPerUnit;
            const hpTractorMFWD130EstimatedCurrentSalvageValue = hpTractorMFWD130InitialInvestment * ageCategories.get(hpTractorMFWD130EquipmentAge).Tractors_80_149hp;
            const hpTractorMFWD130EstimatedFinalSalvageValue = hpTractorMFWD130InitialInvestment * ageCategories.get(hpTractorMFWD130YearsOfUsefulLife).Tractors_80_149hp;
            const hpTractorMFWD130AnnualAmortization = ((hpTractorMFWD130EstimatedCurrentSalvageValue - hpTractorMFWD130EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-((hpTractorMFWD130YearsOfUsefulLife) - (hpTractorMFWD130EquipmentAge)))) + ((hpTractorMFWD130EstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const hpTractorMFWD130PropertyTax = hpTractorMFWD130EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const hpTractorMFWD130PropertyInsurance = hpTractorMFWD130InitialInvestment * (machineryInsuranceRate / 100);
            const hpTractorMFWD130TotalAnnualEconomicCost = (hpTractorMFWD130AnnualAmortization + hpTractorMFWD130PropertyTax + hpTractorMFWD130PropertyInsurance) * (hpTractorMFWD130DairyHoursOfUse / hpTractorMFWD130TotalHoursOfUse);

            
            // 75 hp Tractor - 2wd
            const hpTractor2wd75InitialInvestment = numberOfHpTractor2wd75 * hpTractor2wd75InitialInvestmentPerUnit;
            const hpTractor2wd75EstimatedCurrentSalvageValue = hpTractor2wd75InitialInvestment * ageCategories.get(hpTractor2wd75EquipmentAge).Tractors_80_149hp;
            const hpTractor2wd75EstimatedFinalSalvageValue = hpTractor2wd75InitialInvestment * ageCategories.get(hpTractor2wd75YearsOfUsefulLife).Tractors_80_149hp;
            const hpTractor2wd75AnnualAmortization = ((hpTractor2wd75EstimatedCurrentSalvageValue - hpTractor2wd75EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-((hpTractor2wd75YearsOfUsefulLife) - (hpTractor2wd75EquipmentAge)))) + ((hpTractor2wd75EstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const hpTractor2wd75PropertyTax = hpTractor2wd75EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const hpTractor2wd75PropertyInsurance = hpTractor2wd75InitialInvestment * (machineryInsuranceRate / 100);
            const hpTractor2wd75TotalAnnualEconomicCost = (hpTractor2wd75AnnualAmortization + hpTractor2wd75PropertyTax + hpTractor2wd75PropertyInsurance) * (hpTractor2wd75DairyHoursOfUse / hpTractor2wd75TotalHoursOfUse);

            // 50 hp Tractor - 2wd
            const tractor50Hp2wdInitialInvestment = numberOfHpTractor2wd50 * tractor50Hp2wdInitialInvestmentPerUnit;
            const tractor50Hp2wdEstimatedCurrentSalvageValue = tractor50Hp2wdInitialInvestment * ageCategories.get(hpTractor2wd50EquipmentAge).Tractors_80_149hp;
            const tractor50Hp2wdEstimatedFinalSalvageValue = tractor50Hp2wdInitialInvestment * ageCategories.get(hpTractor2wd50YearsOfUsefulLife).Tractors_80_149hp;
            const tractor50Hp2wdAnnualAmortization = ((tractor50Hp2wdEstimatedCurrentSalvageValue - tractor50Hp2wdEstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - (1 + (longTermInterestRate / 100)) ** (-((hpTractor2wd50YearsOfUsefulLife) - (hpTractor2wd50EquipmentAge)))) + ((tractor50Hp2wdEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const tractor50Hp2wdPropertyTax = tractor50Hp2wdEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const tractor50Hp2wdPropertyInsurance = tractor50Hp2wdInitialInvestment * (machineryInsuranceRate / 100);
            const hpTractor2wd50TotalAnnualEconomicCost = (tractor50Hp2wdAnnualAmortization + tractor50Hp2wdPropertyTax + tractor50Hp2wdPropertyInsurance) * (tractor50Hp2wdDairyHoursOfUse / tractor50Hp2wdTotalHoursOfUse);

            // Mixer Wagon - 650 cubic feet
            const mixerWagon650InitialInvestment = numberOfMixerWagon650 * mixerWagon650InitialInvestmentPerUnit;
            const mixerWagon650EstimatedCurrentSalvageValue = mixerWagon650InitialInvestment * ageCategories.get(mixerWagon650EquipmentAge).Misc;
            const mixerWagon650EstimatedFinalSalvageValue = mixerWagon650InitialInvestment * ageCategories.get(mixerWagon650YearsOfUsefulLife).Misc;
            const mixerWagon650AnnualAmortization = (
                ((mixerWagon650EstimatedCurrentSalvageValue - mixerWagon650EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) /
                (1 - Math.pow(1 + (longTermInterestRate / 100), -(mixerWagon650YearsOfUsefulLife - mixerWagon650EquipmentAge)))
            ) + (mixerWagon650EstimatedFinalSalvageValue * (longTermInterestRate / 100));          
            const mixerWagon650PropertyTax = mixerWagon650EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const mixerWagon650PropertyInsurance = mixerWagon650InitialInvestment * (machineryInsuranceRate / 100);
            const mixerWagon650TotalAnnualEconomicCost = (mixerWagon650AnnualAmortization + mixerWagon650PropertyTax + mixerWagon650PropertyInsurance) * (mixerWagon650DairyHoursOfUse / mixerWagon650TotalHoursOfUse);

            // ¾ ton pickup
            const threeQuarterTonPickupInitialInvestment = numberOfThreeQuarterTonPickup * threeQuarterTonPickupInitialInvestmentPerUnit;
            const threeQuarterTonPickupEstimatedCurrentSalvageValue = threeQuarterTonPickupInitialInvestment * ageCategories.get(threeQuarterTonPickupEquipmentAge).Misc;
            const threeQuarterTonPickupEstimatedFinalSalvageValue = threeQuarterTonPickupInitialInvestment * ageCategories.get(threeQuarterTonPickupYearsOfUsefulLife).Misc;
            const threeQuarterTonPickupAnnualAmortization = ((threeQuarterTonPickupEstimatedCurrentSalvageValue - threeQuarterTonPickupEstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(threeQuarterTonPickupYearsOfUsefulLife - threeQuarterTonPickupEquipmentAge))) + (threeQuarterTonPickupEstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const threeQuarterTonPickupPropertyTax = threeQuarterTonPickupEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const threeQuarterTonPickupPropertyInsurance = threeQuarterTonPickupInitialInvestment * (machineryInsuranceRate / 100);
            const threeQuarterTonPickupTotalAnnualEconomicCost = (threeQuarterTonPickupAnnualAmortization + threeQuarterTonPickupPropertyTax + threeQuarterTonPickupPropertyInsurance) * (threeQuarterTonPickupDairyHoursOfUse / threeQuarterTonPickupTotalHoursOfUse);

            // ½ ton pickup
            const halfTonPickupInitialInvestment = numberOfHalfTonPickup * halfTonPickupInitialInvestmentPerUnit;
            const halfTonPickupEstimatedCurrentSalvageValue = halfTonPickupInitialInvestment * ageCategories.get(halfTonPickupEquipmentAge).Misc;
            const halfTonPickupEstimatedFinalSalvageValue = halfTonPickupInitialInvestment * ageCategories.get(halfTonPickupYearsOfUsefulLife).Misc;
            const halfTonPickupAnnualAmortization = ((halfTonPickupEstimatedCurrentSalvageValue - halfTonPickupEstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(halfTonPickupYearsOfUsefulLife - halfTonPickupEquipmentAge))) + (halfTonPickupEstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const halfTonPickupPropertyTax = halfTonPickupEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const halfTonPickupPropertyInsurance = halfTonPickupInitialInvestment * (machineryInsuranceRate / 100);
            const halfTonPickupTotalAnnualEconomicCost = (halfTonPickupAnnualAmortization + halfTonPickupPropertyTax + halfTonPickupPropertyInsurance) * (halfTonPickupDairyHoursOfUse / halfTonPickupTotalHoursOfUse);

            // JD Gator
            const jdGatorInitialInvestment = numberOfJdGator * jdGatorInitialInvestmentPerUnit;
            const jdGatorEstimatedCurrentSalvageValue = jdGatorInitialInvestment * ageCategories.get(jdGatorEquipmentAge).Misc;
            const jdGatorEstimatedFinalSalvageValue = jdGatorInitialInvestment * ageCategories.get(jdGatorYearsOfUsefulLife).Misc;
            const jdGatorAnnualAmortization = ((jdGatorEstimatedCurrentSalvageValue - jdGatorEstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(jdGatorYearsOfUsefulLife - jdGatorEquipmentAge))) + (jdGatorEstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const jdGatorPropertyTax = jdGatorEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const jdGatorPropertyInsurance = jdGatorInitialInvestment * (machineryInsuranceRate / 100);
            const jdGatorTotalAnnualEconomicCost = (jdGatorAnnualAmortization + jdGatorPropertyTax + jdGatorPropertyInsurance) * (jdGatorDairyHoursOfUse / jdGatorTotalHoursOfUse);

            // Sand Spreader
            const sandSpreaderInitialInvestment = numberOfSandSpreader * sandSpreaderInitialInvestmentPerUnit;
            const sandSpreaderEstimatedCurrentSalvageValue = sandSpreaderInitialInvestment * ageCategories.get(sandSpreaderEquipmentAge).Misc;
            const sandSpreaderEstimatedFinalSalvageValue = sandSpreaderInitialInvestment * ageCategories.get(sandSpreaderYearsOfUsefulLife).Misc;
            const sandSpreaderAnnualAmortization = ((sandSpreaderEstimatedCurrentSalvageValue - sandSpreaderEstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(sandSpreaderYearsOfUsefulLife - sandSpreaderEquipmentAge))) + (sandSpreaderEstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const sandSpreaderPropertyTax = sandSpreaderEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const sandSpreaderPropertyInsurance = sandSpreaderInitialInvestment * (machineryInsuranceRate / 100);
            const sandSpreaderTotalAnnualEconomicCost = (sandSpreaderAnnualAmortization + sandSpreaderPropertyTax + sandSpreaderPropertyInsurance) * (sandSpreaderDairyHoursOfUse / sandSpreaderTotalHoursOfUse);

            // 300 hp Tractor - MFWD
            const hpTractorMFWD300InitialInvestment = numberOfHpTractorMFWD300 * hpTractorMFWD300InitialInvestmentPerUnit;
            const hpTractorMFWD300EstimatedCurrentSalvageValue = hpTractorMFWD300InitialInvestment * ageCategories.get(hpTractorMFWD300EquipmentAge).Misc;
            const hpTractorMFWD300EstimatedFinalSalvageValue = hpTractorMFWD300InitialInvestment * ageCategories.get(hpTractorMFWD300YearsOfUsefulLife).Misc;
            const hpTractorMFWD300AnnualAmortization = ((hpTractorMFWD300EstimatedCurrentSalvageValue - hpTractorMFWD300EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(hpTractorMFWD300YearsOfUsefulLife - hpTractorMFWD300EquipmentAge))) + (hpTractorMFWD300EstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const hpTractorMFWD300PropertyTax = hpTractorMFWD300EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const hpTractorMFWD300PropertyInsurance = hpTractorMFWD300InitialInvestment * (machineryInsuranceRate / 100);
            const hpTractorMFWD300TotalAnnualEconomicCost = (hpTractorMFWD300AnnualAmortization + hpTractorMFWD300PropertyTax + hpTractorMFWD300PropertyInsurance) * (hpTractorMFWD300DairyHoursOfUse / hpTractorMFWD300TotalHoursOfUse);

            // 200 hp Tractor - MFWD
            const hpTractorMFWD200InitialInvestment = numberOfHpTractorMFWD200 * hpTractorMFWD200InitialInvestmentPerUnit;
            const hpTractorMFWD200EstimatedCurrentSalvageValue = hpTractorMFWD200InitialInvestment * ageCategories.get(hpTractorMFWD200EquipmentAge).Misc;
            const hpTractorMFWD200EstimatedFinalSalvageValue = hpTractorMFWD200InitialInvestment * ageCategories.get(hpTractorMFWD200YearsOfUsefulLife).Misc;
            const hpTractorMFWD200AnnualAmortization = ((hpTractorMFWD200EstimatedCurrentSalvageValue - hpTractorMFWD200EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(hpTractorMFWD200YearsOfUsefulLife - hpTractorMFWD200EquipmentAge))) + (hpTractorMFWD200EstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const hpTractorMFWD200PropertyTax = hpTractorMFWD200EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const hpTractorMFWD200PropertyInsurance = hpTractorMFWD200InitialInvestment * (machineryInsuranceRate / 100);
            const hpTractorMFWD200TotalAnnualEconomicCost = (hpTractorMFWD200AnnualAmortization + hpTractorMFWD200PropertyTax + hpTractorMFWD200PropertyInsurance) * (hpTractorMFWD200DairyHoursOfUse / hpTractorMFWD200TotalHoursOfUse);

            // 24’ Disk Harrow
            const diskHarrow24InitialInvestment = numberOfDiskHarrow24 * diskHarrow24InitialInvestmentPerUnit;
            const diskHarrow24EstimatedCurrentSalvageValue = diskHarrow24InitialInvestment * ageCategories.get(diskHarrow24EquipmentAge).Tilage;
            const diskHarrow24EstimatedFinalSalvageValue = diskHarrow24InitialInvestment * ageCategories.get(diskHarrow24YearsOfUsefulLife).Tilage;
            const diskHarrow24AnnualAmortization = ((diskHarrow24EstimatedCurrentSalvageValue - diskHarrow24EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(diskHarrow24YearsOfUsefulLife - diskHarrow24EquipmentAge))) + (diskHarrow24EstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const diskHarrow24PropertyTax = diskHarrow24EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const diskHarrow24PropertyInsurance = diskHarrow24InitialInvestment * (machineryInsuranceRate / 100);
            const diskHarrow24TotalAnnualEconomicCost = (diskHarrow24AnnualAmortization + diskHarrow24PropertyTax + diskHarrow24PropertyInsurance) * (diskHarrow24DairyHoursOfUse / diskHarrow24TotalHoursOfUse);

            // 8-row 30” Strip-Till Planter
            const stripTillPlanter8RowInitialInvestment = numberOfStripTillPlanter8Row * stripTillPlanter8RowInitialInvestmentPerUnit;
            const stripTillPlanter8RowEstimatedCurrentSalvageValue = stripTillPlanter8RowInitialInvestment * ageCategories.get(stripTillPlanter8RowEquipmentAge).Planters;
            const stripTillPlanter8RowEstimatedFinalSalvageValue = stripTillPlanter8RowInitialInvestment * ageCategories.get(stripTillPlanter8RowYearsOfUsefulLife).Planters;
            const stripTillPlanter8RowAnnualAmortization = ((stripTillPlanter8RowEstimatedCurrentSalvageValue - stripTillPlanter8RowEstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(stripTillPlanter8RowYearsOfUsefulLife - stripTillPlanter8RowEquipmentAge))) + (stripTillPlanter8RowEstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const stripTillPlanter8RowPropertyTax = stripTillPlanter8RowEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const stripTillPlanter8RowPropertyInsurance = stripTillPlanter8RowInitialInvestment * (machineryInsuranceRate / 100);
            const stripTillPlanter8RowTotalAnnualEconomicCost = (stripTillPlanter8RowAnnualAmortization + stripTillPlanter8RowPropertyTax + stripTillPlanter8RowPropertyInsurance) * (stripTillPlanter8RowDairyHoursOfUse / stripTillPlanter8RowTotalHoursOfUse);

            // 40’ Folding Sprayer
            const foldingSprayer40InitialInvestment = numberOfFoldingSprayer40 * foldingSprayer40InitialInvestmentPerUnit;
            const foldingSprayer40EstimatedCurrentSalvageValue = foldingSprayer40InitialInvestment * ageCategories.get(foldingSprayer40EquipmentAge).Misc;
            const foldingSprayer40EstimatedFinalSalvageValue = foldingSprayer40InitialInvestment * ageCategories.get(foldingSprayer40YearsOfUsefulLife).Misc;
            const foldingSprayer40AnnualAmortization = ((foldingSprayer40EstimatedCurrentSalvageValue - foldingSprayer40EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(foldingSprayer40YearsOfUsefulLife - foldingSprayer40EquipmentAge))) + (foldingSprayer40EstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const foldingSprayer40PropertyTax = foldingSprayer40EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const foldingSprayer40PropertyInsurance = foldingSprayer40InitialInvestment * (machineryInsuranceRate / 100);
            const foldingSprayer40TotalAnnualEconomicCost = (foldingSprayer40AnnualAmortization + foldingSprayer40PropertyTax + foldingSprayer40PropertyInsurance) * (foldingSprayer40DairyHoursOfUse / foldingSprayer40TotalHoursOfUse);

            // Field Cultivator
            const fieldCultivatorInitialInvestment = numberOfFieldCultivator * fieldCultivatorInitialInvestmentPerUnit;
            const fieldCultivatorEstimatedCurrentSalvageValue = fieldCultivatorInitialInvestment * ageCategories.get(fieldCultivatorEquipmentAge).HarvestingCrop;
            const fieldCultivatorEstimatedFinalSalvageValue = fieldCultivatorInitialInvestment * ageCategories.get(fieldCultivatorYearsOfUsefulLife).HarvestingCrop;
            const fieldCultivatorAnnualAmortization = 
                                (((fieldCultivatorEstimatedCurrentSalvageValue) - (fieldCultivatorEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(fieldCultivatorYearsOfUsefulLife - fieldCultivatorEquipmentAge))) +
                                ((fieldCultivatorEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const fieldCultivatorPropertyTax = fieldCultivatorEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const fieldCultivatorPropertyInsurance = fieldCultivatorInitialInvestment * (machineryInsuranceRate / 100);
            const fieldCultivatorTotalAnnualEconomicCost = (fieldCultivatorAnnualAmortization + fieldCultivatorPropertyTax + fieldCultivatorPropertyInsurance) * (fieldCultivatorDairyHoursOfUse / fieldCultivatorTotalHoursOfUse);

            //Grain Drill - 15’ No-Till
            const grainDrill15NoTillInitialInvestment = numberOfGrainDrill15NoTill * grainDrill15NoTillInitialInvestmentPerUnit;
            const grainDrill15NoTillEstimatedCurrentSalvageValue = grainDrill15NoTillInitialInvestment * ageCategories.get(grainDrill15NoTillEquipmentAge).Misc;
            const grainDrill15NoTillEstimatedFinalSalvageValue = grainDrill15NoTillInitialInvestment * ageCategories.get(grainDrill15NoTillYearsOfUsefulLife).Misc;
            const grainDrill15NoTillAnnualAmortization = 
                                (((grainDrill15NoTillEstimatedCurrentSalvageValue) - (grainDrill15NoTillEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(grainDrill15NoTillYearsOfUsefulLife - grainDrill15NoTillEquipmentAge))) +
                                ((grainDrill15NoTillEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const grainDrill15NoTillPropertyTax = grainDrill15NoTillEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const grainDrill15NoTillPropertyInsurance = grainDrill15NoTillInitialInvestment * (machineryInsuranceRate / 100);
            const grainDrill15NoTillTotalAnnualEconomicCost = (grainDrill15NoTillAnnualAmortization + grainDrill15NoTillPropertyTax + grainDrill15NoTillPropertyInsurance) * (grainDrill15NoTillDairyHoursOfUse / grainDrill15NoTillTotalHoursOfUse);

            //Mower Conditioner (Self-Propelled)
            const mowerConditionerSelfPropelledInitialInvestment = numberOfMowerConditionerSelfPropelled * mowerConditionerSelfPropelledInitialInvestmentPerUnit;
            const mowerConditionerSelfPropelledEstimatedCurrentSalvageValue = mowerConditionerSelfPropelledInitialInvestment * ageCategories.get(mowerConditionerSelfPropelledEquipmentAge).HarvestingForage;
            const mowerConditionerSelfPropelledEstimatedFinalSalvageValue = mowerConditionerSelfPropelledInitialInvestment * ageCategories.get(mowerConditionerSelfPropelledYearsOfUsefulLife).HarvestingForage;
            const mowerConditionerSelfPropelledAnnualAmortization = 
                                (((mowerConditionerSelfPropelledEstimatedCurrentSalvageValue) - (mowerConditionerSelfPropelledEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(mowerConditionerSelfPropelledYearsOfUsefulLife - mowerConditionerSelfPropelledEquipmentAge))) +
                                ((mowerConditionerSelfPropelledEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const mowerConditionerSelfPropelledPropertyTax = mowerConditionerSelfPropelledEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const mowerConditionerSelfPropelledPropertyInsurance = mowerConditionerSelfPropelledInitialInvestment * (machineryInsuranceRate / 100);
            const mowerConditionerSelfPropelledTotalAnnualEconomicCost = (mowerConditionerSelfPropelledAnnualAmortization + mowerConditionerSelfPropelledPropertyTax + mowerConditionerSelfPropelledPropertyInsurance) * (mowerConditionerSelfPropelledDairyHoursOfUse / mowerConditionerSelfPropelledTotalHoursOfUse);

            // Tedder Calculations
            const tedderInitialInvestment = numberOfTedder * tedderInitialInvestmentPerUnit;
            const tedderEstimatedCurrentSalvageValue = tedderInitialInvestment * ageCategories.get(tedderEquipmentAge).HarvestingCrop;
            const tedderEstimatedFinalSalvageValue = tedderInitialInvestment * ageCategories.get(tedderYearsOfUsefulLife).HarvestingCrop;
            const tedderAnnualAmortization = 
                                (((tedderEstimatedCurrentSalvageValue) - (tedderEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(tedderYearsOfUsefulLife - tedderEquipmentAge))) +
                                ((tedderEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const tedderPropertyTax = tedderEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const tedderPropertyInsurance = tedderInitialInvestment * (machineryInsuranceRate / 100);
            const tedderTotalAnnualEconomicCost = (tedderAnnualAmortization + tedderPropertyTax + tedderPropertyInsurance) * (tedderDairyHoursOfUse / tedderTotalHoursOfUse);

            // Power Rake Calculations
            const powerRakeInitialInvestment = numberOfPowerRake * powerRakeInitialInvestmentPerUnit;
            const powerRakeEstimatedCurrentSalvageValue = powerRakeInitialInvestment * ageCategories.get(powerRakeEquipmentAge).HarvestingCrop;
            const powerRakeEstimatedFinalSalvageValue = powerRakeInitialInvestment * ageCategories.get(powerRakeYearsOfUsefulLife).HarvestingCrop;
            const powerRakeAnnualAmortization = 
                                (((powerRakeEstimatedCurrentSalvageValue) - (powerRakeEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(powerRakeYearsOfUsefulLife - powerRakeEquipmentAge))) +
                                ((powerRakeEstimatedFinalSalvageValue) * (longTermInterestRate / 100));

            const powerRakePropertyTax = powerRakeEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const powerRakePropertyInsurance = powerRakeInitialInvestment * (machineryInsuranceRate / 100);
            const powerRakeTotalAnnualEconomicCost = (powerRakeAnnualAmortization + powerRakePropertyTax + powerRakePropertyInsurance) * (powerRakeDairyHoursOfUse / powerRakeTotalHoursOfUse);

            // 15’ Folding Rotary Mower Calculations
            const foldingRotaryMower15InitialInvestment = numberOfFoldingRotaryMower15 * foldingRotaryMower15InitialInvestmentPerUnit;
            const foldingRotaryMower15EstimatedCurrentSalvageValue = foldingRotaryMower15InitialInvestment * ageCategories.get(foldingRotaryMower15EquipmentAge).HarvestingCrop;
            const foldingRotaryMower15EstimatedFinalSalvageValue = foldingRotaryMower15InitialInvestment * ageCategories.get(foldingRotaryMower15YearsOfUsefulLife).HarvestingCrop;
            const foldingRotaryMower15AnnualAmortization = ((foldingRotaryMower15EstimatedCurrentSalvageValue - foldingRotaryMower15EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(foldingRotaryMower15YearsOfUsefulLife - foldingRotaryMower15EquipmentAge))) + (foldingRotaryMower15EstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const foldingRotaryMower15PropertyTax = foldingRotaryMower15EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const foldingRotaryMower15PropertyInsurance = foldingRotaryMower15InitialInvestment * (machineryInsuranceRate / 100);
            const foldingRotaryMower15TotalAnnualEconomicCost = (foldingRotaryMower15AnnualAmortization + foldingRotaryMower15PropertyTax + foldingRotaryMower15PropertyInsurance) * (foldingRotaryMower15DairyHoursOfUse / foldingRotaryMower15TotalHoursOfUse);

            // Deep-ripper Calculations
            const deepRipperInitialInvestment = numberOfDeepRipper * deepRipperInitialInvestmentPerUnit;
            const deepRipperEstimatedCurrentSalvageValue = deepRipperInitialInvestment * ageCategories.get(deepRipperEquipmentAge).Tilage;
            const deepRipperEstimatedFinalSalvageValue = deepRipperInitialInvestment * ageCategories.get(deepRipperYearsOfUsefulLife).Tilage;
            const deepRipperAnnualAmortization = 
                                (((deepRipperEstimatedCurrentSalvageValue) - (deepRipperEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(deepRipperYearsOfUsefulLife - deepRipperEquipmentAge))) +
                                ((deepRipperEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const deepRipperPropertyTax = deepRipperEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const deepRipperPropertyInsurance = deepRipperInitialInvestment * (machineryInsuranceRate / 100);
            const deepRipperTotalAnnualEconomicCost = (deepRipperAnnualAmortization + deepRipperPropertyTax + deepRipperPropertyInsurance) * (deepRipperDairyHoursOfUse / deepRipperTotalHoursOfUse);

            // 24’ Livestock Trailer Calculations
            const livestockTrailer24InitialInvestment = numberOfLivestockTrailer24 * livestockTrailer24InitialInvestmentPerUnit;
            const livestockTrailer24EstimatedCurrentSalvageValue = livestockTrailer24InitialInvestment * ageCategories.get(livestockTrailer24EquipmentAge).Misc;
            const livestockTrailer24EstimatedFinalSalvageValue = livestockTrailer24InitialInvestment * ageCategories.get(livestockTrailer24YearsOfUsefulLife).Misc;
            const livestockTrailer24AnnualAmortization = ((livestockTrailer24EstimatedCurrentSalvageValue - livestockTrailer24EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(livestockTrailer24YearsOfUsefulLife - livestockTrailer24EquipmentAge))) + (livestockTrailer24EstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const livestockTrailer24PropertyTax = livestockTrailer24EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const livestockTrailer24PropertyInsurance = livestockTrailer24InitialInvestment * (machineryInsuranceRate / 100);
            const livestockTrailer24TotalAnnualEconomicCost = (livestockTrailer24AnnualAmortization + livestockTrailer24PropertyTax + livestockTrailer24PropertyInsurance) * (livestockTrailer24DairyHoursOfUse / livestockTrailer24TotalHoursOfUse);

            // Round Baler Calculations
            const roundBalerInitialInvestment = numberOfRoundBaler * roundBalerInitialInvestmentPerUnit;
            const roundBalerEstimatedCurrentSalvageValue = roundBalerInitialInvestment * ageCategories.get(roundBalerEquipmentAge).HarvestingCrop;
            const roundBalerEstimatedFinalSalvageValue = roundBalerInitialInvestment * ageCategories.get(roundBalerYearsOfUsefulLife).HarvestingCrop;
            const roundBalerAnnualAmortization = 
                                (((roundBalerEstimatedCurrentSalvageValue) - (roundBalerEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(roundBalerYearsOfUsefulLife - roundBalerEquipmentAge))) +
                                ((roundBalerEstimatedFinalSalvageValue) * (longTermInterestRate / 100));

            const roundBalerPropertyTax = roundBalerEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const roundBalerPropertyInsurance = roundBalerInitialInvestment * (machineryInsuranceRate / 100);
            const roundBalerTotalAnnualEconomicCost = (roundBalerAnnualAmortization + roundBalerPropertyTax + roundBalerPropertyInsurance) * (roundBalerDairyHoursOfUse / roundBalerTotalHoursOfUse);

            // Tub Grinder Calculations
            const tubGrinderInitialInvestment = numberOfTubGrinder * tubGrinderInitialInvestmentPerUnit;
            const tubGrinderEstimatedCurrentSalvageValue = tubGrinderInitialInvestment * ageCategories.get(tubGrinderEquipmentAge).Misc;
            const tubGrinderEstimatedFinalSalvageValue = tubGrinderInitialInvestment * ageCategories.get(tubGrinderYearsOfUsefulLife).Misc;
            const tubGrinderAnnualAmortization = 
                                (((tubGrinderEstimatedCurrentSalvageValue) - (tubGrinderEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(tubGrinderYearsOfUsefulLife - tubGrinderEquipmentAge))) +
                                ((tubGrinderEstimatedFinalSalvageValue) * (longTermInterestRate / 100));

            const tubGrinderPropertyTax = tubGrinderEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const tubGrinderPropertyInsurance = tubGrinderInitialInvestment * (machineryInsuranceRate / 100);
            const tubGrinderTotalAnnualEconomicCost = (tubGrinderAnnualAmortization + tubGrinderPropertyTax + tubGrinderPropertyInsurance) * (tubGrinderDairyHoursOfUse / tubGrinderTotalHoursOfUse);

            // Miscellaneous Equipment Calculations
            const miscellaneousEquipmentInitialInvestment = numberOfMiscellaneousEquipment * miscellaneousEquipmentInitialInvestmentPerUnit;
            const miscellaneousEquipmentEstimatedCurrentSalvageValue = miscellaneousEquipmentInitialInvestment * ageCategories.get(miscellaneousEquipmentEquipmentAge).Misc;
            const miscellaneousEquipmentEstimatedFinalSalvageValue = miscellaneousEquipmentInitialInvestment * ageCategories.get(miscellaneousEquipmentYearsOfUsefulLife).Misc;
            const miscellaneousEquipmentAnnualAmortization = 
                                (((miscellaneousEquipmentEstimatedCurrentSalvageValue) - (miscellaneousEquipmentEstimatedFinalSalvageValue)) * (longTermInterestRate / 100)) /
                                (1 - Math.pow(1 + (longTermInterestRate / 100), -(miscellaneousEquipmentYearsOfUsefulLife - miscellaneousEquipmentEquipmentAge))) +
                                ((miscellaneousEquipmentEstimatedFinalSalvageValue) * (longTermInterestRate / 100));
            const miscellaneousEquipmentPropertyTax = miscellaneousEquipmentEstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const miscellaneousEquipmentPropertyInsurance = miscellaneousEquipmentInitialInvestment * (machineryInsuranceRate / 100);
            const miscellaneousEquipmentTotalAnnualEconomicCost = (miscellaneousEquipmentAnnualAmortization + miscellaneousEquipmentPropertyTax + miscellaneousEquipmentPropertyInsurance) * (miscellaneousEquipmentDairyHoursOfUse / miscellaneousEquipmentTotalHoursOfUse);

            // Other Machinery and Equipment 1
            const otherMachineryEquipment1InitialInvestment = numberOfOtherMachineryEquipment1 * otherMachineryEquipment1InitialInvestmentPerUnit;
            const otherMachineryEquipment1EstimatedCurrentSalvageValue = otherMachineryEquipment1InitialInvestment * ageCategories.get(otherMachineryEquipment1EquipmentAge).Misc;
            const otherMachineryEquipment1EstimatedFinalSalvageValue = otherMachineryEquipment1InitialInvestment * ageCategories.get(otherMachineryEquipment1YearsOfUsefulLife).Misc;
            const otherMachineryEquipment1AnnualAmortization = ((otherMachineryEquipment1EstimatedCurrentSalvageValue - otherMachineryEquipment1EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(otherMachineryEquipment1YearsOfUsefulLife - otherMachineryEquipment1EquipmentAge))) + (otherMachineryEquipment1EstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const otherMachineryEquipment1PropertyTax = otherMachineryEquipment1EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const otherMachineryEquipment1PropertyInsurance = otherMachineryEquipment1InitialInvestment * (machineryInsuranceRate / 100);
            const otherMachineryEquipment1TotalAnnualEconomicCost = (otherMachineryEquipment1AnnualAmortization + otherMachineryEquipment1PropertyTax + otherMachineryEquipment1PropertyInsurance) * (otherMachineryEquipment1DairyHoursOfUse / otherMachineryEquipment1TotalHoursOfUse);

            // Other Machinery and Equipment 2
            const otherMachineryEquipment2InitialInvestment = numberOfOtherMachineryEquipment2 * otherMachineryEquipment2InitialInvestmentPerUnit;
            const otherMachineryEquipment2EstimatedCurrentSalvageValue = otherMachineryEquipment2InitialInvestment * ageCategories.get(otherMachineryEquipment2EquipmentAge).Misc;
            const otherMachineryEquipment2EstimatedFinalSalvageValue = otherMachineryEquipment2InitialInvestment * ageCategories.get(otherMachineryEquipment2YearsOfUsefulLife).Misc;
            const otherMachineryEquipment2AnnualAmortization = ((otherMachineryEquipment2EstimatedCurrentSalvageValue - otherMachineryEquipment2EstimatedFinalSalvageValue) * (longTermInterestRate / 100)) / (1 - Math.pow(1 + (longTermInterestRate / 100), -(otherMachineryEquipment2YearsOfUsefulLife - otherMachineryEquipment2EquipmentAge))) + (otherMachineryEquipment2EstimatedFinalSalvageValue * (longTermInterestRate / 100));
            const otherMachineryEquipment2PropertyTax = otherMachineryEquipment2EstimatedCurrentSalvageValue * (propertyTaxRate / 100);
            const otherMachineryEquipment2PropertyInsurance = otherMachineryEquipment2InitialInvestment * (machineryInsuranceRate / 100);
            const otherMachineryEquipment2TotalAnnualEconomicCost = (otherMachineryEquipment2AnnualAmortization + otherMachineryEquipment2PropertyTax + otherMachineryEquipment2PropertyInsurance) * (otherMachineryEquipment2DairyHoursOfUse / otherMachineryEquipment2TotalHoursOfUse);   
        
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

                console.log('articulatedLoadersTotalAnnualEconomicCost:', articulatedLoadersTotalAnnualEconomicCost);
                console.log('skidSteerLoadersTotalAnnualEconomicCost:', skidSteerLoadersTotalAnnualEconomicCost);
                console.log('hpTractorMFWD130TotalAnnualEconomicCost:', hpTractorMFWD130TotalAnnualEconomicCost);
                console.log('hpTractor2wd75TotalAnnualEconomicCost:', hpTractor2wd75TotalAnnualEconomicCost);
                console.log('hpTractor2wd50TotalAnnualEconomicCost:', hpTractor2wd50TotalAnnualEconomicCost);
                console.log('mixerWagon650TotalAnnualEconomicCost:', mixerWagon650TotalAnnualEconomicCost);
                console.log('threeQuarterTonPickupTotalAnnualEconomicCost:', threeQuarterTonPickupTotalAnnualEconomicCost);
                console.log('halfTonPickupTotalAnnualEconomicCost:', halfTonPickupTotalAnnualEconomicCost);
                console.log('jdGatorTotalAnnualEconomicCost:', jdGatorTotalAnnualEconomicCost);
                console.log('sandSpreaderTotalAnnualEconomicCost:', sandSpreaderTotalAnnualEconomicCost);
                console.log('hpTractorMFWD300TotalAnnualEconomicCost:', hpTractorMFWD300TotalAnnualEconomicCost);
                console.log('hpTractorMFWD200TotalAnnualEconomicCost:', hpTractorMFWD200TotalAnnualEconomicCost);
                console.log('diskHarrow24TotalAnnualEconomicCost:', diskHarrow24TotalAnnualEconomicCost);
                console.log('stripTillPlanter8RowTotalAnnualEconomicCost:', stripTillPlanter8RowTotalAnnualEconomicCost);
                console.log('foldingSprayer40TotalAnnualEconomicCost:', foldingSprayer40TotalAnnualEconomicCost);
                console.log('fieldCultivatorTotalAnnualEconomicCost:', fieldCultivatorTotalAnnualEconomicCost);
                console.log('grainDrill15NoTillTotalAnnualEconomicCost:', grainDrill15NoTillTotalAnnualEconomicCost);
                console.log('mowerConditionerSelfPropelledTotalAnnualEconomicCost:', mowerConditionerSelfPropelledTotalAnnualEconomicCost);
                console.log('tedderTotalAnnualEconomicCost:', tedderTotalAnnualEconomicCost);
                console.log('powerRakeTotalAnnualEconomicCost:', powerRakeTotalAnnualEconomicCost);
                console.log('foldingRotaryMower15TotalAnnualEconomicCost:', foldingRotaryMower15TotalAnnualEconomicCost);
                console.log('deepRipperTotalAnnualEconomicCost:', deepRipperTotalAnnualEconomicCost);
                console.log('livestockTrailer24TotalAnnualEconomicCost:', livestockTrailer24TotalAnnualEconomicCost);
                console.log('roundBalerTotalAnnualEconomicCost:', roundBalerTotalAnnualEconomicCost);
                console.log('tubGrinderTotalAnnualEconomicCost:', tubGrinderTotalAnnualEconomicCost);
                console.log('miscellaneousEquipmentTotalAnnualEconomicCost:', miscellaneousEquipmentTotalAnnualEconomicCost);
                console.log('otherMachineryEquipment1TotalAnnualEconomicCost:', otherMachineryEquipment1TotalAnnualEconomicCost);
                console.log('otherMachineryEquipment2TotalAnnualEconomicCost:', otherMachineryEquipment2TotalAnnualEconomicCost);
        }
        


        // -------->>>>Outputs calculated and rounded to 2 decimal points
        const totalCattleFixedCost = cowTotalAnnualEconomicCost + bredHeiferTotalAnnualEconomicCost;
        console.log("Farm Shop and General Roads Total Annual Economic Cost:", farmShopandGeneralRoadsTotalAnnualEconomicCost);
        console.log("Milking Parlor and Equipment Total Annual Economic Cost:", milkingParlorandEquipmentTotalAnnualEconomicCost);
        console.log("Feeding Equipment Total Annual Economic Cost:", feedingEquipmentTotalAnnualEconomicCost);
        console.log("Freestall Housing and Lanes Total Annual Economic Cost:", freestallHousingandLanesTotalAnnualEconomicCost);
        console.log("Three-Phase Power Supply Total Annual Economic Cost:", threePhasePowerSupplyTotalAnnualEconomicCost);
        console.log("Water System Total Annual Economic Cost:", waterSystemTotalAnnualEconomicCost);
        console.log("Hay Shed Total Annual Economic Cost:", hayShedTotalAnnualEconomicCost);
        console.log("Trench Silos Total Annual Economic Cost:", trenchSilosTotalAnnualEconomicCost);
        console.log("Fences Total Annual Economic Cost:", fencesTotalAnnualEconomicCost);
        console.log("Commodity Barn Total Annual Economic Cost:", commodityBarnTotalAnnualEconomicCost);
        console.log("Calf or Heifer Barn Total Annual Economic Cost:", calfOrHeiferBarnTotalAnnualEconomicCost);
        console.log("Tilt Table Total Annual Economic Cost:", tiltTableTotalAnnualEconomicCost);
        console.log("Cattle Handling Facilities Total Annual Economic Cost:", cattleHandlingFacilitiesTotalAnnualEconomicCost);
        console.log("Other Facilities and Buildings 1 Total Annual Economic Cost:", otherFacilitiesAndBuildings1TotalAnnualEconomicCost);
        console.log("Other Facilities and Buildings 2 Total Annual Economic Cost:", otherFacilitiesAndBuildings2TotalAnnualEconomicCost);

        const totalFacilitiesAndBuildingsFixedCost = 
                        farmShopandGeneralRoadsTotalAnnualEconomicCost +
                        milkingParlorandEquipmentTotalAnnualEconomicCost +
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
        
        //
        console.log("totalCattleFixedCost ",totalCattleFixedCost);
        console.log("totalFacilitiesAndBuildingsFixedCost ",totalFacilitiesAndBuildingsFixedCost);
        console.log("totalWasteManagementSystemsFixedCost ",totalWasteManagementSystemsFixedCost);
        console.log("totalMachineryFixedCost ",totalMachineryFixedCost);
        console.log("totalLandFixedCost ",totalLandFixedCost);
        console.log("overheadCost ",overheadCost);
        //

        const totalDairyFixedCost = 
                totalCattleFixedCost +
                totalFacilitiesAndBuildingsFixedCost +
                totalWasteManagementSystemsFixedCost +
                totalMachineryFixedCost +
                totalLandFixedCost +
                overheadCost;
                  
        // Convert to document object
        const updatedOutputDocument = {
            totalCattleFixedCost: Math.round(totalCattleFixedCost * 100) / 100,
            totalFacilitiesAndBuildingsFixedCost: Math.round(totalFacilitiesAndBuildingsFixedCost * 100) / 100,
            totalWasteManagementSystemsFixedCost: Math.round(totalWasteManagementSystemsFixedCost * 100) / 100,
            totalMachineryFixedCost: Math.round(totalMachineryFixedCost * 100) / 100,
            totalLandFixedCost: Math.round(totalLandFixedCost * 100) / 100,
            overheadCost: Math.round(overheadCost * 100) / 100,
            totalDairyFixedCost: Math.round(totalDairyFixedCost * 100) / 100
        };
        
      
        try {
          const result = await this.fixedCostsOutputModel.findOneAndUpdate(
            { userId },
            { $set: updatedOutputDocument },
            { new: true, upsert: true }
          );
      
          this.logger.log(`Successfully calculated and updated fixed costs output for user: ${userId}`);
          return result;
        } catch (error) {
          this.logger.error(`Failed to calculate fixed costs output: ${error.message}`);
          throw new Error(`Failed to calculate fixed costs output: ${error.message}`);
        }
    }

    async getFixedCostsOutput(email: string): Promise<FixedCostsOutput|null>{
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        console.log('userId ', userId);

        const outputDocument = await this.fixedCostsOutputModel.findOne({userId}).exec();
        console.log("outputDocument ",outputDocument);
        

        if(!outputDocument){
            throw new HttpException('Output record for this user not found', HttpStatus.NOT_FOUND)
        }

        return outputDocument;
    }
    
    async getFixedCostsInput(email:string): Promise<FixedCostsInput | null>{
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        console.log('userId ', userId);

        const inputDocument = this.fixedCostsInputModel.findOne({userId}).exec();

        if(!inputDocument){
            throw new HttpException('Input record for this user not found', HttpStatus.NOT_FOUND)
        }

        return inputDocument;
    }
}