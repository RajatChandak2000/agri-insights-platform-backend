import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FeedDetailsInput } from '../schemas/inputs/FeedDetailsInput.schema';
import { Model } from 'mongoose';
import { FeedDetailsOutput } from '../schemas/outputs/FeedDetailsOutput.schema';
import { User } from 'src/user/schemas/user.schema';
import { FeedDetailsInputDto } from '../dto/feed-details-input.dto';
import { ProductionDetailsInput } from '../schemas/inputs/ProductionDetailsInput.schema';
import { ProductionDetailsOutput } from '../schemas/outputs/ProductionDetailsOutput.schema';

@Injectable()
export class FeedDetailsService {
  private readonly logger = new Logger(FeedDetailsService.name);

  constructor(
    @InjectModel(FeedDetailsInput.name)
    private feedDetailsInputModel: Model<FeedDetailsInput>,
    @InjectModel(FeedDetailsOutput.name)
    private feedDetailsOutputModel: Model<FeedDetailsOutput>,
    @InjectModel(ProductionDetailsInput.name)
    private productionDetailsInputModel: Model<ProductionDetailsInput>,
    @InjectModel(ProductionDetailsOutput.name)
    private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateInput(email: string, updateDto: FeedDetailsInputDto) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    console.log('updateDto ', updateDto);

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
      this.logger.log(
        `Milking Herd Data: ${JSON.stringify(updateDto.milkingHerd)}`,
      );
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
      this.logger.log(
        `Bred Heifers Data: ${JSON.stringify(updateDto.bredHeifers)}`,
      );
    }

    // Handling Young Heifers Inputs
    if (updateDto.youngHeifers) {
      for (const [key, value] of Object.entries(updateDto.youngHeifers)) {
        if (value !== undefined) {
          updateData[`youngHeifers.${key}`] = value;
        }
      }
      this.logger.log(
        `Young Heifers Data: ${JSON.stringify(updateDto.youngHeifers)}`,
      );
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
      this.logger.log(
        `Corn Silage Data: ${JSON.stringify(updateDto.cornSilage)}`,
      );
    }

    //Handling Sorghum Silage Inputs
    if (updateDto.sorghumSilage) {
      for (const [key, value] of Object.entries(updateDto.sorghumSilage)) {
        if (value !== undefined) {
          updateData[`sorghumSilage.${key}`] = value;
        }
      }
      this.logger.log(
        `Sorghum Silage Data: ${JSON.stringify(updateDto.sorghumSilage)}`,
      );
    }

    //Handling SmallGrain Silage Inputs
    if (updateDto.smallGrainSilage) {
      for (const [key, value] of Object.entries(updateDto.smallGrainSilage)) {
        if (value !== undefined) {
          updateData[`smallGrainSilage.${key}`] = value;
        }
      }
      this.logger.log(
        `SmallGrain Silage Data: ${JSON.stringify(updateDto.smallGrainSilage)}`,
      );
    }

    //Handling Grass Hay Inputs
    if (updateDto.grassHay) {
      for (const [key, value] of Object.entries(updateDto.grassHay)) {
        if (value !== undefined) {
          updateData[`grassHay.${key}`] = value;
        }
      }
      this.logger.log(
        `Corn Silage Data: ${JSON.stringify(updateDto.grassHay)}`,
      );
    }

    //Handling Alfalfa Hay Establishment Inputs
    if (updateDto.alfalfaHayEstablishment) {
      for (const [key, value] of Object.entries(
        updateDto.alfalfaHayEstablishment,
      )) {
        if (value !== undefined) {
          updateData[`alfalfaHayEstablishment.${key}`] = value;
        }
      }
      this.logger.log(
        `Alfalfa Hay Establishment Data: ${JSON.stringify(updateDto.alfalfaHayEstablishment)}`,
      );
    }

    //Handling Alfalfa Hay Stand Inputs
    if (updateDto.alfalfaHayStand) {
      for (const [key, value] of Object.entries(updateDto.alfalfaHayStand)) {
        if (value !== undefined) {
          updateData[`alfalfaHayStand.${key}`] = value;
        }
      }
      this.logger.log(
        `Alfalfa Hay Stand Data: ${JSON.stringify(updateDto.alfalfaHayStand)}`,
      );
    }

    //Handling Alfalfa Hay Shrink Loss Inputs
    if (updateDto.alfalfaHayShrinkLoss) {
      for (const [key, value] of Object.entries(
        updateDto.alfalfaHayShrinkLoss,
      )) {
        if (value !== undefined) {
          updateData[`alfalfaHayShrinkLoss.${key}`] = value;
        }
      }
      this.logger.log(
        `Alfalfa Hay Shrink Loss Data: ${JSON.stringify(updateDto.alfalfaHayShrinkLoss)}`,
      );
    }

    // Handling Average Cost of Trucking Per Ton-Mile
    if (updateDto.averageCostOfTruckingPerTonMile !== undefined) {
      updateData['averageCostOfTruckingPerTonMile'] =
        updateDto.averageCostOfTruckingPerTonMile;
      this.logger.log(
        `Average Cost of Trucking Per Ton-Mile: ${updateDto.averageCostOfTruckingPerTonMile}`,
      );
    }

    // Handling Corn Silage Trucking Costs
    if (updateDto.cornSilageTransportAndCost) {
      console.log("Entered corn silage trucking costs");
      
      for (const [key, value] of Object.entries(
        updateDto.cornSilageTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`cornSilageTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Corn Silage Trucking Costs: ${JSON.stringify(updateDto.cornSilageTransportAndCost)}`,
      );
    }

    // Handling Sorghum Silage Trucking Costs
    if (updateDto.sorghumSilageTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.sorghumSilageTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`sorghumSilageTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Sorghum Silage Trucking Costs: ${JSON.stringify(updateDto.sorghumSilageTransportAndCost)}`,
      );
    }

