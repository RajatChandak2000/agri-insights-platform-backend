import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GHGOutput, HerdTotalDMI } from "../schemas/outputs/ghg-output.schema";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { ManureManagementInput } from "../schemas/inputs/ManureManagementInput.schema";
import { ManureManagementInputDto } from "../dto/manure-management.dto";
import { FeedDetailsInput } from "../schemas/inputs/FeedDetailsInput.schema";
import { FeedDetailsOutput } from "../schemas/outputs/FeedDetailsOutput.schema";
import { User } from "src/user/schemas/user.schema";
import { ManureManagementOutput } from "../schemas/outputs/ManureManagementOutput.schema";

@Injectable()
export class ManureManagementService {
    private readonly logger = new Logger(ManureManagementService.name);

    private readonly feedNutritionMap = new Map([
        ["CornSilage", { CP: 6.90, P: 0.17, K: 1.03, DM: 32.50, DE: 69.10, Ash: 3.70 }],
        ["SorghumSilage", { CP: 6.70, P: 0.30, K: 2.04, DM: 28.40, DE: 60.30, Ash: 8.80 }],
        ["SmallGrainSilage", { CP: 11.70, P: 0.39, K: 0.58, DM: 87.10, DE: 85.40, Ash: 2.10 }],
        ["GrassHay", { CP: 10.20, P: 0.22, K: 1.57, DM: 91.50, DE: 53.50, Ash: 8.30 }],
        ["AlfalfaHay", { CP: 18.20, P: 0.27, K: 2.56, DM: 89.40, DE: 58.40, Ash: 10.70 }],
        ["PeanutHulls", { CP: 7.00, P: 0.07, K: 0.69, DM: 91.60, DE: 17.30, Ash: 5.20 }],
        ["ApplePomaceNoHulls", { CP: 8.00, P: 0.14, K: 0.19, DM: 91.20, DE: 53.70, Ash: 2.10 }],
        ["DistillersGrainWet", { CP: 29.50, P: 0.79, K: 1.03, DM: 89.00, DE: 83.50, Ash: 5.40 }],
        ["BrewersGrainWet", { CP: 25.80, P: 0.57, K: 0.29, DM: 91.00, DE: 63.20, Ash: 4.60 }],
        ["CitrusPulpDry", { CP: 7.00, P: 0.10, K: 0.94, DM: 90.30, DE: 82.50, Ash: 6.90 }],
        ["CornGlutenFeed", { CP: 21.70, P: 1.02, K: 1.54, DM: 88.30, DE: 80.4, Ash: 6.90 }],
        ["WholeCottonseed", { CP: 21.80, P: 0.59, K: 1.20, DM: 92.30, DE: 64.00, Ash: 4.40 }],
        ["CottonseedHulls", { CP: 5.10, P: 0.10, K: 0.71, DM: 90.60, DE: 41.10, Ash: 2.90 }],
        ["SoybeanMeal48", { CP: 52.60, P: 0.71, K: 2.38, DM: 88.00, DE: 90.70, Ash: 7.10 }],
    ]);

