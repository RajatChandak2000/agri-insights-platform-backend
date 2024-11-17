import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FeedDetailsInput } from "../schemas/inputs/FeedDetailsInput.schema";
import { Model } from "mongoose";
import { FeedDetailsOutput } from "../schemas/outputs/FeedDetailsOutput.schema";
import { User } from "src/user/schemas/user.schema";
import { FeedDetailsInputDto } from "../dto/feed-details-input.dto";
import { ProductionDetailsInput } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";

@Injectable()
export class FeedDetailsService{
    private readonly logger = new Logger(FeedDetailsService.name);

    constructor(
        @InjectModel(FeedDetailsInput.name) private feedDetailsInputModel: Model<FeedDetailsInput>,
        @InjectModel(FeedDetailsOutput.name) private feedDetailsOutputModel: Model<FeedDetailsOutput>,
        @InjectModel(ProductionDetailsInput.name) private productionDetailsInputModel: Model<ProductionDetailsInput>,
        @InjectModel(ProductionDetailsOutput.name) private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
        @InjectModel(User.name) private userModel: Model<User>
    ){}

    async updateInput(email: string, updateDto: FeedDetailsInputDto) {
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        console.log("updateDto ", updateDto);
        
        const userId = user._id.toString();
        this.logger.log(`Updating inputs for user: ${userId}`);
        const updateData: any = {};

        // Handling Milking Herd Inputs
        if (updateDto.milkingHerd) {
            for (const [key, value] of Object.entries(updateDto.milkingHerd)) {
                if (value !== undefined) {
                    updateData[`milkingHerd.${key}`] = value;
                }
            }
            this.logger.log(`Milking Herd Data: ${JSON.stringify(updateDto.milkingHerd)}`);
        }

        // Handling Dry Herd Inputs
        if (updateDto.dryHerd) {
            for (const [key, value] of Object.entries(updateDto.dryHerd)) {
                if (value !== undefined) {
                    updateData[`dryHerd.${key}`] = value;
                }
            }
            this.logger.log(`Dry Herd Data: ${JSON.stringify(updateDto.dryHerd)}`);
        }

        // Handling Bred Heifers Inputs
        if (updateDto.bredHeifers) {
            for (const [key, value] of Object.entries(updateDto.bredHeifers)) {
                if (value !== undefined) {
                    updateData[`bredHeifers.${key}`] = value;
                }
            }
            this.logger.log(`Bred Heifers Data: ${JSON.stringify(updateDto.bredHeifers)}`);
        }

        // Handling Young Heifers Inputs
        if (updateDto.youngHeifers) {
            for (const [key, value] of Object.entries(updateDto.youngHeifers)) {
                if (value !== undefined) {
                    updateData[`youngHeifers.${key}`] = value;
                }
            }
            this.logger.log(`Young Heifers Data: ${JSON.stringify(updateDto.youngHeifers)}`);
        }

        // Handling Calves Inputs
        if (updateDto.calves) {
            for (const [key, value] of Object.entries(updateDto.calves)) {
                if (value !== undefined) {
                    updateData[`calves.${key}`] = value;
                }
            }
            this.logger.log(`Calves Data: ${JSON.stringify(updateDto.calves)}`);
        }

        //Handling Corn Silage Inputs
        if (updateDto.cornSilage) {
            for (const [key, value] of Object.entries(updateDto.cornSilage)) {
                if (value !== undefined) {
                    updateData[`cornSilage.${key}`] = value;
                }
            }
            this.logger.log(`Corn Silage Data: ${JSON.stringify(updateDto.cornSilage)}`);
        }

        //Handling Sorghum Silage Inputs
        if (updateDto.sorghumSilage) {
            for (const [key, value] of Object.entries(updateDto.sorghumSilage)) {
                if (value !== undefined) {
                    updateData[`sorghumSilage.${key}`] = value;
                }
            }
            this.logger.log(`Sorghum Silage Data: ${JSON.stringify(updateDto.sorghumSilage)}`);
        }

        //Handling SmallGrain Silage Inputs
        if (updateDto.smallGrainSilage) {
            for (const [key, value] of Object.entries(updateDto.smallGrainSilage)) {
                if (value !== undefined) {
                    updateData[`smallGrainSilage.${key}`] = value;
                }
            }
            this.logger.log(`SmallGrain Silage Data: ${JSON.stringify(updateDto.smallGrainSilage)}`);
        }

        //Handling Grass Hay Inputs
        if (updateDto.grassHay) {
            for (const [key, value] of Object.entries(updateDto.grassHay)) {
                if (value !== undefined) {
                    updateData[`grassHay.${key}`] = value;
                }
            }
            this.logger.log(`Corn Silage Data: ${JSON.stringify(updateDto.grassHay)}`);
        }
        
        //Handling Alfalfa Hay Establishment Inputs
        if (updateDto.alfalfaHayEstablishment) {
            for (const [key, value] of Object.entries(updateDto.alfalfaHayEstablishment)) {
                if (value !== undefined) {
                    updateData[`alfalfaHayEstablishment.${key}`] = value;
                }
            }
            this.logger.log(`Alfalfa Hay Establishment Data: ${JSON.stringify(updateDto.alfalfaHayEstablishment)}`);
        }

        //Handling Alfalfa Hay Stand Inputs
        if (updateDto.alfalfaHayStand) {
            for (const [key, value] of Object.entries(updateDto.alfalfaHayStand)) {
                if (value !== undefined) {
                    updateData[`alfalfaHayStand.${key}`] = value;
                }
            }
            this.logger.log(`Alfalfa Hay Stand Data: ${JSON.stringify(updateDto.alfalfaHayStand)}`);
        }

        //Handling Alfalfa Hay Shrink Loss Inputs
        if (updateDto.alfalfaHayShrinkLoss) {
            for (const [key, value] of Object.entries(updateDto.alfalfaHayShrinkLoss)) {
                if (value !== undefined) {
                    updateData[`alfalfaHayShrinkLoss.${key}`] = value;
                }
            }
            this.logger.log(`Alfalfa Hay Shrink Loss Data: ${JSON.stringify(updateDto.alfalfaHayShrinkLoss)}`);
        }

        console.log("updateData ", updateData);
        
        this.logger.log(`Update data received: ${JSON.stringify(updateData)}`);

        try {
            const updatedDocument = await this.feedDetailsInputModel.findOneAndUpdate(
                { userId },
                { $set: updateData },
                { new: true, upsert: true }
            );

            if (!updatedDocument) {
                this.logger.warn(`User not found: ${userId}`);
                throw new Error('User not found');
            }

            this.logger.log(`Successfully updated inputs for user: ${userId}`);

            //If successful, we need to call another service that calculates the output
            //and updates the output schema accordingly
            
            return await this.calculateFeedDetailsOutput(userId, updatedDocument);
            
        } catch (error) {
            this.logger.error(`Failed to update user inputs: ${error.message}`);
            throw new Error(`Failed to update user inputs: ${error.message}`);
        }
    }