    // Handling Small Grain Silage Trucking Costs
    if (updateDto.smallGrainSilageTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.smallGrainSilageTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`smallGrainSilageTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Small Grain Silage Trucking Costs: ${JSON.stringify(updateDto.smallGrainSilageTransportAndCost)}`,
      );
    }

    // Handling Grass Hay Trucking Costs
    if (updateDto.grassHayTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.grassHayTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`grassHayTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Grass Hay Trucking Costs: ${JSON.stringify(updateDto.grassHayTransportAndCost)}`,
      );
    }

    // Handling Alfalfa Hay Trucking Costs
    if (updateDto.alfalfaHayTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.alfalfaHayTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`alfalfaHayTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Alfalfa Hay Trucking Costs: ${JSON.stringify(updateDto.alfalfaHayTransportAndCost)}`,
      );
    }

    // Handling Peanut Hulls Trucking Costs
    if (updateDto.peanutHullsTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.peanutHullsTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`peanutHullsTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Peanut Hulls Trucking Costs: ${JSON.stringify(updateDto.peanutHullsTransportAndCost)}`,
      );
    }

    // Handling Apple Pomace Trucking Costs
    if (updateDto.applePomaceTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.applePomaceTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`applePomaceTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Apple Pomace Trucking Costs: ${JSON.stringify(updateDto.applePomaceTransportAndCost)}`,
      );
    }

    // Handling Distillers Grain Trucking Costs
    if (updateDto.distillersGrainTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.distillersGrainTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`distillersGrainTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Distillers Grain Trucking Costs: ${JSON.stringify(updateDto.distillersGrainTransportAndCost)}`,
      );
    }

    // Handling Brewers Grain Trucking Costs
    if (updateDto.brewersGrainTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.brewersGrainTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`brewersGrainTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Brewers Grain Trucking Costs: ${JSON.stringify(updateDto.brewersGrainTransportAndCost)}`,
      );
    }

    // Handling Citrus Pulp Trucking Costs
    if (updateDto.citrusPulpTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.citrusPulpTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`citrusPulpTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Citrus Pulp Trucking Costs: ${JSON.stringify(updateDto.citrusPulpTransportAndCost)}`,
      );
    }

    // Handling Corn Gluten Trucking Costs
    if (updateDto.cornGlutenTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.cornGlutenTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`cornGlutenTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Corn Gluten Trucking Costs: ${JSON.stringify(updateDto.cornGlutenTransportAndCost)}`,
      );
    }

    // Handling Whole Cottonseed Trucking Costs
    if (updateDto.wholeCottonseedTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.wholeCottonseedTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`wholeCottonseedTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Whole Cottonseed Trucking Costs: ${JSON.stringify(updateDto.wholeCottonseedTransportAndCost)}`,
      );
    }

    // Handling Cottonseed Hulls Trucking Costs
    if (updateDto.cottonseedHullsTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.cottonseedHullsTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`cottonseedHullsTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Cottonseed Hulls Trucking Costs: ${JSON.stringify(updateDto.cottonseedHullsTransportAndCost)}`,
      );
    }

    // Handling Soybean Meal Trucking Costs
    if (updateDto.soybeanMealTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.soybeanMealTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`soybeanMealTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Soybean Meal Trucking Costs: ${JSON.stringify(updateDto.soybeanMealTransportAndCost)}`,
      );
    }

    // Handling Custom Feed Mix Trucking Costs
    if (updateDto.customFeedMixTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.customFeedMixTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`customFeedMixTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Custom Feed Mix Trucking Costs: ${JSON.stringify(updateDto.customFeedMixTransportAndCost)}`,
      );
    }

    // Handling Custom Mineral Mix Trucking Costs
    if (updateDto.customMineralMixTransportAndCost) {
      for (const [key, value] of Object.entries(
        updateDto.customMineralMixTransportAndCost,
      )) {
        if (value !== undefined) {
          updateData[`customMineralMixTransportAndCost.${key}`] = value;
        }
      }
      this.logger.log(
        `Custom Mineral Mix Trucking Costs: ${JSON.stringify(updateDto.customMineralMixTransportAndCost)}`,
      );
    }

    console.log('updateData ', updateData);

    this.logger.log(`Update data received: ${JSON.stringify(updateData)}`);

    try {
      const updatedDocument = await this.feedDetailsInputModel.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, upsert: true },
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

  async calculateFeedDetailsOutput(
    userId: string,
    updatedDocument: FeedDetailsInput,
  ) {
    this.logger.log(
      `Calculating feed detail output for user: ${updatedDocument['userId'] || 'non-authenticated'}`,
    );

    //Get any other required documents from other tables
    const productionDetailsInputs = await this.productionDetailsInputModel
      .findOne({ userId })
      .exec();
    const productionDetailsOutputs = await this.productionDetailsOutputModel
      .findOne({ userId })
      .exec();

    // ---->Temp variables required to calculate the outputs
    // const numberOfHeifersRaised = productionDetailsInputs.heiferProduction.numberOfHeifersRaised;
    const numberOfHeifersRaised = 110;
    // const numberOfLactationsPerYear = productionDetailsOutputs.numberOfLactationsPerYear;
    const numberOfLactationsPerYear = 180;
    const numberOfMilkingCowsOnFeed = numberOfLactationsPerYear;
    const numberOfDryCowsOnFeed = numberOfLactationsPerYear;
    const numberOfBredHeifersCowsOnFeed = numberOfHeifersRaised;
    const numberOfYoungHeifersCowsOnFeed = numberOfHeifersRaised;

    // ----> Feed Details Input variables required to calculate the outputs

    // Milking Herd inputs
    const milkingHerdCornSilageLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdCornSilageLbsAsFedPerDay;
    const milkingHerdCornSilageDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdCornSilageDaysOnFeed;
    const milkingHerdSorghumSilageLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdSorghumSilageLbsAsFedPerDay;
    const milkingHerdSorghumSilageDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdSorghumSilageDaysOnFeed;
    const milkingHerdSmallGrainSilageLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdSmallGrainSilageLbsAsFedPerDay;
    const milkingHerdSmallGrainSilageDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdSmallGrainSilageDaysOnFeed;
    const milkingHerdGrassHayLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdGrassHayLbsAsFedPerDay;
    const milkingHerdGrassHayDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdGrassHayDaysOnFeed;
    const milkingHerdAlfalfaHayLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdAlfalfaHayLbsAsFedPerDay;
    const milkingHerdAlfalfaHayDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdAlfalfaHayDaysOnFeed;
    const milkingHerdPeanutHullsLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdPeanutHullsLbsAsFedPerDay;
    const milkingHerdPeanutHullsDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdPeanutHullsDaysOnFeed;
    const milkingHerdApplePomaceNoHullsLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdApplePomaceNoHullsLbsAsFedPerDay;
    const milkingHerdApplePomaceNoHullsDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdApplePomaceNoHullsDaysOnFeed;
    const milkingHerdDistillersGrainWetLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdDistillersGrainWetLbsAsFedPerDay;
    const milkingHerdDistillersGrainWetDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdDistillersGrainWetDaysOnFeed;
    const milkingHerdBrewersGrainWetLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdBrewersGrainWetLbsAsFedPerDay;
    const milkingHerdBrewersGrainWetDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdBrewersGrainWetDaysOnFeed;
    const milkingHerdCitrusPulpDryLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdCitrusPulpDryLbsAsFedPerDay;
    const milkingHerdCitrusPulpDryDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdCitrusPulpDryDaysOnFeed;
    const milkingHerdCornGlutenFeedLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdCornGlutenFeedLbsAsFedPerDay;
    const milkingHerdCornGlutenFeedDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdCornGlutenFeedDaysOnFeed;
    const milkingHerdWholeCottonseedLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdWholeCottonseedLbsAsFedPerDay;
    const milkingHerdWholeCottonseedDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdWholeCottonseedDaysOnFeed;
    const milkingHerdCottonseedHullsLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdCottonseedHullsLbsAsFedPerDay;
    const milkingHerdCottonseedHullsDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdCottonseedHullsDaysOnFeed;
    const milkingHerdSoybeanMeal48LbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdSoybeanMeal48LbsAsFedPerDay;
    const milkingHerdSoybeanMeal48DaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdSoybeanMeal48DaysOnFeed;
    const milkingHerdCustomFeedMixLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdCustomFeedMixLbsAsFedPerDay;
    const milkingHerdCustomFeedMixDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdCustomFeedMixDaysOnFeed;
    const milkingHerdCustomMineralMixLbsAsFedPerDay =
      updatedDocument.milkingHerd.milkingHerdCustomMineralMixLbsAsFedPerDay;
    const milkingHerdCustomMineralMixDaysOnFeed =
      updatedDocument.milkingHerd.milkingHerdCustomMineralMixDaysOnFeed;

    // Dry Herd inputs
    const dryHerdCornSilageLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdCornSilageLbsAsFedPerDay;
    const dryHerdCornSilageDaysOnFeed =
      updatedDocument.dryHerd.dryHerdCornSilageDaysOnFeed;
    const dryHerdSorghumSilageLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdSorghumSilageLbsAsFedPerDay;
    const dryHerdSorghumSilageDaysOnFeed =
      updatedDocument.dryHerd.dryHerdSorghumSilageDaysOnFeed;
    const dryHerdSmallGrainSilageLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdSmallGrainSilageLbsAsFedPerDay;
    const dryHerdSmallGrainSilageDaysOnFeed =
      updatedDocument.dryHerd.dryHerdSmallGrainSilageDaysOnFeed;
    const dryHerdGrassHayLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdGrassHayLbsAsFedPerDay;
    const dryHerdGrassHayDaysOnFeed =
      updatedDocument.dryHerd.dryHerdGrassHayDaysOnFeed;
    const dryHerdAlfalfaHayLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdAlfalfaHayLbsAsFedPerDay;
    const dryHerdAlfalfaHayDaysOnFeed =
      updatedDocument.dryHerd.dryHerdAlfalfaHayDaysOnFeed;
    const dryHerdPeanutHullsLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdPeanutHullsLbsAsFedPerDay;
    const dryHerdPeanutHullsDaysOnFeed =
      updatedDocument.dryHerd.dryHerdPeanutHullsDaysOnFeed;
    const dryHerdApplePomaceNoHullsLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdApplePomaceNoHullsLbsAsFedPerDay;
    const dryHerdApplePomaceNoHullsDaysOnFeed =
      updatedDocument.dryHerd.dryHerdApplePomaceNoHullsDaysOnFeed;
    const dryHerdDistillersGrainWetLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdDistillersGrainWetLbsAsFedPerDay;
    const dryHerdDistillersGrainWetDaysOnFeed =
      updatedDocument.dryHerd.dryHerdDistillersGrainWetDaysOnFeed;
    const dryHerdBrewersGrainWetLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdBrewersGrainWetLbsAsFedPerDay;
    const dryHerdBrewersGrainWetDaysOnFeed =
      updatedDocument.dryHerd.dryHerdBrewersGrainWetDaysOnFeed;
    const dryHerdCitrusPulpDryLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdCitrusPulpDryLbsAsFedPerDay;
    const dryHerdCitrusPulpDryDaysOnFeed =
      updatedDocument.dryHerd.dryHerdCitrusPulpDryDaysOnFeed;
    const dryHerdCornGlutenFeedLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdCornGlutenFeedLbsAsFedPerDay;
    const dryHerdCornGlutenFeedDaysOnFeed =
      updatedDocument.dryHerd.dryHerdCornGlutenFeedDaysOnFeed;
    const dryHerdWholeCottonseedLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdWholeCottonseedLbsAsFedPerDay;
    const dryHerdWholeCottonseedDaysOnFeed =
      updatedDocument.dryHerd.dryHerdWholeCottonseedDaysOnFeed;
    const dryHerdCottonseedHullsLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdCottonseedHullsLbsAsFedPerDay;
    const dryHerdCottonseedHullsDaysOnFeed =
      updatedDocument.dryHerd.dryHerdCottonseedHullsDaysOnFeed;
    const dryHerdSoybeanMeal48LbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdSoybeanMeal48LbsAsFedPerDay;
    const dryHerdSoybeanMeal48DaysOnFeed =
      updatedDocument.dryHerd.dryHerdSoybeanMeal48DaysOnFeed;
    const dryHerdCustomFeedMixLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdCustomFeedMixLbsAsFedPerDay;
    const dryHerdCustomFeedMixDaysOnFeed =
      updatedDocument.dryHerd.dryHerdCustomFeedMixDaysOnFeed;
    const dryHerdCustomMineralMixLbsAsFedPerDay =
      updatedDocument.dryHerd.dryHerdCustomMineralMixLbsAsFedPerDay;
    const dryHerdCustomMineralMixDaysOnFeed =
      updatedDocument.dryHerd.dryHerdCustomMineralMixDaysOnFeed;

    // Bred Heifers inputs
    const bredHeifersCornSilageLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersCornSilageLbsAsFedPerDay;
    const bredHeifersCornSilageDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersCornSilageDaysOnFeed;
    const bredHeifersSorghumSilageLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersSorghumSilageLbsAsFedPerDay;
    const bredHeifersSorghumSilageDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersSorghumSilageDaysOnFeed;
    const bredHeifersSmallGrainSilageLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersSmallGrainSilageLbsAsFedPerDay;
    const bredHeifersSmallGrainSilageDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersSmallGrainSilageDaysOnFeed;
    const bredHeifersGrassHayLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersGrassHayLbsAsFedPerDay;
    const bredHeifersGrassHayDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersGrassHayDaysOnFeed;
    const bredHeifersAlfalfaHayLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersAlfalfaHayLbsAsFedPerDay;
    const bredHeifersAlfalfaHayDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersAlfalfaHayDaysOnFeed;
    const bredHeifersPeanutHullsLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersPeanutHullsLbsAsFedPerDay;
    const bredHeifersPeanutHullsDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersPeanutHullsDaysOnFeed;
    const bredHeifersApplePomaceNoHullsLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersApplePomaceNoHullsLbsAsFedPerDay;
    const bredHeifersApplePomaceNoHullsDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersApplePomaceNoHullsDaysOnFeed;
    const bredHeifersDistillersGrainWetLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersDistillersGrainWetLbsAsFedPerDay;
    const bredHeifersDistillersGrainWetDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersDistillersGrainWetDaysOnFeed;
    const bredHeifersBrewersGrainWetLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersBrewersGrainWetLbsAsFedPerDay;
    const bredHeifersBrewersGrainWetDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersBrewersGrainWetDaysOnFeed;
    const bredHeifersCitrusPulpDryLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersCitrusPulpDryLbsAsFedPerDay;
    const bredHeifersCitrusPulpDryDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersCitrusPulpDryDaysOnFeed;
    const bredHeifersCornGlutenFeedLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersCornGlutenFeedLbsAsFedPerDay;
    const bredHeifersCornGlutenFeedDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersCornGlutenFeedDaysOnFeed;
    const bredHeifersWholeCottonseedLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersWholeCottonseedLbsAsFedPerDay;
    const bredHeifersWholeCottonseedDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersWholeCottonseedDaysOnFeed;
    const bredHeifersCottonseedHullsLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersCottonseedHullsLbsAsFedPerDay;
    const bredHeifersCottonseedHullsDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersCottonseedHullsDaysOnFeed;
    const bredHeifersSoybeanMeal48LbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersSoybeanMeal48LbsAsFedPerDay;
    const bredHeifersSoybeanMeal48DaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersSoybeanMeal48DaysOnFeed;
    const bredHeifersCustomFeedMixLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersCustomFeedMixLbsAsFedPerDay;
    const bredHeifersCustomFeedMixDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersCustomFeedMixDaysOnFeed;
    const bredHeifersCustomMineralMixLbsAsFedPerDay =
      updatedDocument.bredHeifers.bredHeifersCustomMineralMixLbsAsFedPerDay;
    const bredHeifersCustomMineralMixDaysOnFeed =
      updatedDocument.bredHeifers.bredHeifersCustomMineralMixDaysOnFeed;

    // Young Heifers inputs
    const youngHeifersCornSilageLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersCornSilageLbsAsFedPerDay;
    const youngHeifersCornSilageDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersCornSilageDaysOnFeed;
    const youngHeifersSorghumSilageLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersSorghumSilageLbsAsFedPerDay;
    const youngHeifersSorghumSilageDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersSorghumSilageDaysOnFeed;
    const youngHeifersSmallGrainSilageLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersSmallGrainSilageLbsAsFedPerDay;
    const youngHeifersSmallGrainSilageDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersSmallGrainSilageDaysOnFeed;
    const youngHeifersGrassHayLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersGrassHayLbsAsFedPerDay;
    const youngHeifersGrassHayDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersGrassHayDaysOnFeed;
    const youngHeifersAlfalfaHayLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersAlfalfaHayLbsAsFedPerDay;
    const youngHeifersAlfalfaHayDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersAlfalfaHayDaysOnFeed;
    const youngHeifersPeanutHullsLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersPeanutHullsLbsAsFedPerDay;
    const youngHeifersPeanutHullsDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersPeanutHullsDaysOnFeed;
    const youngHeifersApplePomaceNoHullsLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersApplePomaceNoHullsLbsAsFedPerDay;
    const youngHeifersApplePomaceNoHullsDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersApplePomaceNoHullsDaysOnFeed;
    const youngHeifersDistillersGrainWetLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersDistillersGrainWetLbsAsFedPerDay;
    const youngHeifersDistillersGrainWetDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersDistillersGrainWetDaysOnFeed;
    const youngHeifersBrewersGrainWetLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersBrewersGrainWetLbsAsFedPerDay;
    const youngHeifersBrewersGrainWetDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersBrewersGrainWetDaysOnFeed;
    const youngHeifersCitrusPulpDryLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersCitrusPulpDryLbsAsFedPerDay;
    const youngHeifersCitrusPulpDryDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersCitrusPulpDryDaysOnFeed;
    const youngHeifersCornGlutenFeedLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersCornGlutenFeedLbsAsFedPerDay;
    const youngHeifersCornGlutenFeedDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersCornGlutenFeedDaysOnFeed;
    const youngHeifersWholeCottonseedLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersWholeCottonseedLbsAsFedPerDay;
    const youngHeifersWholeCottonseedDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersWholeCottonseedDaysOnFeed;
    const youngHeifersCottonseedHullsLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersCottonseedHullsLbsAsFedPerDay;
    const youngHeifersCottonseedHullsDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersCottonseedHullsDaysOnFeed;
    const youngHeifersSoybeanMeal48LbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersSoybeanMeal48LbsAsFedPerDay;
    const youngHeifersSoybeanMeal48DaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersSoybeanMeal48DaysOnFeed;
    const youngHeifersCustomFeedMixLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersCustomFeedMixLbsAsFedPerDay;
    const youngHeifersCustomFeedMixDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersCustomFeedMixDaysOnFeed;
    const youngHeifersCustomMineralMixLbsAsFedPerDay =
      updatedDocument.youngHeifers.youngHeifersCustomMineralMixLbsAsFedPerDay;
    const youngHeifersCustomMineralMixDaysOnFeed =
      updatedDocument.youngHeifers.youngHeifersCustomMineralMixDaysOnFeed;

    // Calves inputs
    const calvesMilkReplacerLbsAsFedPerDay =
      updatedDocument.calves.calvesMilkReplacerLbsAsFedPerDay;
    const calvesMilkReplacerDaysOnFeed =
      updatedDocument.calves.calvesMilkReplacerDaysOnFeed;
    const calvesRaisedMilkUsedForCalvesLbsAsFedPerDay =
      updatedDocument.calves.calvesRaisedMilkUsedForCalvesLbsAsFedPerDay;
    const calvesRaisedMilkUsedForCalvesDaysOnFeed =
      updatedDocument.calves.calvesRaisedMilkUsedForCalvesDaysOnFeed;
    const calvesCalfStarterFeedLbsAsFedPerDay =
      updatedDocument.calves.calvesCalfStarterFeedLbsAsFedPerDay;
    const calvesCalfStarterFeedDaysOnFeed =
      updatedDocument.calves.calvesCalfStarterFeedDaysOnFeed;

    //Inputs for Forage Cost Production
    // Corn Silage
    const cornSilageExpectedYieldTonsPerAcre =
      updatedDocument.cornSilage.cornSilageExpectedYieldTonsPerAcre;
    const cornSilageHarvestedAcres =
      updatedDocument.cornSilage.cornSilageHarvestedAcres;
    const cornSilageEstimatedTotalOperatingCost =
      updatedDocument.cornSilage.cornSilageEstimatedTotalOperatingCost;
    const cornSilagePercentOfForageFixedCostAllocated =
      updatedDocument.cornSilage.cornSilagePercentOfForageFixedCostAllocated;
    const cornSilageShrinkLossPercentage =
      updatedDocument.cornSilage.cornSilageShrinkLossPercentage;

    // Sorghum Silage
    const sorghumSilageExpectedYieldTonsPerAcre =
      updatedDocument.sorghumSilage.sorghumSilageExpectedYieldTonsPerAcre;
    const sorghumSilageHarvestedAcres =
      updatedDocument.sorghumSilage.sorghumSilageHarvestedAcres;
    const sorghumSilageEstimatedTotalOperatingCost =
      updatedDocument.sorghumSilage.sorghumSilageEstimatedTotalOperatingCost;
    const sorghumSilagePercentOfForageFixedCostAllocated =
      updatedDocument.sorghumSilage.sorghumSilagePercentOfForageFixedCostAllocated;
    const sorghumSilageShrinkLossPercentage =
      updatedDocument.sorghumSilage.sorghumSilageShrinkLossPercentage;

    // Small Grain Silage
    const smallGrainSilageExpectedYieldTonsPerAcre =
      updatedDocument.smallGrainSilage.smallGrainSilageExpectedYieldTonsPerAcre;
    const smallGrainSilageHarvestedAcres =
      updatedDocument.smallGrainSilage.smallGrainSilageHarvestedAcres;
    const smallGrainSilageEstimatedTotalOperatingCost =
      updatedDocument.smallGrainSilage
        .smallGrainSilageEstimatedTotalOperatingCost;
    const smallGrainSilagePercentOfForageFixedCostAllocated =
      updatedDocument.smallGrainSilage
        .smallGrainSilagePercentOfForageFixedCostAllocated;
    const smallGrainSilageShrinkLossPercentage =
      updatedDocument.smallGrainSilage.smallGrainSilageShrinkLossPercentage;

    // Grass Hay
    const grassHayExpectedYieldTonsPerAcre =
      updatedDocument.grassHay.grassHayExpectedYieldTonsPerAcre;
    const grassHayHarvestedAcres =
      updatedDocument.grassHay.grassHayHarvestedAcres;
    const grassHayEstimatedTotalOperatingCost =
      updatedDocument.grassHay.grassHayEstimatedTotalOperatingCost;
    const grassHayPercentOfForageFixedCostAllocated =
      updatedDocument.grassHay.grassHayPercentOfForageFixedCostAllocated;
    const grassHayShrinkLossPercentage =
      updatedDocument.grassHay.grassHayShrinkLossPercentage;

    // Alfalfa Hay Establishment
    const alfalfaHayEstablishmentExpectedYieldTonsPerAcre =
      updatedDocument.alfalfaHayEstablishment
        .alfalfaHayEstablishmentExpectedYieldTonsPerAcre;
    const alfalfaHayEstablishmentHarvestedAcres =
      updatedDocument.alfalfaHayEstablishment
        .alfalfaHayEstablishmentHarvestedAcres;
    const alfalfaHayEstablishmentEstimatedTotalOperatingCost =
      updatedDocument.alfalfaHayEstablishment
        .alfalfaHayEstablishmentEstimatedTotalOperatingCost;
    const alfalfaHayEstablishmentPercentOfForageFixedCostAllocated =
      updatedDocument.alfalfaHayEstablishment
        .alfalfaHayEstablishmentPercentOfForageFixedCostAllocated;

    // Alfalfa Hay Stand
    const alfalfaHayStandExpectedYieldTonsPerAcre =
      updatedDocument.alfalfaHayStand.alfalfaHayStandExpectedYieldTonsPerAcre;
    const alfalfaHayStandHarvestedAcres =
      updatedDocument.alfalfaHayStand.alfalfaHayStandHarvestedAcres;
    const alfalfaHayStandEstimatedTotalOperatingCost =
      updatedDocument.alfalfaHayStand
        .alfalfaHayStandEstimatedTotalOperatingCost;
    const alfalfaHayStandPercentOfForageFixedCostAllocated =
      updatedDocument.alfalfaHayStand
        .alfalfaHayStandPercentOfForageFixedCostAllocated;

    //Alfafa Hay Shrink Loss Percentage
    const alfalfaHayShrinkLossPercentage =
      updatedDocument.alfalfaHayShrinkLoss.alfalfaHayShrinkLossPercentage;

    //Inputs for Commodity and Trucking Costs Inputs
    // Average Cost of Trucking Per Ton-Mile
    const averageCostOfTruckingPerTonMile =
      updatedDocument.averageCostOfTruckingPerTonMile/25;

    // Corn Silage Trucking Costs
    const cornSilageCostOfCommodityPerTon =
      updatedDocument.cornSilageTransportAndCost
        .cornSilageCostOfCommodityPerTon;
    const cornSilageAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.cornSilageTransportAndCost
        .cornSilageAvgPurchasedFeedMilesTruckedToDairy;
    const cornSilageAvgGrownForageMilesTruckedToDairy =
      updatedDocument.cornSilageTransportAndCost
        .cornSilageAvgGrownForageMilesTruckedToDairy;

    // Sorghum Silage Trucking Costs
    const sorghumSilageCostOfCommodityPerTon =
      updatedDocument.sorghumSilageTransportAndCost
        .sorghumSilageCostOfCommodityPerTon;
    const sorghumSilageAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.sorghumSilageTransportAndCost
        .sorghumSilageAvgPurchasedFeedMilesTruckedToDairy;
    const sorghumSilageAvgGrownForageMilesTruckedToDairy =
      updatedDocument.sorghumSilageTransportAndCost
        .sorghumSilageAvgGrownForageMilesTruckedToDairy;

    // Small Grain Silage Trucking Costs
    const smallGrainSilageCostOfCommodityPerTon =
      updatedDocument.smallGrainSilageTransportAndCost
        .smallGrainSilageCostOfCommodityPerTon;
    const smallGrainSilageAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.smallGrainSilageTransportAndCost
        .smallGrainSilageAvgPurchasedFeedMilesTruckedToDairy;
    const smallGrainSilageAvgGrownForageMilesTruckedToDairy =
      updatedDocument.smallGrainSilageTransportAndCost
        .smallGrainSilageAvgGrownForageMilesTruckedToDairy;

    // Grass Hay Trucking Costs
    const grassHayCostOfCommodityPerTon =
      updatedDocument.grassHayTransportAndCost.grassHayCostOfCommodityPerTon;
    const grassHayAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.grassHayTransportAndCost
        .grassHayAvgPurchasedFeedMilesTruckedToDairy;
    const grassHayAvgGrownForageMilesTruckedToDairy =
      updatedDocument.grassHayTransportAndCost
        .grassHayAvgGrownForageMilesTruckedToDairy;

    // Alfalfa Hay Trucking Costs
    const alfalfaHayCostOfCommodityPerTon =
      updatedDocument.alfalfaHayTransportAndCost
        .alfalfaHayCostOfCommodityPerTon;
    const alfalfaHayAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.alfalfaHayTransportAndCost
        .alfalfaHayAvgPurchasedFeedMilesTruckedToDairy;
    const alfalfaHayAvgGrownForageMilesTruckedToDairy =
      updatedDocument.alfalfaHayTransportAndCost
        .alfalfaHayAvgGrownForageMilesTruckedToDairy;

    // Peanut Hulls Trucking Costs
    const peanutHullsCostOfCommodityPerTon =
      updatedDocument.peanutHullsTransportAndCost
        .peanutHullsCostOfCommodityPerTon;
    const peanutHullsAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.peanutHullsTransportAndCost
        .peanutHullsAvgPurchasedFeedMilesTruckedToDairy;
    const peanutHullsAvgGrownForageMilesTruckedToDairy =
      updatedDocument.peanutHullsTransportAndCost
        .peanutHullsAvgGrownForageMilesTruckedToDairy;

    // Apple Pomace Trucking Costs
    const applePomaceCostOfCommodityPerTon =
      updatedDocument.applePomaceTransportAndCost
        .applePomaceCostOfCommodityPerTon;
    const applePomaceAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.applePomaceTransportAndCost
        .applePomaceAvgPurchasedFeedMilesTruckedToDairy;
    const applePomaceAvgGrownForageMilesTruckedToDairy =
      updatedDocument.applePomaceTransportAndCost
        .applePomaceAvgGrownForageMilesTruckedToDairy;

    // Distillers Grain Trucking Costs
    const distillersGrainCostOfCommodityPerTon =
      updatedDocument.distillersGrainTransportAndCost
        .distillersGrainCostOfCommodityPerTon;
    const distillersGrainAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.distillersGrainTransportAndCost
        .distillersGrainAvgPurchasedFeedMilesTruckedToDairy;
    const distillersGrainAvgGrownForageMilesTruckedToDairy =
      updatedDocument.distillersGrainTransportAndCost
        .distillersGrainAvgGrownForageMilesTruckedToDairy;

    // Brewers Grain Trucking Costs
    const brewersGrainCostOfCommodityPerTon =
      updatedDocument.brewersGrainTransportAndCost
        .brewersGrainCostOfCommodityPerTon;
    const brewersGrainAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.brewersGrainTransportAndCost
        .brewersGrainAvgPurchasedFeedMilesTruckedToDairy;
    const brewersGrainAvgGrownForageMilesTruckedToDairy =
      updatedDocument.brewersGrainTransportAndCost
        .brewersGrainAvgGrownForageMilesTruckedToDairy;

    // Citrus Pulp Trucking Costs
    const citrusPulpCostOfCommodityPerTon =
      updatedDocument.citrusPulpTransportAndCost
        .citrusPulpCostOfCommodityPerTon;
    const citrusPulpAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.citrusPulpTransportAndCost
        .citrusPulpAvgPurchasedFeedMilesTruckedToDairy;
    const citrusPulpAvgGrownForageMilesTruckedToDairy =
      updatedDocument.citrusPulpTransportAndCost
        .citrusPulpAvgGrownForageMilesTruckedToDairy;

    // Corn Gluten Trucking Costs
    const cornGlutenCostOfCommodityPerTon =
      updatedDocument.cornGlutenTransportAndCost
        .cornGlutenCostOfCommodityPerTon;
    const cornGlutenAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.cornGlutenTransportAndCost
        .cornGlutenAvgPurchasedFeedMilesTruckedToDairy;
    const cornGlutenAvgGrownForageMilesTruckedToDairy =
      updatedDocument.cornGlutenTransportAndCost
        .cornGlutenAvgGrownForageMilesTruckedToDairy;

    // Whole Cottonseed Trucking Costs
    const wholeCottonseedCostOfCommodityPerTon =
      updatedDocument.wholeCottonseedTransportAndCost
        .wholeCottonseedCostOfCommodityPerTon;
    const wholeCottonseedAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.wholeCottonseedTransportAndCost
        .wholeCottonseedAvgPurchasedFeedMilesTruckedToDairy;
    const wholeCottonseedAvgGrownForageMilesTruckedToDairy =
      updatedDocument.wholeCottonseedTransportAndCost
        .wholeCottonseedAvgGrownForageMilesTruckedToDairy;

    // Cottonseed Hulls Trucking Costs
    const cottonseedHullsCostOfCommodityPerTon =
      updatedDocument.cottonseedHullsTransportAndCost
        .cottonseedHullsCostOfCommodityPerTon;
    const cottonseedHullsAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.cottonseedHullsTransportAndCost
        .cottonseedHullsAvgPurchasedFeedMilesTruckedToDairy;
    const cottonseedHullsAvgGrownForageMilesTruckedToDairy =
      updatedDocument.cottonseedHullsTransportAndCost
        .cottonseedHullsAvgGrownForageMilesTruckedToDairy;

    // Soybean Meal Trucking Costs
    const soybeanMealCostOfCommodityPerTon =
      updatedDocument.soybeanMealTransportAndCost
        .soybeanMealCostOfCommodityPerTon;
    const soybeanMealAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.soybeanMealTransportAndCost
        .soybeanMealAvgPurchasedFeedMilesTruckedToDairy;
    const soybeanMealAvgGrownForageMilesTruckedToDairy =
      updatedDocument.soybeanMealTransportAndCost
        .soybeanMealAvgGrownForageMilesTruckedToDairy;

    // Custom Feed Mix Trucking Costs
    const customFeedMixCostOfCommodityPerTon =
      updatedDocument.customFeedMixTransportAndCost
        .customFeedMixCostOfCommodityPerTon;
    const customFeedMixAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.customFeedMixTransportAndCost
        .customFeedMixAvgPurchasedFeedMilesTruckedToDairy;
    const customFeedMixAvgGrownForageMilesTruckedToDairy =
      updatedDocument.customFeedMixTransportAndCost
        .customFeedMixAvgGrownForageMilesTruckedToDairy;

    // Custom Mineral Mix Trucking Costs
    const customMineralMixCostOfCommodityPerTon =
      updatedDocument.customMineralMixTransportAndCost
        .customMineralMixCostOfCommodityPerTon;
    const customMineralMixAvgPurchasedFeedMilesTruckedToDairy =
      updatedDocument.customMineralMixTransportAndCost
        .customMineralMixAvgPurchasedFeedMilesTruckedToDairy;
    const customMineralMixAvgGrownForageMilesTruckedToDairy =
      updatedDocument.customMineralMixTransportAndCost
        .customMineralMixAvgGrownForageMilesTruckedToDairy;

    // ----> Calculating the outputs here
    const cornSilageTonsRequired =
      (milkingHerdCornSilageLbsAsFedPerDay * milkingHerdCornSilageDaysOnFeed * numberOfMilkingCowsOnFeed +
        dryHerdCornSilageLbsAsFedPerDay * dryHerdCornSilageDaysOnFeed * numberOfDryCowsOnFeed +
        bredHeifersCornSilageLbsAsFedPerDay * bredHeifersCornSilageDaysOnFeed * numberOfBredHeifersCowsOnFeed +
        youngHeifersCornSilageLbsAsFedPerDay * youngHeifersCornSilageDaysOnFeed * numberOfYoungHeifersCowsOnFeed)/2000;
    const cornSilageTonsProduced = cornSilageExpectedYieldTonsPerAcre * cornSilageHarvestedAcres;
    const cornSilageBalanceToBePurchasedOrSold = cornSilageTonsRequired - cornSilageTonsProduced * (1 - cornSilageShrinkLossPercentage / 100);

    // Sorghum Silage Calculations
    const sorghumSilageTonsRequired = 
      (milkingHerdSorghumSilageLbsAsFedPerDay * milkingHerdSorghumSilageDaysOnFeed * numberOfMilkingCowsOnFeed +
        dryHerdSorghumSilageLbsAsFedPerDay * dryHerdSorghumSilageDaysOnFeed * numberOfDryCowsOnFeed +
        bredHeifersSorghumSilageLbsAsFedPerDay * bredHeifersSorghumSilageDaysOnFeed * numberOfBredHeifersCowsOnFeed +
        youngHeifersSorghumSilageLbsAsFedPerDay * youngHeifersSorghumSilageDaysOnFeed * numberOfYoungHeifersCowsOnFeed)/2000;
    const sorghumSilageTonsProduced = sorghumSilageExpectedYieldTonsPerAcre * sorghumSilageHarvestedAcres;
    const sorghumSilageBalanceToBePurchasedOrSold = sorghumSilageTonsRequired - sorghumSilageTonsProduced * (1 - sorghumSilageShrinkLossPercentage / 100);

    // Small Grain Silage Calculations
    const smallGrainSilageTonsRequired =
      (milkingHerdSmallGrainSilageLbsAsFedPerDay * milkingHerdSmallGrainSilageDaysOnFeed * numberOfMilkingCowsOnFeed +
        dryHerdSmallGrainSilageLbsAsFedPerDay * dryHerdSmallGrainSilageDaysOnFeed * numberOfDryCowsOnFeed +
        bredHeifersSmallGrainSilageLbsAsFedPerDay * bredHeifersSmallGrainSilageDaysOnFeed * numberOfBredHeifersCowsOnFeed +
        youngHeifersSmallGrainSilageLbsAsFedPerDay * youngHeifersSmallGrainSilageDaysOnFeed * numberOfYoungHeifersCowsOnFeed)/2000;
    const smallGrainSilageTonsProduced = smallGrainSilageExpectedYieldTonsPerAcre * smallGrainSilageHarvestedAcres;
    const smallGrainSilageBalanceToBePurchasedOrSold = smallGrainSilageTonsRequired - smallGrainSilageTonsProduced * (1 - smallGrainSilageShrinkLossPercentage / 100);

    // Grass Hay Calculations
    const grassHayTonsRequired =
      (milkingHerdGrassHayLbsAsFedPerDay * milkingHerdGrassHayDaysOnFeed * numberOfMilkingCowsOnFeed +
        dryHerdGrassHayLbsAsFedPerDay * dryHerdGrassHayDaysOnFeed * numberOfDryCowsOnFeed +
        bredHeifersGrassHayLbsAsFedPerDay * bredHeifersGrassHayDaysOnFeed * numberOfBredHeifersCowsOnFeed +
        youngHeifersGrassHayLbsAsFedPerDay * youngHeifersGrassHayDaysOnFeed * numberOfYoungHeifersCowsOnFeed)/2000;
    const grassHayTonsProduced = grassHayExpectedYieldTonsPerAcre * grassHayHarvestedAcres;
    const grassHayBalanceToBePurchasedOrSold = grassHayTonsRequired - grassHayTonsProduced * (1 - grassHayShrinkLossPercentage / 100);

    // Alfalfa Hay Calculations
    const alfalfaHayTonsRequired =
      (milkingHerdAlfalfaHayLbsAsFedPerDay *
        milkingHerdAlfalfaHayDaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdAlfalfaHayLbsAsFedPerDay *
          dryHerdAlfalfaHayDaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersAlfalfaHayLbsAsFedPerDay *
          bredHeifersAlfalfaHayDaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersAlfalfaHayLbsAsFedPerDay *
          youngHeifersAlfalfaHayDaysOnFeed *
          numberOfYoungHeifersCowsOnFeed)/2000;
    const alfalfaHayTonsProduced = (alfalfaHayEstablishmentExpectedYieldTonsPerAcre * alfalfaHayEstablishmentHarvestedAcres) +
      (alfalfaHayStandExpectedYieldTonsPerAcre * alfalfaHayStandHarvestedAcres);
    const alfalfaHayBalanceToBePurchasedOrSold = alfalfaHayTonsRequired - alfalfaHayTonsProduced * (1 - alfalfaHayShrinkLossPercentage / 100);

    // Peanut Hulls Calculations
    const peanutHullsTonsRequired =
      (milkingHerdPeanutHullsLbsAsFedPerDay * milkingHerdPeanutHullsDaysOnFeed * numberOfMilkingCowsOnFeed +
        dryHerdPeanutHullsLbsAsFedPerDay * dryHerdPeanutHullsDaysOnFeed * numberOfDryCowsOnFeed +
        bredHeifersPeanutHullsLbsAsFedPerDay * bredHeifersPeanutHullsDaysOnFeed * numberOfBredHeifersCowsOnFeed +
        youngHeifersPeanutHullsLbsAsFedPerDay * youngHeifersPeanutHullsDaysOnFeed * numberOfYoungHeifersCowsOnFeed)/2000;

    // Apple Pomace Calculations
    const applePomaceTonsRequired =
      (milkingHerdApplePomaceNoHullsLbsAsFedPerDay * milkingHerdApplePomaceNoHullsDaysOnFeed * numberOfMilkingCowsOnFeed +
        dryHerdApplePomaceNoHullsLbsAsFedPerDay * dryHerdApplePomaceNoHullsDaysOnFeed * numberOfDryCowsOnFeed +
        bredHeifersApplePomaceNoHullsLbsAsFedPerDay * bredHeifersApplePomaceNoHullsDaysOnFeed * numberOfBredHeifersCowsOnFeed +
        youngHeifersApplePomaceNoHullsLbsAsFedPerDay * youngHeifersApplePomaceNoHullsDaysOnFeed * numberOfYoungHeifersCowsOnFeed) /
      2000;

    // Distiller's Grain Calculations
    const distillersGrainTonsRequired =
      (milkingHerdDistillersGrainWetLbsAsFedPerDay * milkingHerdDistillersGrainWetDaysOnFeed * numberOfMilkingCowsOnFeed +
        dryHerdDistillersGrainWetLbsAsFedPerDay * dryHerdDistillersGrainWetDaysOnFeed * numberOfDryCowsOnFeed +
        bredHeifersDistillersGrainWetLbsAsFedPerDay * bredHeifersDistillersGrainWetDaysOnFeed * numberOfBredHeifersCowsOnFeed +
        youngHeifersDistillersGrainWetLbsAsFedPerDay * youngHeifersDistillersGrainWetDaysOnFeed * numberOfYoungHeifersCowsOnFeed)/2000;

    // Brewer's Grain Calculations
    const brewersGrainTonsRequired =
      (milkingHerdBrewersGrainWetLbsAsFedPerDay *
        milkingHerdBrewersGrainWetDaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdBrewersGrainWetLbsAsFedPerDay *
          dryHerdBrewersGrainWetDaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersBrewersGrainWetLbsAsFedPerDay *
          bredHeifersBrewersGrainWetDaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersBrewersGrainWetLbsAsFedPerDay *
          youngHeifersBrewersGrainWetDaysOnFeed *
          numberOfYoungHeifersCowsOnFeed) /
      2000;

    // Citrus Pulp Calculations
    const citrusPulpTonsRequired =
      (milkingHerdCitrusPulpDryLbsAsFedPerDay *
        milkingHerdCitrusPulpDryDaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdCitrusPulpDryLbsAsFedPerDay *
          dryHerdCitrusPulpDryDaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersCitrusPulpDryLbsAsFedPerDay *
          bredHeifersCitrusPulpDryDaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersCitrusPulpDryLbsAsFedPerDay *
          youngHeifersCitrusPulpDryDaysOnFeed *
          numberOfYoungHeifersCowsOnFeed) /
      2000;

    // Corn Gluten Calculations
    const cornGlutenTonsRequired =
      (milkingHerdCornGlutenFeedLbsAsFedPerDay *
        milkingHerdCornGlutenFeedDaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdCornGlutenFeedLbsAsFedPerDay *
          dryHerdCornGlutenFeedDaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersCornGlutenFeedLbsAsFedPerDay *
          bredHeifersCornGlutenFeedDaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersCornGlutenFeedLbsAsFedPerDay *
          youngHeifersCornGlutenFeedDaysOnFeed *
          numberOfYoungHeifersCowsOnFeed) /
      2000;

    // Whole Cottonseed Calculations
    const wholeCottonseedTonsRequired =
      (milkingHerdWholeCottonseedLbsAsFedPerDay *
        milkingHerdWholeCottonseedDaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdWholeCottonseedLbsAsFedPerDay *
          dryHerdWholeCottonseedDaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersWholeCottonseedLbsAsFedPerDay *
          bredHeifersWholeCottonseedDaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersWholeCottonseedLbsAsFedPerDay *
          youngHeifersWholeCottonseedDaysOnFeed *
          numberOfYoungHeifersCowsOnFeed) /
      2000;

    // Cotton Seed Hulls Calculations
    const cottonseedHullsTonsRequired =
      (milkingHerdCottonseedHullsLbsAsFedPerDay *
        milkingHerdCottonseedHullsDaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdCottonseedHullsLbsAsFedPerDay *
          dryHerdCottonseedHullsDaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersCottonseedHullsLbsAsFedPerDay *
          bredHeifersCottonseedHullsDaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersCottonseedHullsLbsAsFedPerDay *
          youngHeifersCottonseedHullsDaysOnFeed *
          numberOfYoungHeifersCowsOnFeed) /
      2000;

    // Soybean Meal 48 Calculations
    const soybeanMeal48TonsRequired =
      (milkingHerdSoybeanMeal48LbsAsFedPerDay *
        milkingHerdSoybeanMeal48DaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdSoybeanMeal48LbsAsFedPerDay *
          dryHerdSoybeanMeal48DaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersSoybeanMeal48LbsAsFedPerDay *
          bredHeifersSoybeanMeal48DaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersSoybeanMeal48LbsAsFedPerDay *
          youngHeifersSoybeanMeal48DaysOnFeed *
          numberOfYoungHeifersCowsOnFeed) /
      2000;

    // Custom Feed Mix Calculations
    const customFeedMixTonsRequired =
      (milkingHerdCustomFeedMixLbsAsFedPerDay *
        milkingHerdCustomFeedMixDaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdCustomFeedMixLbsAsFedPerDay *
          dryHerdCustomFeedMixDaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersCustomFeedMixLbsAsFedPerDay *
          bredHeifersCustomFeedMixDaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersCustomFeedMixLbsAsFedPerDay *
          youngHeifersCustomFeedMixDaysOnFeed *
          numberOfYoungHeifersCowsOnFeed) /
      2000;

    // Custom Mineral Mix Calculations
    const customMineralMixTonsRequired =
      (milkingHerdCustomMineralMixLbsAsFedPerDay *
        milkingHerdCustomMineralMixDaysOnFeed *
        numberOfMilkingCowsOnFeed +
        dryHerdCustomMineralMixLbsAsFedPerDay *
          dryHerdCustomMineralMixDaysOnFeed *
          numberOfDryCowsOnFeed +
        bredHeifersCustomMineralMixLbsAsFedPerDay *
          bredHeifersCustomMineralMixDaysOnFeed *
          numberOfBredHeifersCowsOnFeed +
        youngHeifersCustomMineralMixLbsAsFedPerDay *
          youngHeifersCustomMineralMixDaysOnFeed *
          numberOfYoungHeifersCowsOnFeed) /
      2000;

    //Raised Forage Variable Costs
    const cornSilageTVC = cornSilageEstimatedTotalOperatingCost;
    const cornSilageTVCPerTon = cornSilageTVC / cornSilageTonsProduced;
    const sorghumSilageTVC = sorghumSilageEstimatedTotalOperatingCost;
    const sorghumSilageTVCPerTon = sorghumSilageTVC / sorghumSilageTonsProduced;
    const smallGrainSilageTVC = smallGrainSilageEstimatedTotalOperatingCost;
    const smallGrainSilageTVCPerTon =
      smallGrainSilageTVC / smallGrainSilageTonsProduced;
    const grassHayTVC = grassHayEstimatedTotalOperatingCost;
    const grassHayTVCPerTon = grassHayTVC / grassHayTonsProduced;
    const alfalfaHayEstablishmentTVC =
      alfalfaHayEstablishmentEstimatedTotalOperatingCost;
    const alfalfaHayEstablishmentTVCPerTon =
      alfalfaHayEstablishmentTVC / (alfalfaHayEstablishmentExpectedYieldTonsPerAcre * alfalfaHayEstablishmentHarvestedAcres);
    const alfalfaHayStandTVC = alfalfaHayStandEstimatedTotalOperatingCost;
    const alfalfaHayStandTVCPerTon =
      alfalfaHayStandTVC / (alfalfaHayStandExpectedYieldTonsPerAcre * alfalfaHayStandHarvestedAcres);

    //Fix : TEMPPPPPPB
    const totalCroppingEconomicFixedCost = 63201.52;

    //Raised Forage Fixed Costs
    const cornSilageFixedCostAllocation =
      totalCroppingEconomicFixedCost *
      cornSilagePercentOfForageFixedCostAllocated/100;
    const cornSilageFixedCostPerTon =
      cornSilageFixedCostAllocation / cornSilageTonsProduced;
    const sorghumSilageFixedCostAllocation =
      totalCroppingEconomicFixedCost *
      sorghumSilagePercentOfForageFixedCostAllocated/100;
    const sorghumSilageFixedCostPerTon =
      sorghumSilageFixedCostAllocation / sorghumSilageTonsProduced;
    const smallGrainSilageFixedCostAllocation =
      totalCroppingEconomicFixedCost *
      smallGrainSilagePercentOfForageFixedCostAllocated/100;
    const smallGrainSilageFixedCostPerTon =
      smallGrainSilageFixedCostAllocation / smallGrainSilageTonsProduced;
    const grassHayFixedCostAllocation =
      totalCroppingEconomicFixedCost *
      grassHayPercentOfForageFixedCostAllocated/100;
    const grassHayFixedCostPerTon =
      grassHayFixedCostAllocation / grassHayTonsProduced;
    const alfalfaHayEstablishmentFixedCostAllocation =
      totalCroppingEconomicFixedCost *
      alfalfaHayEstablishmentPercentOfForageFixedCostAllocated/100;
    const alfalfaHayEstablishmentFixedCostPerTon =
      alfalfaHayEstablishmentFixedCostAllocation / (alfalfaHayEstablishmentExpectedYieldTonsPerAcre * alfalfaHayEstablishmentHarvestedAcres);
    const alfalfaHayStandFixedCostAllocation =
      totalCroppingEconomicFixedCost *
      alfalfaHayStandPercentOfForageFixedCostAllocated/100;
    const alfalfaHayStandFixedCostPerTon =
      alfalfaHayStandFixedCostAllocation / (alfalfaHayStandExpectedYieldTonsPerAcre * alfalfaHayStandHarvestedAcres);

    // Raised Forage Total Cost
    const cornSilageTotalCost = cornSilageTVC + cornSilageFixedCostAllocation;
    const cornSilageTotalCostPerTon =
      cornSilageTotalCost / cornSilageTonsProduced;
    const sorghumSilageTotalCost =
      sorghumSilageTVC + sorghumSilageFixedCostAllocation;
    const sorghumSilageTotalCostPerTon =
      sorghumSilageTotalCost / sorghumSilageTonsProduced;
    const smallGrainSilageTotalCost =
      smallGrainSilageTVC + smallGrainSilageFixedCostAllocation;
    const smallGrainSilageTotalCostPerTon =
      smallGrainSilageTotalCost / smallGrainSilageTonsProduced;
    const grassHayTotalCost = grassHayTVC + grassHayFixedCostAllocation;
    const grassHayTotalCostPerTon = grassHayTotalCost / grassHayTonsProduced;
    const alfalfaHayEstablishmentTotalCost =
      alfalfaHayEstablishmentTVC + alfalfaHayEstablishmentFixedCostAllocation;
    const alfalfaHayEstablishmentTotalCostPerTon =
      alfalfaHayEstablishmentTotalCost / (alfalfaHayEstablishmentExpectedYieldTonsPerAcre * alfalfaHayEstablishmentHarvestedAcres);
    const alfalfaHayStandTotalCost =
      alfalfaHayStandTVC + alfalfaHayStandFixedCostAllocation;
    const alfalfaHayStandTotalCostPerTon =
      alfalfaHayStandTotalCost / (alfalfaHayStandExpectedYieldTonsPerAcre * alfalfaHayStandHarvestedAcres);

    // Purchased Feed Expenses
    const cornSilageTonsToBePurchased = cornSilageBalanceToBePurchasedOrSold < 0 ? 0 : cornSilageBalanceToBePurchasedOrSold;
    const cornSilageCostOfCommodity = cornSilageTonsToBePurchased === 0 ? 0 : cornSilageTonsToBePurchased * cornSilageCostOfCommodityPerTon;
    const cornSilageCostOfTrucking = cornSilageTonsToBePurchased === 0 ? 0 : cornSilageTonsToBePurchased * cornSilageAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedCornSilageTotalCost = cornSilageTonsToBePurchased === 0 ? 0 : cornSilageCostOfCommodity + cornSilageCostOfTrucking;

    const sorghumSilageTonsToBePurchased = sorghumSilageBalanceToBePurchasedOrSold < 0 ? 0 : sorghumSilageBalanceToBePurchasedOrSold;
    const sorghumSilageCostOfCommodity = sorghumSilageTonsToBePurchased === 0 ? 0 : sorghumSilageTonsToBePurchased * sorghumSilageCostOfCommodityPerTon;
    const sorghumSilageCostOfTrucking = sorghumSilageTonsToBePurchased === 0 ? 0 : sorghumSilageTonsToBePurchased * sorghumSilageAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedSorghumSilageTotalCost = sorghumSilageTonsToBePurchased === 0 ? 0 : sorghumSilageCostOfCommodity + sorghumSilageCostOfTrucking;

    const smallGrainSilageTonsToBePurchased = smallGrainSilageBalanceToBePurchasedOrSold < 0 ? 0 : smallGrainSilageBalanceToBePurchasedOrSold;
    const smallGrainSilageCostOfCommodity = smallGrainSilageTonsToBePurchased === 0 ? 0 : smallGrainSilageTonsToBePurchased * smallGrainSilageCostOfCommodityPerTon;
    const smallGrainSilageCostOfTrucking = smallGrainSilageTonsToBePurchased === 0 ? 0 : smallGrainSilageTonsToBePurchased * smallGrainSilageAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedSmallGrainSilageTotalCost = smallGrainSilageTonsToBePurchased === 0 ? 0 : smallGrainSilageCostOfCommodity + smallGrainSilageCostOfTrucking;

    const grassHayTonsToBePurchased = grassHayBalanceToBePurchasedOrSold < 0 ? 0 : grassHayBalanceToBePurchasedOrSold;
    const grassHayCostOfCommodity = grassHayTonsToBePurchased === 0 ? 0 : grassHayTonsToBePurchased * grassHayCostOfCommodityPerTon;
    const grassHayCostOfTrucking = grassHayTonsToBePurchased === 0 ? 0 : grassHayTonsToBePurchased * grassHayAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedGrassHayTotalCost = grassHayTonsToBePurchased === 0 ? 0 : grassHayCostOfCommodity + grassHayCostOfTrucking;

    const alfalfaHayTonsToBePurchased = alfalfaHayBalanceToBePurchasedOrSold < 0 ? 0 : alfalfaHayBalanceToBePurchasedOrSold;
    const alfalfaHayCostOfCommodity = alfalfaHayTonsToBePurchased === 0 ? 0 : alfalfaHayTonsToBePurchased * alfalfaHayCostOfCommodityPerTon;
    const alfalfaHayCostOfTrucking = alfalfaHayTonsToBePurchased === 0 ? 0 : alfalfaHayTonsToBePurchased * alfalfaHayAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedAlfalfaHayTotalCost = alfalfaHayTonsToBePurchased === 0 ? 0 : alfalfaHayCostOfCommodity + alfalfaHayCostOfTrucking;

    const peanutHullsTonsToBePurchased = peanutHullsTonsRequired;
    const peanutHullsCostOfCommodity = peanutHullsTonsToBePurchased * peanutHullsCostOfCommodityPerTon;
    const peanutHullsCostOfTrucking = peanutHullsTonsToBePurchased *
      peanutHullsAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedPeanutHullsTotalCost = peanutHullsCostOfCommodity + peanutHullsCostOfTrucking;

    const applePomaceNoHullsTonsToBePurchased = applePomaceTonsRequired;
    const applePomaceNoHullsCostOfCommodity = applePomaceNoHullsTonsToBePurchased * applePomaceCostOfCommodityPerTon;
    const applePomaceNoHullsCostOfTrucking = applePomaceNoHullsTonsToBePurchased *
      applePomaceAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedApplePomaceNoHullsTotalCost = applePomaceNoHullsCostOfCommodity + applePomaceNoHullsCostOfTrucking;

    const distillersGrainWetTonsToBePurchased = distillersGrainTonsRequired;
    const distillersGrainWetCostOfCommodity = distillersGrainWetTonsToBePurchased * distillersGrainCostOfCommodityPerTon;
    const distillersGrainWetCostOfTrucking = distillersGrainWetTonsToBePurchased *
      brewersGrainAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedDistillersGrainWetTotalCost = distillersGrainWetCostOfCommodity + distillersGrainWetCostOfTrucking;

    const brewersGrainWetTonsToBePurchased = brewersGrainTonsRequired;
    const brewersGrainWetCostOfCommodity = brewersGrainWetTonsToBePurchased * brewersGrainCostOfCommodityPerTon;
    const brewersGrainWetCostOfTrucking = brewersGrainWetTonsToBePurchased *
      brewersGrainAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedBrewersGrainWetTotalCost = brewersGrainWetCostOfCommodity + brewersGrainWetCostOfTrucking;

    const citrusPulpDryTonsToBePurchased = citrusPulpTonsRequired;
    const citrusPulpDryCostOfCommodity = citrusPulpDryTonsToBePurchased * citrusPulpCostOfCommodityPerTon;
    const citrusPulpDryCostOfTrucking = citrusPulpDryTonsToBePurchased *
      citrusPulpAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedCitrusPulpDryTotalCost = citrusPulpDryCostOfCommodity + citrusPulpDryCostOfTrucking;

    const cornGlutenFeedTonsToBePurchased = cornGlutenTonsRequired;
    const cornGlutenFeedCostOfCommodity = cornGlutenFeedTonsToBePurchased * cornGlutenCostOfCommodityPerTon;
    const cornGlutenFeedCostOfTrucking =cornGlutenFeedTonsToBePurchased *
      cornGlutenAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedCornGlutenFeedTotalCost = cornGlutenFeedCostOfCommodity + cornGlutenFeedCostOfTrucking;

    const wholeCottonseedTonsToBePurchased = wholeCottonseedTonsRequired;
    const wholeCottonseedCostOfCommodity = wholeCottonseedTonsToBePurchased * wholeCottonseedCostOfCommodityPerTon;
    const wholeCottonseedCostOfTrucking = wholeCottonseedTonsToBePurchased *
      wholeCottonseedAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedWholeCottonseedTotalCost = wholeCottonseedCostOfCommodity + wholeCottonseedCostOfTrucking;

    const cottonseedHullsTonsToBePurchased = cottonseedHullsTonsRequired;
    const cottonseedHullsCostOfCommodity = cottonseedHullsTonsToBePurchased * cottonseedHullsCostOfCommodityPerTon;
    const cottonseedHullsCostOfTrucking = cottonseedHullsTonsToBePurchased *
      cottonseedHullsAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedCottonseedHullsTotalCost = cottonseedHullsCostOfCommodity + cottonseedHullsCostOfTrucking;

    const soybeanMeal48TonsToBePurchased = soybeanMeal48TonsRequired;
    const soybeanMeal48CostOfCommodity = soybeanMeal48TonsToBePurchased * soybeanMealCostOfCommodityPerTon;
    const soybeanMeal48CostOfTrucking = soybeanMeal48TonsToBePurchased *
      soybeanMealAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedSoybeanMeal48TotalCost = soybeanMeal48CostOfCommodity + soybeanMeal48CostOfTrucking;

    const customFeedMixTonsToBePurchased = customFeedMixTonsRequired;
    const customFeedMixCostOfCommodity = customFeedMixTonsToBePurchased * customFeedMixCostOfCommodityPerTon;
    const customFeedMixCostOfTrucking = customFeedMixTonsToBePurchased *
      customFeedMixAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedCustomFeedMixTotalCost = customFeedMixCostOfCommodity + customFeedMixCostOfTrucking;

    const customMineralMixTonsToBePurchased = customMineralMixTonsRequired;
    const customMineralMixCostOfCommodity = customMineralMixTonsToBePurchased * customMineralMixCostOfCommodityPerTon;
    const customMineralMixCostOfTrucking = customMineralMixTonsToBePurchased *
      customMineralMixAvgPurchasedFeedMilesTruckedToDairy * averageCostOfTruckingPerTonMile;
    const purchasedCustomMineralMixTotalCost = customMineralMixCostOfCommodity + customMineralMixCostOfTrucking;

    // Growth Forage Trucking Costs
    const cornSilageGrownForageTruckingCost =
      cornSilageTonsProduced *
      cornSilageAvgGrownForageMilesTruckedToDairy *
      averageCostOfTruckingPerTonMile;
    const sorghumSilageGrownForageTruckingCost =
      sorghumSilageTonsProduced *
      sorghumSilageAvgGrownForageMilesTruckedToDairy *
      averageCostOfTruckingPerTonMile;
    const smallGrainSilageGrownForageTruckingCost =
      smallGrainSilageTonsProduced *
      smallGrainSilageAvgGrownForageMilesTruckedToDairy *
      averageCostOfTruckingPerTonMile;
    const grassHayGrownForageTruckingCost =
      grassHayTonsProduced *
      grassHayAvgGrownForageMilesTruckedToDairy *
      averageCostOfTruckingPerTonMile;
    const alfalfaHayGrownForageTruckingCost =
      alfalfaHayTonsProduced *
      alfalfaHayAvgGrownForageMilesTruckedToDairy *
      averageCostOfTruckingPerTonMile;

    // Outputs calculated and rounded to 2 decimal points
    const updatedOutputDocument = {
      // Feed Requirements and Production
      cornSilageTonsRequired: Number(cornSilageTonsRequired.toFixed(2)),
      cornSilageTonsProduced: Number(cornSilageTonsProduced.toFixed(2)),
      cornSilageBalanceToBePurchasedOrSold: Number(cornSilageBalanceToBePurchasedOrSold.toFixed(2)),

      sorghumSilageTonsRequired: Number(sorghumSilageTonsRequired.toFixed(2)),
      sorghumSilageTonsProduced: Number(sorghumSilageTonsProduced.toFixed(2)),
      sorghumSilageBalanceToBePurchasedOrSold: Number(sorghumSilageBalanceToBePurchasedOrSold.toFixed(2)),

      smallGrainSilageTonsRequired: Number(smallGrainSilageTonsRequired.toFixed(2)),
      smallGrainSilageTonsProduced: Number(smallGrainSilageTonsProduced.toFixed(2)),
      smallGrainSilageBalanceToBePurchasedOrSold: Number(smallGrainSilageBalanceToBePurchasedOrSold.toFixed(2)),
      
      grassHayTonsRequired: Number(grassHayTonsRequired.toFixed(2)),
      grassHayTonsProduced: Number(grassHayTonsProduced.toFixed(2)),
      grassHayBalanceToBePurchasedOrSold: Number(grassHayBalanceToBePurchasedOrSold.toFixed(2)),
      
      alfalfaHayTonsRequired: Number(alfalfaHayTonsRequired.toFixed(2)),
      alfalfaHayTonsProduced: Number(alfalfaHayTonsProduced.toFixed(2)),
      alfalfaHayBalanceToBePurchasedOrSold: Number(alfalfaHayBalanceToBePurchasedOrSold.toFixed(2)),

      // Other Feed Requirements
      peanutHullsTonsRequired: Number(peanutHullsTonsRequired.toFixed(2)),
      applePomaceTonsRequired: Number(applePomaceTonsRequired.toFixed(2)),
      distillersGrainTonsRequired: Number(distillersGrainTonsRequired.toFixed(2)),

      brewersGrainTonsRequired: Number(brewersGrainTonsRequired.toFixed(2)),
      citrusPulpTonsRequired: Number(citrusPulpTonsRequired.toFixed(2)),
      cornGlutenTonsRequired: Number(cornGlutenTonsRequired.toFixed(2)),
      wholeCottonseedTonsRequired: Number(wholeCottonseedTonsRequired.toFixed(2)),
      soybeanMeal48TonsRequired: Number(soybeanMeal48TonsRequired.toFixed(2)),
      customFeedMixTonsRequired: Number(customFeedMixTonsRequired.toFixed(2)),
      customMineralMixTonsRequired: Number(customMineralMixTonsRequired.toFixed(2)),

      // Total Variable Costs
      cornSilageTVC: Number(cornSilageTVC.toFixed(2)),
      cornSilageTVCPerTon: Number(cornSilageTVCPerTon.toFixed(2)),
      sorghumSilageTVC: Number(sorghumSilageTVC.toFixed(2)),
      sorghumSilageTVCPerTon: Number(sorghumSilageTVCPerTon.toFixed(2)),
      smallGrainSilageTVC: Number(smallGrainSilageTVC.toFixed(2)),
      smallGrainSilageTVCPerTon: Number(smallGrainSilageTVCPerTon.toFixed(2)),
      grassHayTVC: Number(grassHayTVC.toFixed(2)),
      grassHayTVCPerTon: Number(grassHayTVCPerTon.toFixed(2)),
      alfalfaHayEstablishmentTVC: Number(alfalfaHayEstablishmentTVC.toFixed(2)),
      alfalfaHayEstablishmentTVCPerTon: Number(alfalfaHayEstablishmentTVCPerTon.toFixed(2)),
      alfalfaHayStandTVC: Number(alfalfaHayStandTVC.toFixed(2)),
      alfalfaHayStandTVCPerTon: Number(alfalfaHayStandTVCPerTon.toFixed(2)),

      // Fixed Costs
      cornSilageFixedCostAllocation: Number(
        cornSilageFixedCostAllocation.toFixed(2),
      ),
      cornSilageFixedCostPerTon: Number(cornSilageFixedCostPerTon.toFixed(2)),
      sorghumSilageFixedCostAllocation: Number(
        sorghumSilageFixedCostAllocation.toFixed(2),
      ),
      sorghumSilageFixedCostPerTon: Number(
        sorghumSilageFixedCostPerTon.toFixed(2),
      ),
      smallGrainSilageFixedCostAllocation: Number(
        smallGrainSilageFixedCostAllocation.toFixed(2),
      ),
      smallGrainSilageFixedCostPerTon: Number(
        smallGrainSilageFixedCostPerTon.toFixed(2),
      ),
      grassHayFixedCostAllocation: Number(
        grassHayFixedCostAllocation.toFixed(2),
      ),
      grassHayFixedCostPerTon: Number(grassHayFixedCostPerTon.toFixed(2)),
      alfalfaHayEstablishmentFixedCostAllocation: Number(
        alfalfaHayEstablishmentFixedCostAllocation.toFixed(2),
      ),
      alfalfaHayEstablishmentFixedCostPerTon: Number(
        alfalfaHayEstablishmentFixedCostPerTon.toFixed(2),
      ),
      alfalfaHayStandFixedCostAllocation: Number(
        alfalfaHayStandFixedCostAllocation.toFixed(2),
      ),
      alfalfaHayStandFixedCostPerTon: Number(
        alfalfaHayStandFixedCostPerTon.toFixed(2),
      ),

      // Total Costs
      cornSilageTotalCost: Number(cornSilageTotalCost.toFixed(2)),
      cornSilageTotalCostPerTon: Number(cornSilageTotalCostPerTon.toFixed(2)),
      sorghumSilageTotalCost: Number(sorghumSilageTotalCost.toFixed(2)),
      sorghumSilageTotalCostPerTon: Number(
        sorghumSilageTotalCostPerTon.toFixed(2),
      ),
      smallGrainSilageTotalCost: Number(smallGrainSilageTotalCost.toFixed(2)),
      smallGrainSilageTotalCostPerTon: Number(
        smallGrainSilageTotalCostPerTon.toFixed(2),
      ),
      grassHayTotalCost: Number(grassHayTotalCost.toFixed(2)),
      grassHayTotalCostPerTon: Number(grassHayTotalCostPerTon.toFixed(2)),
      alfalfaHayEstablishmentTotalCost: Number(
        alfalfaHayEstablishmentTotalCost.toFixed(2),
      ),
      alfalfaHayEstablishmentTotalCostPerTon: Number(
        alfalfaHayEstablishmentTotalCostPerTon.toFixed(2),
      ),
      alfalfaHayStandTotalCost: Number(alfalfaHayStandTotalCost.toFixed(2)),
      alfalfaHayStandTotalCostPerTon: Number(
        alfalfaHayStandTotalCostPerTon.toFixed(2),
      ),

      // Purchased Feed Expenses
      cornSilageTonsToBePurchased: Number(cornSilageTonsToBePurchased.toFixed(2)),
      cornSilageCostOfCommodity: Number(cornSilageCostOfCommodity.toFixed(2)),
      cornSilageCostOfTrucking: Number(cornSilageCostOfTrucking.toFixed(2)),
      purchasedCornSilageTotalCost: Number(purchasedCornSilageTotalCost.toFixed(2)),

      sorghumSilageTonsToBePurchased: Number(sorghumSilageTonsToBePurchased.toFixed(2)),
      sorghumSilageCostOfCommodity: Number(sorghumSilageCostOfCommodity.toFixed(2)),
      sorghumSilageCostOfTrucking: Number(sorghumSilageCostOfTrucking.toFixed(2)),
      purchasedSorghumSilageTotalCost: Number(purchasedSorghumSilageTotalCost.toFixed(2)),

      smallGrainSilageTonsToBePurchased: Number(smallGrainSilageTonsToBePurchased.toFixed(2)),
      smallGrainSilageCostOfCommodity: Number(smallGrainSilageCostOfCommodity.toFixed(2)),
      smallGrainSilageCostOfTrucking: Number(smallGrainSilageCostOfTrucking.toFixed(2)),
      purchasedSmallGrainSilageTotalCost: Number(purchasedSmallGrainSilageTotalCost.toFixed(2)),

      grassHayTonsToBePurchased: Number(grassHayTonsToBePurchased.toFixed(2)),
      grassHayCostOfCommodity: Number(grassHayCostOfCommodity.toFixed(2)),
      grassHayCostOfTrucking: Number(grassHayCostOfTrucking.toFixed(2)),
      purchasedGrassHayTotalCost: Number(purchasedGrassHayTotalCost.toFixed(2)),

      alfalfaHayTonsToBePurchased: Number(alfalfaHayTonsToBePurchased.toFixed(2)),
      alfalfaHayCostOfCommodity: Number(alfalfaHayCostOfCommodity.toFixed(2)),
      alfalfaHayCostOfTrucking: Number(alfalfaHayCostOfTrucking.toFixed(2)),
      purchasedAlfalfaHayTotalCost: Number(purchasedAlfalfaHayTotalCost.toFixed(2)),

      peanutHullsTonsToBePurchased: Number(peanutHullsTonsToBePurchased.toFixed(2)),
      peanutHullsCostOfCommodity: Number(peanutHullsCostOfCommodity.toFixed(2)),
      peanutHullsCostOfTrucking: Number(peanutHullsCostOfTrucking.toFixed(2)),
      purchasedPeanutHullsTotalCost: Number(purchasedPeanutHullsTotalCost.toFixed(2)),

      applePomaceNoHullsTonsToBePurchased: Number(applePomaceNoHullsTonsToBePurchased.toFixed(2)),
      applePomaceNoHullsCostOfCommodity: Number(applePomaceNoHullsCostOfCommodity.toFixed(2)),
      applePomaceNoHullsCostOfTrucking: Number(applePomaceNoHullsCostOfTrucking.toFixed(2)),
      purchasedApplePomaceNoHullsTotalCost: Number(purchasedApplePomaceNoHullsTotalCost.toFixed(2)),

      distillersGrainWetTonsToBePurchased: Number(distillersGrainWetTonsToBePurchased.toFixed(2)),
      distillersGrainWetCostOfCommodity: Number(distillersGrainWetCostOfCommodity.toFixed(2)),
      distillersGrainWetCostOfTrucking: Number(distillersGrainWetCostOfTrucking.toFixed(2)),
      purchasedDistillersGrainWetTotalCost: Number(purchasedDistillersGrainWetTotalCost.toFixed(2)),

      brewersGrainWetTonsToBePurchased: Number(brewersGrainWetTonsToBePurchased.toFixed(2)),
      brewersGrainWetCostOfCommodity: Number(brewersGrainWetCostOfCommodity.toFixed(2)),
      brewersGrainWetCostOfTrucking: Number(brewersGrainWetCostOfTrucking.toFixed(2)),
      purchasedBrewersGrainWetTotalCost: Number(purchasedBrewersGrainWetTotalCost.toFixed(2)),

      citrusPulpDryTonsToBePurchased: Number(citrusPulpDryTonsToBePurchased.toFixed(2)),
      citrusPulpDryCostOfCommodity: Number(citrusPulpDryCostOfCommodity.toFixed(2)),
      citrusPulpDryCostOfTrucking: Number(citrusPulpDryCostOfTrucking.toFixed(2)),
      purchasedCitrusPulpDryTotalCost: Number(purchasedCitrusPulpDryTotalCost.toFixed(2)),

      cornGlutenFeedTonsToBePurchased: Number(cornGlutenFeedTonsToBePurchased.toFixed(2)),
      cornGlutenFeedCostOfCommodity: Number(cornGlutenFeedCostOfCommodity.toFixed(2)),
      cornGlutenFeedCostOfTrucking: Number(cornGlutenFeedCostOfTrucking.toFixed(2)),
      purchasedCornGlutenFeedTotalCost: Number(purchasedCornGlutenFeedTotalCost.toFixed(2)),

      wholeCottonseedTonsToBePurchased: Number(wholeCottonseedTonsToBePurchased.toFixed(2)),
      wholeCottonseedCostOfCommodity: Number(wholeCottonseedCostOfCommodity.toFixed(2)),
      wholeCottonseedCostOfTrucking: Number(wholeCottonseedCostOfTrucking.toFixed(2)),
      purchasedWholeCottonseedTotalCost: Number(purchasedWholeCottonseedTotalCost.toFixed(2)),

      cottonseedHullsTonsToBePurchased: Number(cottonseedHullsTonsToBePurchased.toFixed(2)),
      cottonseedHullsCostOfCommodity: Number(cottonseedHullsCostOfCommodity.toFixed(2)),
      cottonseedHullsCostOfTrucking: Number(cottonseedHullsCostOfTrucking.toFixed(2)),
      purchasedCottonseedHullsTotalCost: Number(purchasedCottonseedHullsTotalCost.toFixed(2)),

      soybeanMeal48TonsToBePurchased: Number(soybeanMeal48TonsToBePurchased.toFixed(2)),
      soybeanMeal48CostOfCommodity: Number(soybeanMeal48CostOfCommodity.toFixed(2)),
      soybeanMeal48CostOfTrucking: Number(soybeanMeal48CostOfTrucking.toFixed(2)),
      purchasedSoybeanMeal48TotalCost: Number(purchasedSoybeanMeal48TotalCost.toFixed(2)),

      customFeedMixTonsToBePurchased: Number(customFeedMixTonsToBePurchased.toFixed(2)),
      customFeedMixCostOfCommodity: Number(customFeedMixCostOfCommodity.toFixed(2)),
      customFeedMixCostOfTrucking: Number(customFeedMixCostOfTrucking.toFixed(2)),
      purchasedCustomFeedMixTotalCost: Number(purchasedCustomFeedMixTotalCost.toFixed(2)),

      customMineralMixTonsToBePurchased: Number(customMineralMixTonsToBePurchased.toFixed(2)),
      customMineralMixCostOfCommodity: Number(customMineralMixCostOfCommodity.toFixed(2)),
      customMineralMixCostOfTrucking: Number(customMineralMixCostOfTrucking.toFixed(2)),
      purchasedCustomMineralMixTotalCost: Number(purchasedCustomMineralMixTotalCost.toFixed(2)),


      // Grown Forage Trucking Cost
      cornSilageGrownForageTruckingCost: Number(
        cornSilageGrownForageTruckingCost.toFixed(2),
      ),
      sorghumSilageGrownForageTruckingCost: Number(
        sorghumSilageGrownForageTruckingCost.toFixed(2),
      ),
      smallGrainSilageGrownForageTruckingCost: Number(
        smallGrainSilageGrownForageTruckingCost.toFixed(2),
      ),
      grassHayGrownForageTruckingCost: Number(
        grassHayGrownForageTruckingCost.toFixed(2),
      ),
      alfalfaHayGrownForageTruckingCost: Number(alfalfaHayGrownForageTruckingCost.toFixed(2))
    };

    try {
      const result = await this.feedDetailsOutputModel.findOneAndUpdate(
        { userId },
        { $set: updatedOutputDocument },
        { new: true, upsert: true },
      );

      this.logger.log(
        `Successfully calculated and updated feed details output for user: ${userId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to calculate feed details output: ${error.message}`,
      );
      throw new Error(
        `Failed to calculate feed details output: ${error.message}`,
      );
    }

  }

  async getFeedDetailsOutput(email: string): Promise<FeedDetailsOutput | null> {
    //first find the user_id using the email, then find the document using the id
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();

    const outputDocument = await this.feedDetailsOutputModel
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

  async getFeedDetailsInput(email: string): Promise<FeedDetailsInput | null> {
    console.log("Called feed details input");
    
    //first find the user_id using the email, then find the document using the id
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();
    const inputDocument = this.feedDetailsInputModel.findOne({ userId }).exec();

    if (!inputDocument) {
      throw new HttpException(
        'Input record for this user not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return inputDocument;
  }
}