    private readonly manureManagementMap = new Map([
        ["DailySpread", { MCF: 0.1, EF3: 0.0, fracGas: 7, fracLeach: 10 }],
        ["SolidStorage", { MCF: 2, EF3: 0.5, fracGas: 30, fracLeach: 10 }],
        ["DryLot", { MCF: 1, EF3: 2.0, fracGas: 20, fracLeach: 10 }],
        ["LiquidSlurryNaturalCrust", { MCF: 10, EF3: 0.5, fracGas: 8, fracLeach: 10 }],
        ["LiquidSlurryNoCrust", { MCF: 17, EF3: 0.0, fracGas: 40, fracLeach: 10 }],
        ["UncoveredAnaerobicLagoon", { MCF: 66, EF3: 0.0, fracGas: 35, fracLeach: 10 }],
        ["CoveredAnaerobicLagoon", { MCF: 53, EF3: 0.0, fracGas: 28, fracLeach: 10 }],
        ["AnaerobicDigestion", { MCF: 18.1, EF3: 0.0, fracGas: 43, fracLeach: 0.8 }],
        ["PitStorageBelowAnimal1m", { MCF: 3, EF3: 0.2, fracGas: 28, fracLeach: 10 }],
        ["PitStorageBelowAnimalGreater1m", { MCF: 17, EF3: 0.2, fracGas: 28, fracLeach: 10 }],
        ["DeepBeddingLess1Month", { MCF: 3, EF3: 1.0, fracGas: 20, fracLeach: 10 }],
        ["DeepBeddingMore1Month", { MCF: 17, EF3: 7.0, fracGas: 30, fracLeach: 10 }],
        ["CompostingVesselStatic", { MCF: 0.5, EF3: 0.6, fracGas: 40, fracLeach: 10 }],
        ["CompostingIntensiveWindrow", { MCF: 0.5, EF3: 10.0, fracGas: 40, fracLeach: 10 }],
        ["CompostingNaturalAeration", { MCF: 0.5, EF3: 1.0, fracGas: 40, fracLeach: 10 }],
        ["AerobicTreatmentForcedAeration", { MCF: 0.0, EF3: 0.5, fracGas: 40, fracLeach: 10 }],
        ["AerobicTreatmentNaturalAeration", { MCF: 0.0, EF3: 1.0, fracGas: 40, fracLeach: 10 }],
        ["NA", { MCF: 0.0, EF3: 0.0, fracGas: 0.0, fracLeach: 0.0 }]
    ]);
    