    async calculateFeedDetailsOutput(userId: string, updatedDocument: FeedDetailsInput) {
        this.logger.log(`Calculating feed detail output for user: ${updatedDocument['userId'] || 'non-authenticated'}`);
        
        //Get any other required documents from other tables
        const productionDetailsInputs = await this.productionDetailsInputModel.findOne({userId}).exec();
        const productionDetailsOutputs = await this.productionDetailsOutputModel.findOne({userId}).exec();

        // ---->Temp variables required to calculate the outputs
        const numberOfHeifersRaised = productionDetailsInputs.heiferProduction.numberOfHeifersRaised;
        const numberOfLactationsPerYear = productionDetailsOutputs.numberOfLactationsPerYear;
        const numberOfMilkingCowsOnFeed = numberOfLactationsPerYear;
        const numberOfDryCowsOnFeed = numberOfLactationsPerYear;
        const numberOfBredHeifersCowsOnFeed = numberOfHeifersRaised;
        const numberOfYoungHeifersCowsOnFeed = numberOfHeifersRaised;

        // ----> Feed Details Input variables required to calculate the outputs
        
        // Milking Herd inputs
        const milkingHerdCornSilageLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdCornSilageLbsAsFedPerDay;
        const milkingHerdCornSilageDaysOnFeed = updatedDocument.milkingHerd.milkingHerdCornSilageDaysOnFeed;
        const milkingHerdSorghumSilageLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdSorghumSilageLbsAsFedPerDay;
        const milkingHerdSorghumSilageDaysOnFeed = updatedDocument.milkingHerd.milkingHerdSorghumSilageDaysOnFeed;
        const milkingHerdSmallGrainSilageLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdSmallGrainSilageLbsAsFedPerDay;
        const milkingHerdSmallGrainSilageDaysOnFeed = updatedDocument.milkingHerd.milkingHerdSmallGrainSilageDaysOnFeed;
        const milkingHerdGrassHayLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdGrassHayLbsAsFedPerDay;
        const milkingHerdGrassHayDaysOnFeed = updatedDocument.milkingHerd.milkingHerdGrassHayDaysOnFeed;
        const milkingHerdAlfalfaHayLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdAlfalfaHayLbsAsFedPerDay;
        const milkingHerdAlfalfaHayDaysOnFeed = updatedDocument.milkingHerd.milkingHerdAlfalfaHayDaysOnFeed;
        const milkingHerdPeanutHullsLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdPeanutHullsLbsAsFedPerDay;
        const milkingHerdPeanutHullsDaysOnFeed = updatedDocument.milkingHerd.milkingHerdPeanutHullsDaysOnFeed;
        const milkingHerdApplePomaceNoHullsLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdApplePomaceNoHullsLbsAsFedPerDay;
        const milkingHerdApplePomaceNoHullsDaysOnFeed = updatedDocument.milkingHerd.milkingHerdApplePomaceNoHullsDaysOnFeed;
        const milkingHerdDistillersGrainWetLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdDistillersGrainWetLbsAsFedPerDay;
        const milkingHerdDistillersGrainWetDaysOnFeed = updatedDocument.milkingHerd.milkingHerdDistillersGrainWetDaysOnFeed;
        const milkingHerdBrewersGrainWetLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdBrewersGrainWetLbsAsFedPerDay;
        const milkingHerdBrewersGrainWetDaysOnFeed = updatedDocument.milkingHerd.milkingHerdBrewersGrainWetDaysOnFeed;
        const milkingHerdCitrusPulpDryLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdCitrusPulpDryLbsAsFedPerDay;
        const milkingHerdCitrusPulpDryDaysOnFeed = updatedDocument.milkingHerd.milkingHerdCitrusPulpDryDaysOnFeed;
        const milkingHerdCornGlutenFeedLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdCornGlutenFeedLbsAsFedPerDay;
        const milkingHerdCornGlutenFeedDaysOnFeed = updatedDocument.milkingHerd.milkingHerdCornGlutenFeedDaysOnFeed;
        const milkingHerdWholeCottonseedLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdWholeCottonseedLbsAsFedPerDay;
        const milkingHerdWholeCottonseedDaysOnFeed = updatedDocument.milkingHerd.milkingHerdWholeCottonseedDaysOnFeed;
        const milkingHerdCottonseedHullsLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdCottonseedHullsLbsAsFedPerDay;
        const milkingHerdCottonseedHullsDaysOnFeed = updatedDocument.milkingHerd.milkingHerdCottonseedHullsDaysOnFeed;
        const milkingHerdSoybeanMeal48LbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdSoybeanMeal48LbsAsFedPerDay;
        const milkingHerdSoybeanMeal48DaysOnFeed = updatedDocument.milkingHerd.milkingHerdSoybeanMeal48DaysOnFeed;
        const milkingHerdCustomFeedMixLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdCustomFeedMixLbsAsFedPerDay;
        const milkingHerdCustomFeedMixDaysOnFeed = updatedDocument.milkingHerd.milkingHerdCustomFeedMixDaysOnFeed;
        const milkingHerdCustomMineralMixLbsAsFedPerDay = updatedDocument.milkingHerd.milkingHerdCustomMineralMixLbsAsFedPerDay;
        const milkingHerdCustomMineralMixDaysOnFeed = updatedDocument.milkingHerd.milkingHerdCustomMineralMixDaysOnFeed;

        // Dry Herd inputs
        const dryHerdCornSilageLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdCornSilageLbsAsFedPerDay;
        const dryHerdCornSilageDaysOnFeed = updatedDocument.dryHerd.dryHerdCornSilageDaysOnFeed;
        const dryHerdSorghumSilageLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdSorghumSilageLbsAsFedPerDay;
        const dryHerdSorghumSilageDaysOnFeed = updatedDocument.dryHerd.dryHerdSorghumSilageDaysOnFeed;
        const dryHerdSmallGrainSilageLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdSmallGrainSilageLbsAsFedPerDay;
        const dryHerdSmallGrainSilageDaysOnFeed = updatedDocument.dryHerd.dryHerdSmallGrainSilageDaysOnFeed;
        const dryHerdGrassHayLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdGrassHayLbsAsFedPerDay;
        const dryHerdGrassHayDaysOnFeed = updatedDocument.dryHerd.dryHerdGrassHayDaysOnFeed;
        const dryHerdAlfalfaHayLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdAlfalfaHayLbsAsFedPerDay;
        const dryHerdAlfalfaHayDaysOnFeed = updatedDocument.dryHerd.dryHerdAlfalfaHayDaysOnFeed;
        const dryHerdPeanutHullsLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdPeanutHullsLbsAsFedPerDay;
        const dryHerdPeanutHullsDaysOnFeed = updatedDocument.dryHerd.dryHerdPeanutHullsDaysOnFeed;
        const dryHerdApplePomaceNoHullsLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdApplePomaceNoHullsLbsAsFedPerDay;
        const dryHerdApplePomaceNoHullsDaysOnFeed = updatedDocument.dryHerd.dryHerdApplePomaceNoHullsDaysOnFeed;
        const dryHerdDistillersGrainWetLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdDistillersGrainWetLbsAsFedPerDay;
        const dryHerdDistillersGrainWetDaysOnFeed = updatedDocument.dryHerd.dryHerdDistillersGrainWetDaysOnFeed;
        const dryHerdBrewersGrainWetLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdBrewersGrainWetLbsAsFedPerDay;
        const dryHerdBrewersGrainWetDaysOnFeed = updatedDocument.dryHerd.dryHerdBrewersGrainWetDaysOnFeed;
        const dryHerdCitrusPulpDryLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdCitrusPulpDryLbsAsFedPerDay;
        const dryHerdCitrusPulpDryDaysOnFeed = updatedDocument.dryHerd.dryHerdCitrusPulpDryDaysOnFeed;
        const dryHerdCornGlutenFeedLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdCornGlutenFeedLbsAsFedPerDay;
        const dryHerdCornGlutenFeedDaysOnFeed = updatedDocument.dryHerd.dryHerdCornGlutenFeedDaysOnFeed;
        const dryHerdWholeCottonseedLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdWholeCottonseedLbsAsFedPerDay;
        const dryHerdWholeCottonseedDaysOnFeed = updatedDocument.dryHerd.dryHerdWholeCottonseedDaysOnFeed;
        const dryHerdCottonseedHullsLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdCottonseedHullsLbsAsFedPerDay;
        const dryHerdCottonseedHullsDaysOnFeed = updatedDocument.dryHerd.dryHerdCottonseedHullsDaysOnFeed;
        const dryHerdSoybeanMeal48LbsAsFedPerDay = updatedDocument.dryHerd.dryHerdSoybeanMeal48LbsAsFedPerDay;
        const dryHerdSoybeanMeal48DaysOnFeed = updatedDocument.dryHerd.dryHerdSoybeanMeal48DaysOnFeed;
        const dryHerdCustomFeedMixLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdCustomFeedMixLbsAsFedPerDay;
        const dryHerdCustomFeedMixDaysOnFeed = updatedDocument.dryHerd.dryHerdCustomFeedMixDaysOnFeed;
        const dryHerdCustomMineralMixLbsAsFedPerDay = updatedDocument.dryHerd.dryHerdCustomMineralMixLbsAsFedPerDay;
        const dryHerdCustomMineralMixDaysOnFeed = updatedDocument.dryHerd.dryHerdCustomMineralMixDaysOnFeed;

        // Bred Heifers inputs
        const bredHeifersCornSilageLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersCornSilageLbsAsFedPerDay;
        const bredHeifersCornSilageDaysOnFeed = updatedDocument.bredHeifers.bredHeifersCornSilageDaysOnFeed;
        const bredHeifersSorghumSilageLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersSorghumSilageLbsAsFedPerDay;
        const bredHeifersSorghumSilageDaysOnFeed = updatedDocument.bredHeifers.bredHeifersSorghumSilageDaysOnFeed;
        const bredHeifersSmallGrainSilageLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersSmallGrainSilageLbsAsFedPerDay;
        const bredHeifersSmallGrainSilageDaysOnFeed = updatedDocument.bredHeifers.bredHeifersSmallGrainSilageDaysOnFeed;
        const bredHeifersGrassHayLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersGrassHayLbsAsFedPerDay;
        const bredHeifersGrassHayDaysOnFeed = updatedDocument.bredHeifers.bredHeifersGrassHayDaysOnFeed;
        const bredHeifersAlfalfaHayLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersAlfalfaHayLbsAsFedPerDay;
        const bredHeifersAlfalfaHayDaysOnFeed = updatedDocument.bredHeifers.bredHeifersAlfalfaHayDaysOnFeed;
        const bredHeifersPeanutHullsLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersPeanutHullsLbsAsFedPerDay;
        const bredHeifersPeanutHullsDaysOnFeed = updatedDocument.bredHeifers.bredHeifersPeanutHullsDaysOnFeed;
        const bredHeifersApplePomaceNoHullsLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersApplePomaceNoHullsLbsAsFedPerDay;
        const bredHeifersApplePomaceNoHullsDaysOnFeed = updatedDocument.bredHeifers.bredHeifersApplePomaceNoHullsDaysOnFeed;
        const bredHeifersDistillersGrainWetLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersDistillersGrainWetLbsAsFedPerDay;
        const bredHeifersDistillersGrainWetDaysOnFeed = updatedDocument.bredHeifers.bredHeifersDistillersGrainWetDaysOnFeed;
        const bredHeifersBrewersGrainWetLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersBrewersGrainWetLbsAsFedPerDay;
        const bredHeifersBrewersGrainWetDaysOnFeed = updatedDocument.bredHeifers.bredHeifersBrewersGrainWetDaysOnFeed;
        const bredHeifersCitrusPulpDryLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersCitrusPulpDryLbsAsFedPerDay;
        const bredHeifersCitrusPulpDryDaysOnFeed = updatedDocument.bredHeifers.bredHeifersCitrusPulpDryDaysOnFeed;
        const bredHeifersCornGlutenFeedLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersCornGlutenFeedLbsAsFedPerDay;
        const bredHeifersCornGlutenFeedDaysOnFeed = updatedDocument.bredHeifers.bredHeifersCornGlutenFeedDaysOnFeed;
        const bredHeifersWholeCottonseedLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersWholeCottonseedLbsAsFedPerDay;
        const bredHeifersWholeCottonseedDaysOnFeed = updatedDocument.bredHeifers.bredHeifersWholeCottonseedDaysOnFeed;
        const bredHeifersCottonseedHullsLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersCottonseedHullsLbsAsFedPerDay;
        const bredHeifersCottonseedHullsDaysOnFeed = updatedDocument.bredHeifers.bredHeifersCottonseedHullsDaysOnFeed;
        const bredHeifersSoybeanMeal48LbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersSoybeanMeal48LbsAsFedPerDay;
        const bredHeifersSoybeanMeal48DaysOnFeed = updatedDocument.bredHeifers.bredHeifersSoybeanMeal48DaysOnFeed;
        const bredHeifersCustomFeedMixLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersCustomFeedMixLbsAsFedPerDay;
        const bredHeifersCustomFeedMixDaysOnFeed = updatedDocument.bredHeifers.bredHeifersCustomFeedMixDaysOnFeed;
        const bredHeifersCustomMineralMixLbsAsFedPerDay = updatedDocument.bredHeifers.bredHeifersCustomMineralMixLbsAsFedPerDay;
        const bredHeifersCustomMineralMixDaysOnFeed = updatedDocument.bredHeifers.bredHeifersCustomMineralMixDaysOnFeed;

        // Young Heifers inputs
        const youngHeifersCornSilageLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersCornSilageLbsAsFedPerDay;
        const youngHeifersCornSilageDaysOnFeed = updatedDocument.youngHeifers.youngHeifersCornSilageDaysOnFeed;
        const youngHeifersSorghumSilageLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersSorghumSilageLbsAsFedPerDay;
        const youngHeifersSorghumSilageDaysOnFeed = updatedDocument.youngHeifers.youngHeifersSorghumSilageDaysOnFeed;
        const youngHeifersSmallGrainSilageLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersSmallGrainSilageLbsAsFedPerDay;
        const youngHeifersSmallGrainSilageDaysOnFeed = updatedDocument.youngHeifers.youngHeifersSmallGrainSilageDaysOnFeed;
        const youngHeifersGrassHayLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersGrassHayLbsAsFedPerDay;
        const youngHeifersGrassHayDaysOnFeed = updatedDocument.youngHeifers.youngHeifersGrassHayDaysOnFeed;
        const youngHeifersAlfalfaHayLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersAlfalfaHayLbsAsFedPerDay;
        const youngHeifersAlfalfaHayDaysOnFeed = updatedDocument.youngHeifers.youngHeifersAlfalfaHayDaysOnFeed;
        const youngHeifersPeanutHullsLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersPeanutHullsLbsAsFedPerDay;
        const youngHeifersPeanutHullsDaysOnFeed = updatedDocument.youngHeifers.youngHeifersPeanutHullsDaysOnFeed;
        const youngHeifersApplePomaceNoHullsLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersApplePomaceNoHullsLbsAsFedPerDay;
        const youngHeifersApplePomaceNoHullsDaysOnFeed = updatedDocument.youngHeifers.youngHeifersApplePomaceNoHullsDaysOnFeed;
        const youngHeifersDistillersGrainWetLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersDistillersGrainWetLbsAsFedPerDay;
        const youngHeifersDistillersGrainWetDaysOnFeed = updatedDocument.youngHeifers.youngHeifersDistillersGrainWetDaysOnFeed;
        const youngHeifersBrewersGrainWetLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersBrewersGrainWetLbsAsFedPerDay;
        const youngHeifersBrewersGrainWetDaysOnFeed = updatedDocument.youngHeifers.youngHeifersBrewersGrainWetDaysOnFeed;
        const youngHeifersCitrusPulpDryLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersCitrusPulpDryLbsAsFedPerDay;
        const youngHeifersCitrusPulpDryDaysOnFeed = updatedDocument.youngHeifers.youngHeifersCitrusPulpDryDaysOnFeed;
        const youngHeifersCornGlutenFeedLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersCornGlutenFeedLbsAsFedPerDay;
        const youngHeifersCornGlutenFeedDaysOnFeed = updatedDocument.youngHeifers.youngHeifersCornGlutenFeedDaysOnFeed;
        const youngHeifersWholeCottonseedLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersWholeCottonseedLbsAsFedPerDay;
        const youngHeifersWholeCottonseedDaysOnFeed = updatedDocument.youngHeifers.youngHeifersWholeCottonseedDaysOnFeed;
        const youngHeifersCottonseedHullsLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersCottonseedHullsLbsAsFedPerDay;
        const youngHeifersCottonseedHullsDaysOnFeed = updatedDocument.youngHeifers.youngHeifersCottonseedHullsDaysOnFeed;
        const youngHeifersSoybeanMeal48LbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersSoybeanMeal48LbsAsFedPerDay;
        const youngHeifersSoybeanMeal48DaysOnFeed = updatedDocument.youngHeifers.youngHeifersSoybeanMeal48DaysOnFeed;
        const youngHeifersCustomFeedMixLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersCustomFeedMixLbsAsFedPerDay;
        const youngHeifersCustomFeedMixDaysOnFeed = updatedDocument.youngHeifers.youngHeifersCustomFeedMixDaysOnFeed;
        const youngHeifersCustomMineralMixLbsAsFedPerDay = updatedDocument.youngHeifers.youngHeifersCustomMineralMixLbsAsFedPerDay;
        const youngHeifersCustomMineralMixDaysOnFeed = updatedDocument.youngHeifers.youngHeifersCustomMineralMixDaysOnFeed;

        // Calves inputs
        const calvesMilkReplacerLbsAsFedPerDay = updatedDocument.calves.calvesMilkReplacerLbsAsFedPerDay;
        const calvesMilkReplacerDaysOnFeed = updatedDocument.calves.calvesMilkReplacerDaysOnFeed;
        const calvesRaisedMilkUsedForCalvesLbsAsFedPerDay = updatedDocument.calves.calvesRaisedMilkUsedForCalvesLbsAsFedPerDay;
        const calvesRaisedMilkUsedForCalvesDaysOnFeed = updatedDocument.calves.calvesRaisedMilkUsedForCalvesDaysOnFeed;
        const calvesCalfStarterFeedLbsAsFedPerDay = updatedDocument.calves.calvesCalfStarterFeedLbsAsFedPerDay;
        const calvesCalfStarterFeedDaysOnFeed = updatedDocument.calves.calvesCalfStarterFeedDaysOnFeed;

        // ----> Raised Forage inputs required to calculate the outputs
        const cornSilageYieldTonPerAcre = updatedDocument.cornSilage.cornSilageExpectedYieldTonsPerAcre;
        const cornSilageAcres = updatedDocument.cornSilage.cornSilageHarvestedAcres;
        const cornSilageShrinkLossPercentage = updatedDocument.cornSilage.cornSilageShrinkLossPercentage;

        // Sorghum Silage
        const sorghumSilageYieldTonPerAcre = updatedDocument.sorghumSilage.sorghumSilageExpectedYieldTonsPerAcre;
        const sorghumSilageAcres = updatedDocument.sorghumSilage.sorghumSilageHarvestedAcres;
        const sorghumSilageShrinkLossPercentage = updatedDocument.sorghumSilage.sorghumSilageShrinkLossPercentage;

        // Small Grain Silage
        const smallGrainSilageYieldTonPerAcre = updatedDocument.smallGrainSilage.smallGrainSilageExpectedYieldTonsPerAcre;
        const smallGrainSilageAcres = updatedDocument.smallGrainSilage.smallGrainSilageHarvestedAcres;
        const smallGrainSilageShrinkLossPercentage = updatedDocument.smallGrainSilage.smallGrainSilageShrinkLossPercentage;

        // Grass Hay
        const grassHayYieldTonPerAcre = updatedDocument.grassHay.grassHayExpectedYieldTonsPerAcre;
        const grassHayAcres = updatedDocument.grassHay.grassHayHarvestedAcres;
        const grassHayShrinkLossPercentage = updatedDocument.grassHay.grassHayShrinkLossPercentage;

        // Alfalfa Hay Establishment
        const alfalfaHayEstablishmentYieldTonPerAcre = updatedDocument.alfalfaHayEstablishment.alfalfaHayEstablishmentExpectedYieldTonsPerAcre;
        const alfalfaHayEstablishmentAcres = updatedDocument.alfalfaHayEstablishment.alfalfaHayEstablishmentHarvestedAcres;

        // Alfalfa Hay Stand
        const alfalfaHayStandYieldTonPerAcre = updatedDocument.alfalfaHayStand.alfalfaHayStandExpectedYieldTonsPerAcre;
        const alfalfaHayStandAcres = updatedDocument.alfalfaHayStand.alfalfaHayStandHarvestedAcres;
        const alfalfaHayShrinkLossPercentage = updatedDocument.alfalfaHayShrinkLoss.alfalfaHayShrinkLossPercentage;

        // ----> Calculating the outputs here
        const cornSilageTonsRequired = 
                    (milkingHerdCornSilageLbsAsFedPerDay * milkingHerdCornSilageDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdCornSilageLbsAsFedPerDay * dryHerdCornSilageDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersCornSilageLbsAsFedPerDay * bredHeifersCornSilageDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersCornSilageLbsAsFedPerDay * youngHeifersCornSilageDaysOnFeed * numberOfYoungHeifersCowsOnFeed);
        const cornSilageTonsProduced = cornSilageYieldTonPerAcre * cornSilageAcres;
        const cornSilageBalanceToBePurchasedOrSold = cornSilageTonsProduced - (cornSilageTonsProduced * (1 - (cornSilageShrinkLossPercentage / 100)));
      
        // Sorghum Silage Calculations
        const sorghumSilageTonsRequired = 
                    (milkingHerdSorghumSilageLbsAsFedPerDay * milkingHerdSorghumSilageDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdSorghumSilageLbsAsFedPerDay * dryHerdSorghumSilageDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersSorghumSilageLbsAsFedPerDay * bredHeifersSorghumSilageDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersSorghumSilageLbsAsFedPerDay * youngHeifersSorghumSilageDaysOnFeed * numberOfYoungHeifersCowsOnFeed);
        const sorghumSilageTonsProduced = sorghumSilageYieldTonPerAcre * sorghumSilageAcres;
        const sorghumSilageBalanceToBePurchasedOrSold = sorghumSilageTonsProduced - (sorghumSilageTonsRequired * (1 - (sorghumSilageShrinkLossPercentage / 100)));

        // Small Grain Silage Calculations
        const smallGrainSilageTonsRequired = 
                    (milkingHerdSmallGrainSilageLbsAsFedPerDay * milkingHerdSmallGrainSilageDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdSmallGrainSilageLbsAsFedPerDay * dryHerdSmallGrainSilageDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersSmallGrainSilageLbsAsFedPerDay * bredHeifersSmallGrainSilageDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersSmallGrainSilageLbsAsFedPerDay * youngHeifersSmallGrainSilageDaysOnFeed * numberOfYoungHeifersCowsOnFeed);
        const smallGrainSilageTonsProduced = smallGrainSilageYieldTonPerAcre * smallGrainSilageAcres;
        const smallGrainSilageBalanceToBePurchasedOrSold = smallGrainSilageTonsProduced - (smallGrainSilageTonsRequired * (1 - (smallGrainSilageShrinkLossPercentage / 100)));
        
        // Grass Hay Calculations
        const grassHayTonsRequired = 
                    (milkingHerdGrassHayLbsAsFedPerDay * milkingHerdGrassHayDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdGrassHayLbsAsFedPerDay * dryHerdGrassHayDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersGrassHayLbsAsFedPerDay * bredHeifersGrassHayDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersGrassHayLbsAsFedPerDay * youngHeifersGrassHayDaysOnFeed * numberOfYoungHeifersCowsOnFeed);
        const grassHayTonsProduced = grassHayYieldTonPerAcre * grassHayAcres;
        const grassHayBalanceToBePurchasedOrSold = grassHayTonsProduced - (grassHayTonsRequired * (1 - (grassHayShrinkLossPercentage / 100)));

        // Alfalfa Hay Calculations
        const alfalfaHayTonsRequired = 
                    (milkingHerdAlfalfaHayLbsAsFedPerDay * milkingHerdAlfalfaHayDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdAlfalfaHayLbsAsFedPerDay * dryHerdAlfalfaHayDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersAlfalfaHayLbsAsFedPerDay * bredHeifersAlfalfaHayDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersAlfalfaHayLbsAsFedPerDay * youngHeifersAlfalfaHayDaysOnFeed * numberOfYoungHeifersCowsOnFeed);
        const alfalfaHayTonsProduced = (alfalfaHayEstablishmentYieldTonPerAcre * alfalfaHayEstablishmentAcres) + (alfalfaHayStandYieldTonPerAcre * alfalfaHayStandAcres);
        const alfalfaHayBalanceToBePurchasedOrSold = alfalfaHayTonsProduced - (alfalfaHayTonsRequired * (1 - (alfalfaHayShrinkLossPercentage / 100)));

        // Peanut Hulls Calculations
        const peanutHullsTonsRequired = 
                    (milkingHerdPeanutHullsLbsAsFedPerDay * milkingHerdPeanutHullsDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdPeanutHullsLbsAsFedPerDay * dryHerdPeanutHullsDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersPeanutHullsLbsAsFedPerDay * bredHeifersPeanutHullsDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersPeanutHullsLbsAsFedPerDay * youngHeifersPeanutHullsDaysOnFeed * numberOfYoungHeifersCowsOnFeed);

        // Apple Pomace Calculations
        const applePomaceTonsRequired = 
                    (milkingHerdApplePomaceNoHullsLbsAsFedPerDay * milkingHerdApplePomaceNoHullsDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdApplePomaceNoHullsLbsAsFedPerDay * dryHerdApplePomaceNoHullsDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersApplePomaceNoHullsLbsAsFedPerDay * bredHeifersApplePomaceNoHullsDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersApplePomaceNoHullsLbsAsFedPerDay * youngHeifersApplePomaceNoHullsDaysOnFeed * numberOfYoungHeifersCowsOnFeed);
        
        // Distiller's Grain Calculations
        const distillersGrainTonsRequired = 
                    (milkingHerdDistillersGrainWetLbsAsFedPerDay * milkingHerdDistillersGrainWetDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdDistillersGrainWetLbsAsFedPerDay * dryHerdDistillersGrainWetDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersDistillersGrainWetLbsAsFedPerDay * bredHeifersDistillersGrainWetDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersDistillersGrainWetLbsAsFedPerDay * youngHeifersDistillersGrainWetDaysOnFeed * numberOfYoungHeifersCowsOnFeed);

        // Brewer's Grain Calculations
        const brewersGrainTonsRequired = 
                    (milkingHerdBrewersGrainWetLbsAsFedPerDay * milkingHerdBrewersGrainWetDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdBrewersGrainWetLbsAsFedPerDay * dryHerdBrewersGrainWetDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersBrewersGrainWetLbsAsFedPerDay * bredHeifersBrewersGrainWetDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersBrewersGrainWetLbsAsFedPerDay * youngHeifersBrewersGrainWetDaysOnFeed * numberOfYoungHeifersCowsOnFeed);

        // Citrus Pulp Calculations
        const citrusPulpTonsRequired = 
                    (milkingHerdCitrusPulpDryLbsAsFedPerDay * milkingHerdCitrusPulpDryDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdCitrusPulpDryLbsAsFedPerDay * dryHerdCitrusPulpDryDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersCitrusPulpDryLbsAsFedPerDay * bredHeifersCitrusPulpDryDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersCitrusPulpDryLbsAsFedPerDay * youngHeifersCitrusPulpDryDaysOnFeed * numberOfYoungHeifersCowsOnFeed);

        // Corn Gluten Calculations
        const cornGlutenTonsRequired = 
                    (milkingHerdCornGlutenFeedLbsAsFedPerDay * milkingHerdCornGlutenFeedDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdCornGlutenFeedLbsAsFedPerDay * dryHerdCornGlutenFeedDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersCornGlutenFeedLbsAsFedPerDay * bredHeifersCornGlutenFeedDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersCornGlutenFeedLbsAsFedPerDay * youngHeifersCornGlutenFeedDaysOnFeed * numberOfYoungHeifersCowsOnFeed);

        // Whole Cottonseed Calculations
        const wholeCottonseedTonsRequired = 
                    (milkingHerdWholeCottonseedLbsAsFedPerDay * milkingHerdWholeCottonseedDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdWholeCottonseedLbsAsFedPerDay * dryHerdWholeCottonseedDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersWholeCottonseedLbsAsFedPerDay * bredHeifersWholeCottonseedDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersWholeCottonseedLbsAsFedPerDay * youngHeifersWholeCottonseedDaysOnFeed * numberOfYoungHeifersCowsOnFeed);

        // Soybean Meal 48 Calculations
        const soybeanMeal48TonsRequired = 
                    (milkingHerdSoybeanMeal48LbsAsFedPerDay * milkingHerdSoybeanMeal48DaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdSoybeanMeal48LbsAsFedPerDay * dryHerdSoybeanMeal48DaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersSoybeanMeal48LbsAsFedPerDay * bredHeifersSoybeanMeal48DaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersSoybeanMeal48LbsAsFedPerDay * youngHeifersSoybeanMeal48DaysOnFeed * numberOfYoungHeifersCowsOnFeed);

        // Custom Feed Mix Calculations
        const customFeedMixTonsRequired = 
                    (milkingHerdCustomFeedMixLbsAsFedPerDay * milkingHerdCustomFeedMixDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdCustomFeedMixLbsAsFedPerDay * dryHerdCustomFeedMixDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersCustomFeedMixLbsAsFedPerDay * bredHeifersCustomFeedMixDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersCustomFeedMixLbsAsFedPerDay * youngHeifersCustomFeedMixDaysOnFeed * numberOfYoungHeifersCowsOnFeed);

        // Custom Mineral Mix Calculations
        const customMineralMixTonsRequired = 
                    (milkingHerdCustomMineralMixLbsAsFedPerDay * milkingHerdCustomMineralMixDaysOnFeed * numberOfMilkingCowsOnFeed) +
                    (dryHerdCustomMineralMixLbsAsFedPerDay * dryHerdCustomMineralMixDaysOnFeed * numberOfDryCowsOnFeed) +
                    (bredHeifersCustomMineralMixLbsAsFedPerDay * bredHeifersCustomMineralMixDaysOnFeed * numberOfBredHeifersCowsOnFeed) +
                    (youngHeifersCustomMineralMixLbsAsFedPerDay * youngHeifersCustomMineralMixDaysOnFeed * numberOfYoungHeifersCowsOnFeed);
        
        
        // Outputs calculated and rounded to 2 decimal points
        // Outputs calculated and rounded to 2 decimal points
        const updatedOutputDocument = {
            cornSilageTonsRequired: cornSilageTonsRequired.toFixed(2),
            cornSilageTonsProduced: cornSilageTonsProduced.toFixed(2),
            cornSilageBalanceToBePurchasedOrSold: cornSilageBalanceToBePurchasedOrSold.toFixed(2),

            sorghumSilageTonsRequired: sorghumSilageTonsRequired.toFixed(2),
            sorghumSilageTonsProduced: sorghumSilageTonsProduced.toFixed(2),
            sorghumSilageBalanceToBePurchasedOrSold: sorghumSilageBalanceToBePurchasedOrSold.toFixed(2),

            smallGrainSilageTonsRequired: smallGrainSilageTonsRequired.toFixed(2),
            smallGrainSilageTonsProduced: smallGrainSilageTonsProduced.toFixed(2),
            smallGrainSilageBalanceToBePurchasedOrSold: smallGrainSilageBalanceToBePurchasedOrSold.toFixed(2),

            grassHayTonsRequired: grassHayTonsRequired.toFixed(2),
            grassHayTonsProduced: grassHayTonsProduced.toFixed(2),
            grassHayBalanceToBePurchasedOrSold: grassHayBalanceToBePurchasedOrSold.toFixed(2),

            alfalfaHayTonsRequired: alfalfaHayTonsRequired.toFixed(2),
            alfalfaHayTonsProduced: alfalfaHayTonsProduced.toFixed(2),
            alfalfaHayBalanceToBePurchasedOrSold: alfalfaHayBalanceToBePurchasedOrSold.toFixed(2),

            peanutHullsTonsRequired: peanutHullsTonsRequired.toFixed(2),

            applePomaceTonsRequired: applePomaceTonsRequired.toFixed(2),

            distillersGrainTonsRequired: distillersGrainTonsRequired.toFixed(2),

            brewersGrainTonsRequired: brewersGrainTonsRequired.toFixed(2),

            citrusPulpTonsRequired: citrusPulpTonsRequired.toFixed(2),

            cornGlutenTonsRequired: cornGlutenTonsRequired.toFixed(2),

            wholeCottonseedTonsRequired: wholeCottonseedTonsRequired.toFixed(2),

            soybeanMeal48TonsRequired: soybeanMeal48TonsRequired.toFixed(2),

            customFeedMixTonsRequired: customFeedMixTonsRequired.toFixed(2),

            customMineralMixTonsRequired: customMineralMixTonsRequired.toFixed(2),
        };
      
        try {
            const result = await this.feedDetailsOutputModel.findOneAndUpdate(
              { userId },
              { $set: updatedOutputDocument },
              { new: true, upsert: true }
            );
        
            this.logger.log(`Successfully calculated and updated feed details output for user: ${userId}`);
            return result;
          } catch (error) {
            this.logger.error(`Failed to calculate feed details output: ${error.message}`);
            throw new Error(`Failed to calculate feed details output: ${error.message}`);
          }

        // return updatedOutputDocument;
    }

    async getFeedDetailsOutput(email: string): Promise<FeedDetailsOutput|null>{
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();

        const outputDocument = await this.feedDetailsOutputModel.findOne({userId}).exec();

        if(!outputDocument){
            throw new HttpException('Output record for this user not found', HttpStatus.NOT_FOUND)
        }

        return outputDocument;
    }

    async getFeedDetailsInput(email:string): Promise<FeedDetailsInput | null>{
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();

        const inputDocument = this.feedDetailsInputModel.findOne({userId}).exec();

        if(!inputDocument){
            throw new HttpException('Input record for this user not found', HttpStatus.NOT_FOUND)
        }

        return inputDocument;
    }
}