    constructor(
        @InjectModel(ManureManagementInput.name) private manureManagementInputModel: Model<ManureManagementInput>,
        @InjectModel(ManureManagementOutput.name) private manureManagementOutputModel: Model<ManureManagementOutput>,
        @InjectModel(GHGOutput.name) private ghgOutputModel: Model<GHGOutput>,
        @InjectModel(ProductionDetailsOutput.name) private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
        @InjectModel(FeedDetailsInput.name) private feedDetailsInputModel: Model<FeedDetailsInput>,
        @InjectModel(FeedDetailsOutput.name) private feedDetailsOutputModel: Model<FeedDetailsOutput>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async updateInput(email: string, updateDto: ManureManagementInputDto) {
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
    
        // Only update fields that are defined
        for (const [key, value] of Object.entries(updateDto)) {
          if (value !== undefined) {
            updateData[key] = value;
          }
        }
    
        try {
          const updatedDocument = await this.manureManagementInputModel.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true, upsert: true },
          );
    
          if (!updatedDocument) {
            this.logger.warn(`User not found: ${userId}`);
            throw new Error('User not found');
          }
    
          this.logger.log(`Successfully updated inputs for user: ${userId}`);
    
          // Recalculate Manure Management metrics and update ManureMangementOutput
          return await this.calculateManureManagement(userId, updatedDocument);
        } catch (error) {
          this.logger.error(`Failed to update user inputs: ${error.message}`);
          throw new Error(`Failed to update user inputs: ${error.message}`);
        }
    }

    private getFeedKey(feedType: string): string {
        const feedMap: Record<string, string> = {
            cornSilage: 'CornSilage',
            sorghumSilage: 'SorghumSilage',
            smallGrain: 'SmallGrainSilage',
            grassHay: 'GrassHay',
            alfalfa: 'AlfalfaHay',
            peanutHulls: 'PeanutHulls',
            applePomace: 'ApplePomaceNoHulls',
            distillers: 'DistillersGrainWet',
            brewers: 'BrewersGrainWet',
            citrusPulp: 'CitrusPulpDry',
            cornGluten: 'CornGlutenFeed',
            wholeCottonseed: 'WholeCottonseed',
            cottonseedHulls: 'CottonseedHulls',
            soybean48: 'SoybeanMeal48',
        };

        return feedMap[feedType] || feedType; // Default fallback
    }

    calculateVSProduction(
        category: string,
        dmiValues: Record<string, number>,
        numberOfCowsOnFeed: number,
        manureRecoverablePercent: number
    ) {
        const volatileSolids: Record<string, number> = {};

        Object.keys(dmiValues).forEach(feedType => {
            const feedKeyClean = feedType.replace(/DMI$/, '');
            const mappedFeedType = this.getFeedKey(feedKeyClean);
            
            const feedData = this.feedNutritionMap.get(mappedFeedType);
            
            if (feedData) {
                const camelCaseKey = `${category.toLowerCase()}Vs${mappedFeedType}`;

                // volatileSolids[camelCaseKey] =
                //     (1 - (feedData.DE / 100) + 0.04) * (1 - (feedData.Ash / 100)) * (dmiValues[feedType] || 0) *
                //     numberOfCowsOnFeed;

                volatileSolids[camelCaseKey] =
                    (1 - (feedData.DE / 100) + 0.04) * (1 - (feedData.Ash / 100)) * (dmiValues[feedType] || 0);
            }
        }); 

        const totalVS = Object.values(volatileSolids).reduce((sum, val) => sum + val, 0);
        const totalRecoverableVS = totalVS * manureRecoverablePercent;
        const totalNonRecoverableVS = totalVS * (1 - manureRecoverablePercent);

        return {
            volatileSolids,
            [`${category.toLowerCase()}TotalVs`]: totalVS,
            [`${category.toLowerCase()}TotalRecoverableVs`]: totalRecoverableVS,
            [`${category.toLowerCase()}TotalPastureNonrecoverableVs`]: totalNonRecoverableVS
        };
    }

    calculateNIntakeAndExcretion(
        category: string,
        dmiValues: Record<string, number>,
        numberOfCowsOnFeed: number,
        manureRecoverablePercent: number
    ) {
        const nitrogenIntake: Record<string, number> = {};
    
        Object.keys(dmiValues).forEach(feedType => {
            const feedKeyClean = feedType.replace(/DMI$/, '');
            const mappedFeedType = this.getFeedKey(feedKeyClean);
            const feedData = this.feedNutritionMap.get(mappedFeedType);
            if (feedData) {
                const camelCaseKey = `${category.toLowerCase()}NIntake${mappedFeedType}`;
    
                // nitrogenIntake[camelCaseKey] =
                //     (dmiValues[feedType] || 0) *
                //     (feedData.CP / 6.25) *
                //     numberOfCowsOnFeed;

                nitrogenIntake[camelCaseKey] = (dmiValues[feedType] || 0) * ((feedData.CP/100) / 6.25);
            }
        });
    
        const totalNIntake = Object.values(nitrogenIntake).reduce((sum, val) => sum + val, 0);
        const totalNExcreted = totalNIntake * (1 - 0.20); // 20% Retention Rate
        const totalNExcretedRecoverable = totalNExcreted * manureRecoverablePercent;
        const totalNExcretedNonRecoverable = totalNExcreted * (1 - manureRecoverablePercent);
    
        return {
            nitrogenIntake,
            [`${category.toLowerCase()}TotalNIntake`]: totalNIntake,
            [`${category.toLowerCase()}TotalNExcreted`]: totalNExcreted,
            [`${category.toLowerCase()}TotalNExcretedRecoverable`]: totalNExcretedRecoverable,
            [`${category.toLowerCase()}TotalNExcretedNonRecoverable`]: totalNExcretedNonRecoverable
        };
    }    

    async calculateManureManagement(
        userId: string,
        updatedDocument: ManureManagementInput
    ) {
        this.logger.log(
            `Calculating manure management output for user: ${updatedDocument['userId'] || 'non-authenticated'}`,
        );

        const ghgModelOutputs = await this.ghgOutputModel.findOne({ userId }).exec();
        const productionDetailsOutputs = await this.productionDetailsOutputModel.findOne({ userId }).exec();

        if (!ghgModelOutputs || !ghgModelOutputs.herdTotalDMI) {
            throw new Error("GHG Model Outputs or herdTotalDMI not found.");
        }

        //Fetch the Herd DMI group from GHG Model and get all individual Herd DMI valies
        const lactatingDmiValues = JSON.parse(JSON.stringify(ghgModelOutputs.herdDMIGroup.milkingHerd));
        const dryDmiValues = JSON.parse(JSON.stringify(ghgModelOutputs.herdDMIGroup.dryHerd));
        const bredHeifersDmiValues = JSON.parse(JSON.stringify(ghgModelOutputs.herdDMIGroup.bredHeifers));
        const youngHeifersDmiValues = JSON.parse(JSON.stringify(ghgModelOutputs.herdDMIGroup.youngHeifers));

        const numberOfLactationsPerYear = productionDetailsOutputs.numberOfLactationsPerYear;
        const lactatingNumberOfCowsOnFeed = Math.round(numberOfLactationsPerYear);
        const dryNumberOfCowsOnFeed = Math.round(numberOfLactationsPerYear);

        // Compute Volatile Solids
        const lactatingVS = this.calculateVSProduction("Lactating", lactatingDmiValues, lactatingNumberOfCowsOnFeed, updatedDocument.percentLactatingManureRecoverable / 100);
        const dryVS = this.calculateVSProduction("Dry", dryDmiValues, dryNumberOfCowsOnFeed, updatedDocument.percentDryManureRecoverable / 100);
        const bredHeiferVS = this.calculateVSProduction("BredHeifer", bredHeifersDmiValues, dryNumberOfCowsOnFeed, updatedDocument.percentBredManureRecoverable / 100);
        const youngHeiferVS = this.calculateVSProduction("YoungHeifer", youngHeifersDmiValues, dryNumberOfCowsOnFeed, updatedDocument.percentYoungManureRecoverable / 100);

        // Compute Nitrogen Intake & Excretion
        const lactatingN = this.calculateNIntakeAndExcretion("Lactating", lactatingDmiValues, lactatingNumberOfCowsOnFeed, updatedDocument.percentLactatingManureRecoverable / 100);
        const dryN = this.calculateNIntakeAndExcretion("Dry", dryDmiValues, dryNumberOfCowsOnFeed, updatedDocument.percentDryManureRecoverable / 100);
        const bredHeiferN = this.calculateNIntakeAndExcretion("BredHeifer", bredHeifersDmiValues, dryNumberOfCowsOnFeed, updatedDocument.percentBredManureRecoverable / 100);
        const youngHeiferN = this.calculateNIntakeAndExcretion("YoungHeifer", youngHeifersDmiValues, dryNumberOfCowsOnFeed, updatedDocument.percentYoungManureRecoverable / 100);
        
        // Calculate Herd Total VS
        const herdTotalRecoverableVs =
            (lactatingVS["lactatingTotalRecoverableVs"] as number) +
            (dryVS["dryTotalRecoverableVs"] as number) +
            (bredHeiferVS["bredheiferTotalRecoverableVs"] as number) +
            (youngHeiferVS["youngheiferTotalRecoverableVs"] as number);
        
        const herdTotalPastureNonrecoverableVs =
            (lactatingVS["lactatingTotalPastureNonrecoverableVs"] as number) +
            (dryVS["dryTotalPastureNonrecoverableVs"] as number) +
            (bredHeiferVS["bredheiferTotalPastureNonrecoverableVs"] as number) +
            (youngHeiferVS["youngheiferTotalPastureNonrecoverableVs"] as number);

        // Compute Herd Total Nitrogen Excretion
        const herdTotalRecoverableNExcreted =
            (lactatingN["lactatingTotalNExcretedRecoverable"] as number) +
            (dryN["dryTotalNExcretedRecoverable"] as number) +
            (bredHeiferN["bredheiferTotalNExcretedRecoverable"] as number) +
            (youngHeiferN["youngheiferTotalNExcretedRecoverable"] as number);

        const herdTotalPastureNonrecoverableNExcreted =
            (lactatingN["lactatingTotalNExcretedNonRecoverable"] as number) +
            (dryN["dryTotalNExcretedNonRecoverable"] as number) +
            (bredHeiferN["bredheiferTotalNExcretedNonRecoverable"] as number) +
            (youngHeiferN["youngheiferTotalNExcretedNonRecoverable"] as number);

        //Extract the manure dropdown selections and percentages from them and form an array
        const manureSelections = [
            { system: updatedDocument.manureManagementSystem1, percentage: updatedDocument.percentOfManureMMS1 },
            { system: updatedDocument.manureManagementSystem2, percentage: updatedDocument.percentOfManureMMS2 },
            { system: updatedDocument.manureManagementSystem3, percentage: updatedDocument.percentOfManureMMS3 },
            { system: updatedDocument.manureManagementSystem4, percentage: updatedDocument.percentOfManureMMS4 }
        ].filter(selection => selection.system && selection.percentage >= 0); // Ensure valid selections    

        const emissions = this.calculateEmissions(
            manureSelections,  // Passed from user selection
            herdTotalRecoverableVs,
            herdTotalPastureNonrecoverableVs,
            herdTotalRecoverableNExcreted,
            herdTotalPastureNonrecoverableNExcreted,
            ghgModelOutputs.annualFPCM
        );      
        
        // Build the update data to match the output schema
        const updateData = {
            userId,
            methaneEmissions: {
              ch4EmissionsMMS1: Number(emissions.ch4Emissions["ch4EmissionsMms1"].toFixed(2)),
              ch4EmissionsMMS2: Number(emissions.ch4Emissions["ch4EmissionsMms2"].toFixed(2)),
              ch4EmissionsMMS3: Number(emissions.ch4Emissions["ch4EmissionsMms3"].toFixed(2)),
              ch4EmissionsMMS4: Number(emissions.ch4Emissions["ch4EmissionsMms4"].toFixed(2)),
              ch4EmissionsPastureNonrecoverable: Number(emissions.ch4EmissionsPastureNonrecoverable.toFixed(2)),
              ch4TotalEmissions: Number(emissions.ch4TotalEmissions.toFixed(2))
            },
            nitrousOxideEmissions: {
              n2oDirectEmissionsMMS1: Number(emissions.n2oDirectEmissions["n2oDirectEmissionsMms1"].toFixed(2)),
              n2oDirectEmissionsMMS2: Number(emissions.n2oDirectEmissions["n2oDirectEmissionsMms2"].toFixed(2)),
              n2oDirectEmissionsMMS3: Number(emissions.n2oDirectEmissions["n2oDirectEmissionsMms3"].toFixed(2)),
              n2oDirectEmissionsMMS4: Number(emissions.n2oDirectEmissions["n2oDirectEmissionsMms4"].toFixed(2)),
              n2oDirectEmissionsPastureNonrecoverable: Number(emissions.n2oDirectEmissionsPastureNonrecoverable.toFixed(2)),
              n2oIndirectVolatileEmissionsMMS1: Number(emissions.n2oIndirectVolatileEmissions["n2oIndirectVolatileEmissionsMms1"].toFixed(2)),
              n2oIndirectVolatileEmissionsMMS2: Number(emissions.n2oIndirectVolatileEmissions["n2oIndirectVolatileEmissionsMms2"].toFixed(2)),
              n2oIndirectVolatileEmissionsMMS3: Number(emissions.n2oIndirectVolatileEmissions["n2oIndirectVolatileEmissionsMms3"].toFixed(2)),
              n2oIndirectVolatileEmissionsMMS4: Number(emissions.n2oIndirectVolatileEmissions["n2oIndirectVolatileEmissionsMms4"].toFixed(2)),
              n2oIndirectVolatileEmissionsPastureNonrecoverable: Number(emissions.n2oIndirectVolatileEmissionsPastureNonrecoverable.toFixed(2)),
              n2oIndirectLeachEmissionsMMS1: Number(emissions.n2oIndirectLeachEmissions["n2oIndirectLeachEmissionsMms1"].toFixed(2)),
              n2oIndirectLeachEmissionsMMS2: Number(emissions.n2oIndirectLeachEmissions["n2oIndirectLeachEmissionsMms2"].toFixed(2)),
              n2oIndirectLeachEmissionsMMS3: Number(emissions.n2oIndirectLeachEmissions["n2oIndirectLeachEmissionsMms3"].toFixed(2)),
              n2oIndirectLeachEmissionsMMS4: Number(emissions.n2oIndirectLeachEmissions["n2oIndirectLeachEmissionsMms4"].toFixed(2)),
              n2oIndirectLeachEmissionsPastureNonrecoverable: Number(emissions.n2oIndirectLeachEmissionsPastureNonrecoverable.toFixed(2)),
              n2oTotalEmissions: Number(emissions.n2oTotalEmissions.toFixed(2))
            },
            manureManagementFootprint: {
              totalCO2eFromCH4: Number(emissions.totalCo2eFromCh4.toFixed(2)),
              totalCO2eFromN2O: Number(emissions.totalCo2eFromN2o.toFixed(2)),
              totalCO2eFromManureManagement: Number(emissions.totalCo2eFromManureManagement.toFixed(2)),
              footprintFromCH4: Number(emissions.footprintFromCh4.toFixed(2)),
              footprintFromN2O: Number(emissions.footprintFromN2o.toFixed(2)),
              footprintFromMMS: Number(emissions.footprintFromMms.toFixed(2))
            }
        };

        // Options for findOneAndUpdate
        const options = {
            new: true,               // Return the updated document
            upsert: true,            // Create if not found
            setDefaultsOnInsert: true // Apply default schema values
        };

        try {
            const result = await this.manureManagementOutputModel
            .findOneAndUpdate({ userId }, { $set: updateData }, options)
            .exec();
            this.logger.log(`Successfully updated manure management output for user: ${userId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to update manure management output: ${error.message}`);
            throw new Error(`Failed to update manure management output: ${error.message}`);
        }
            
        return {
            lactatingVS,
            dryVS,
            bredHeiferVS,
            youngHeiferVS,
            herdTotalRecoverableVs,
            herdTotalPastureNonrecoverableVs,
            lactatingN,
            dryN,
            bredHeiferN,
            youngHeiferN,
            herdTotalRecoverableNExcreted,
            herdTotalPastureNonrecoverableNExcreted,
            emissions
        };
    }

    calculateEmissions(
        manureSelections: { system: string; percentage: number }[],
        herdTotalRecoverableVs: number,
        herdTotalPastureNonrecoverableVs: number,
        herdTotalRecoverableNExcreted: number,
        herdTotalPastureNonrecoverableNExcreted: number,
        annualFpcm: number
    ) {
        const globalWarmingPotentialCH4 = 25;
        const ch4Density = 0.0418267;
        const methaneProductionCapacity = 3.84443;
        const globalWarmingPotentialN2O = 298;
    
        let ch4Emissions: Record<string, number> = {};
        let n2oDirectEmissions: Record<string, number> = {};
        let n2oIndirectVolatileEmissions: Record<string, number> = {};
        let n2oIndirectLeachEmissions: Record<string, number> = {};
    
        // Compute CH4 & N2O for each selected MMS
        manureSelections.forEach((selection, index) => {
            const mmsData = this.manureManagementMap.get(selection.system);
            if (!mmsData) return;
    
            const ch4Key = `ch4EmissionsMms${index + 1}`;
            console.log("herdTotalRecoverableVs ..... ", herdTotalRecoverableVs);
            console.log("methaneProductionCapacity ..... ", methaneProductionCapacity);
            console.log("ch4Density ..... ", ch4Density);
            console.log("mmsData.MCF/100 ..... ", mmsData.MCF/100);
            console.log("selection.percentage / 100 ..... ", selection.percentage / 100);
            
            
            ch4Emissions[ch4Key] =
                herdTotalRecoverableVs * methaneProductionCapacity * ch4Density * (mmsData.MCF/100) * (selection.percentage / 100);
    
            const n2oDirectKey = `n2oDirectEmissionsMms${index + 1}`;
            n2oDirectEmissions[n2oDirectKey] =
                herdTotalRecoverableNExcreted *
                (mmsData.EF3/100) *
                (selection.percentage / 100) *
                (44 / 28);
    
            const n2oIndirectVolatileKey = `n2oIndirectVolatileEmissionsMms${index + 1}`;
            n2oIndirectVolatileEmissions[n2oIndirectVolatileKey] =
                herdTotalRecoverableNExcreted *
                (mmsData.fracGas/100) *
                (selection.percentage / 100) *
                0.01 *
                (44 / 28);
    
            const n2oIndirectLeachKey = `n2oIndirectLeachEmissionsMms${index + 1}`;
            n2oIndirectLeachEmissions[n2oIndirectLeachKey] =
                herdTotalRecoverableNExcreted *
                (mmsData.fracLeach/100) *
                (selection.percentage / 100) *
                0.0075 *
                (44 / 28);
        });
    
        // CH4 & N2O from Pasture/Nonrecoverable
        const ch4EmissionsPastureNonrecoverable =
            herdTotalPastureNonrecoverableVs * methaneProductionCapacity * ch4Density * 0.01;
    
        const n2oDirectEmissionsPastureNonrecoverable =
            herdTotalPastureNonrecoverableNExcreted * 0.02 * (44 / 28);
    
        const n2oIndirectVolatileEmissionsPastureNonrecoverable =
            herdTotalPastureNonrecoverableNExcreted * 0.07 * 0.01 * (44 / 28);
    
        const n2oIndirectLeachEmissionsPastureNonrecoverable =
            herdTotalPastureNonrecoverableNExcreted * 0.01 * 0.0075 * (44 / 28);
    
        // Total CH4 & N2O
        const ch4TotalEmissions =
            Object.values(ch4Emissions).reduce((sum, val) => sum + val, 0) +
            ch4EmissionsPastureNonrecoverable;
    
        const n2oTotalEmissions =
            Object.values(n2oDirectEmissions).reduce((sum, val) => sum + val, 0) +
            Object.values(n2oIndirectVolatileEmissions).reduce((sum, val) => sum + val, 0) +
            Object.values(n2oIndirectLeachEmissions).reduce((sum, val) => sum + val, 0) +
            n2oDirectEmissionsPastureNonrecoverable +
            n2oIndirectVolatileEmissionsPastureNonrecoverable +
            n2oIndirectLeachEmissionsPastureNonrecoverable;
    
        // Total CO2 Equivalents
        const totalCo2eFromCh4 = ch4TotalEmissions * globalWarmingPotentialCH4;
        const totalCo2eFromN2o = n2oTotalEmissions * globalWarmingPotentialN2O;
        const totalCo2eFromManureManagement = totalCo2eFromCh4 + totalCo2eFromN2o;
    
        // Carbon Footprint Metrics
        const footprintFromCh4 = totalCo2eFromCh4 / annualFpcm;
        const footprintFromN2o = totalCo2eFromN2o / annualFpcm;
        const footprintFromMms = totalCo2eFromManureManagement / annualFpcm;
    
        return {
            ch4Emissions,
            ch4EmissionsPastureNonrecoverable,
            ch4TotalEmissions,
            n2oDirectEmissions,
            n2oIndirectVolatileEmissions,
            n2oIndirectLeachEmissions,
            n2oDirectEmissionsPastureNonrecoverable,
            n2oIndirectVolatileEmissionsPastureNonrecoverable,
            n2oIndirectLeachEmissionsPastureNonrecoverable,
            n2oTotalEmissions,
            totalCo2eFromCh4,
            totalCo2eFromN2o,
            totalCo2eFromManureManagement,
            footprintFromCh4,
            footprintFromN2o,
            footprintFromMms
        };
    }

    async getManureManagementInput(email: string): Promise<ManureManagementInput | null> {
        console.log("Called manure management input");
        
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
          throw new HttpException(
            'User with this email does not exist',
            HttpStatus.NOT_FOUND,
          );
        }
    
        const userId = user._id.toString();
        const inputDocument = this.manureManagementInputModel.findOne({ userId }).exec();
    
        if (!inputDocument) {
          throw new HttpException(
            'Input record for this user not found',
            HttpStatus.NOT_FOUND,
          );
        }
    
        return inputDocument;
    }

    async getManureManagementOutput(email: string): Promise<ManureManagementOutput | null> {
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
          throw new HttpException(
            'User with this email does not exist',
            HttpStatus.NOT_FOUND,
          );
        }
    
        const userId = user._id.toString();
    
        const outputDocument = await this.manureManagementOutputModel
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
    
}