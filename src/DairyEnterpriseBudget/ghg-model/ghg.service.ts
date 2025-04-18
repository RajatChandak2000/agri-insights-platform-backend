import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GHGInput } from '../schemas/inputs/ghg-input.schema';
import { GHGOutput } from '../schemas/outputs/ghg-output.schema';
import { FeedDetailsInput } from '../schemas/inputs/FeedDetailsInput.schema';
import { ProductionDetailsInput } from '../schemas/inputs/ProductionDetailsInput.schema';
import { FeedDetailsOutput } from '../schemas/outputs/FeedDetailsOutput.schema';
import { GHGInputDto } from '../dto/ghg-model.dto';
import { User } from 'src/user/schemas/user.schema';
import { ProductionDetailsOutput } from '../schemas/outputs/ProductionDetailsOutput.schema';

@Injectable()
export class GHGService {
  private readonly logger = new Logger(GHGService.name);

  // Dry matter percentages (decimal)
  private readonly DRY_MATTER_PERCENTAGES = {
    cornSilage: 0.325,
    sorghumSilage: 0.284,
    smallGrain: 0.871,
    grassHay: 0.915,
    alfalfa: 0.894,
    peanutHulls: 0.916,
    applePomace: 0.912,
    distillers: 0.89,
    brewers: 0.91,
    citrusPulp: 0.903,
    cornGluten: 0.883,
    wholeCottonseed: 0.923,
    cottonseedHulls: 0.906,
    soybean48: 0.88,
    soyHulls: 0.891,
    customGrainMix: 0.89
  };

  private readonly characterizationFactors = {
    cornSilage: 0.26,
    sorghumSilage: 0.28,
    smallGrain: 0.26,
    grassHay: 0.47,
    alfalfa: 0.27,
    peanutHulls: 0.91,
    applePomace: 0.91,
    distillers: 0.67,
    brewers: 0.67,
    citrusPulp: 0.91,
    cornGluten: 0.44,
    wholeCottonseed: 0.59,
    cottonseedHulls: 0.91,
    soybean48: 0.54,
    soyHulls: 0.587,
    customGrainMix: 0.59
  };

  private readonly ENTERIC_FACTOR = 0.46; // from GHG model doc

  constructor(
    @InjectModel(GHGInput.name) private ghgInputModel: Model<GHGInput>,
    @InjectModel(GHGOutput.name) private ghgOutputModel: Model<GHGOutput>,
    @InjectModel(FeedDetailsInput.name)
    private feedDetailsModel: Model<FeedDetailsInput>,
    @InjectModel(ProductionDetailsInput.name)
    private productionDetailsModel: Model<ProductionDetailsInput>,
    @InjectModel(ProductionDetailsOutput.name)
    private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
    @InjectModel(FeedDetailsOutput.name)
    private feedDetailsOutputModel: Model<FeedDetailsOutput>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateInput(email: string, updateDto: GHGInputDto) {
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
      const updatedDocument = await this.ghgInputModel.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, upsert: true },
      );

      if (!updatedDocument) {
        this.logger.warn(`User not found: ${userId}`);
        throw new Error('User not found');
      }

      this.logger.log(`Successfully updated inputs for user: ${userId}`);

      // Recalculate GHG metrics and update GHGOutput
      return await this.calculateGHGMetrics(userId, updatedDocument);
    } catch (error) {
      this.logger.error(`Failed to update user inputs: ${error.message}`);
      throw new Error(`Failed to update user inputs: ${error.message}`);
    }
  }

  /**
   * Calculates the GHG metrics and saves them to the GHGOutput schema.
   */
  async calculateGHGMetrics(
    userId: string,
    ghgInputs: GHGInputDto,
  ): Promise<GHGOutput> {
    const [feedDetails, productionDetails, productionDetailsOutputs,feedOutput] = await Promise.all([
      this.feedDetailsModel.findOne({ userId }).lean().exec(),
      this.productionDetailsModel.findOne({ userId }).lean().exec(),
      this.productionDetailsOutputModel.findOne({userId}).lean().exec(),
      this.feedDetailsOutputModel.findOne({ userId }).lean().exec(),
    ]);
  
    if (!feedDetails || !productionDetails || !feedOutput) {
      throw new Error('Required input data not found for GHG calculation.');
    }

    console.log("feedDetails.milkingHerd ", feedDetails.milkingHerd);
  
    // 1. Calculate FPCM
    const totalMilkProduced =productionDetailsOutputs.totalAnnualMilkProduction*100;
    const annualFPCM = this.calculateFPCM(
      totalMilkProduced,
      ghgInputs.fatPercentage,
      ghgInputs.proteinPercentage,
    );
  

    console.log("Annual FPCM : ",annualFPCM)
    // 2. Herd population counts
    const herdCounts = this.getHerdPopulationCounts(productionDetails,productionDetailsOutputs);
    console.log("herdCounts ", herdCounts);
  
    // 3. Herd total DMI for each feed type
    const herdTotalDMI = this.calculateTotalDMI(feedDetails, herdCounts);
    console.log("herdTotalDMI ", herdTotalDMI);

    // 4. Herd Group DMI for each feed type
    const herdDMIGroup = this.calculateDMIGroup(feedDetails, herdCounts);
    console.log("herdDMIGroup ", herdDMIGroup);
  
    // 5. Calculate feed, enteric, trucking emissions
    const feedEmissions = this.calculateFeedEmissions(
      herdTotalDMI,
      this.characterizationFactors,
      annualFPCM,
    );
    const entericEmissions = this.calculateEntericEmissions(
      herdTotalDMI,
      annualFPCM,
    );
    const truckingEmissions = this.calculateTruckingEmissions(
      feedDetails,
      feedOutput,
      ghgInputs.averageUSTruckingEmissions,
      annualFPCM,
    );
  
    // 6. Build the update object for the GHGOutput doc
    const updateData = {
      userId,
      annualFPCM: Number(annualFPCM.toFixed(2)),

      // Totals
      ghgFeedTotal: Number(feedEmissions.ghgFeedTotal.toFixed(2)),
      ghgFeedTotalPerFPCM: Number(feedEmissions.ghgFeedTotalPerFPCM.toFixed(2)),
      totalEntericEmissions: Number(entericEmissions.totalEntericEmissions.toFixed(2)),
      totalEntericEmissionsPerFPCM: Number(entericEmissions.totalEntericEmissionsPerFPCM.toFixed(2)),
      totalTruckingEmissions: Number(truckingEmissions.totalTruckingEmissions.toFixed(2)),
      ghgTruckingFootprint: Number(truckingEmissions.ghgTruckingFootprint.toFixed(2)),
  
      // HerdTotalDMI sub-object
      herdTotalDMI: this.buildHerdTotalDMIObject(herdTotalDMI),

      //HerdGroupDMI sub-object
      herdDMIGroup: this.buildHerdDMIGroupObject(herdDMIGroup),
  
      // Nested objects
      feedGHGEmissions: this.buildFeedGHGEmissionsObject(feedEmissions),
      entericEmissions: this.buildEntericEmissionsObject(entericEmissions),
      truckingEmissions: this.buildTruckingEmissionsObject(truckingEmissions),
    };
  
    // Define options for findOneAndUpdate
    const options = {
      new: true,               // Return the updated document.
      upsert: true,            // Create the document if it doesn't exist.
      setDefaultsOnInsert: true, // Apply default schema values on insert.
    };
  
    try {
      const result = await this.ghgOutputModel.findOneAndUpdate(
        { userId },
        { $set: updateData },
        options,
      ).exec();
  
      this.logger.log(
        `Successfully calculated and updated GHG output for user: ${userId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to calculate GHG output: ${error.message}`,
      );
      throw new Error(`Failed to calculate GHG output: ${error.message}`);
    }
  }  

  private calculateFPCM(
    totalMilk: number,
    fatPercentage: number,
    proteinPercentage: number,
  ): number {
    return (
      totalMilk *
      (0.1226 * (fatPercentage / 100) +
        0.0776 * (proteinPercentage / 100) +
        0.2534)
    );
  }

  private getHerdPopulationCounts(
    productionDetails: ProductionDetailsInput, productionDetailsOutputs: ProductionDetailsOutput
  ): { lactating: number; dry: number; replacements: number; young: number } {
    // 15% dry

    const numberOfHeifersRaised = productionDetails.heiferProduction.numberOfHeifersRaised;
    const numberOfLactationsPerYear = productionDetailsOutputs.numberOfLactationsPerYear;
    const numberOfMilkingCowsOnFeed = Math.round(numberOfLactationsPerYear);
    const numberOfDryCowsOnFeed = Math.round(numberOfLactationsPerYear);
    const numberOfBredHeifersCowsOnFeed = numberOfHeifersRaised;
    const numberOfYoungHeifersCowsOnFeed = numberOfHeifersRaised;


  

    const totalCows = productionDetails.milkProduction.totalNumberOfCows;
    const totalHeifersRaised =
      productionDetails.heiferProduction.numberOfHeifersRaised;

    return {
      lactating: numberOfMilkingCowsOnFeed,
      dry: numberOfMilkingCowsOnFeed,
      replacements: numberOfYoungHeifersCowsOnFeed,
      young: numberOfYoungHeifersCowsOnFeed,
    };
  }

  private calculateTotalDMI(
    feedDetails: FeedDetailsInput,
    herdCounts: ReturnType<typeof this.getHerdPopulationCounts>,
  ): Record<string, number> {
    const herdGroups = [
      { key: 'milkingHerd', count: herdCounts.lactating },
      { key: 'dryHerd', count: herdCounts.dry },
      { key: 'bredHeifers', count: herdCounts.replacements },
      { key: 'youngHeifers', count: herdCounts.young },
    ];

    const dmiResults: Record<string, number> = {};

    for (const feedType of Object.keys(this.DRY_MATTER_PERCENTAGES)) {
      dmiResults[feedType] = 0;

      for (const group of herdGroups) {
        const feedKey = this.getFeedKey(feedType, group.key);
        const lbsPerDay = feedDetails[group.key]?.[`${group.key}${feedKey}LbsAsFedPerDay`] || 0;
        const daysOnFeed = feedDetails[group.key]?.[`${group.key}${feedKey}DaysOnFeed`] || 0;
        
        const dmPercentage = this.DRY_MATTER_PERCENTAGES[feedType];
        const totalGroupDMI = lbsPerDay * daysOnFeed * dmPercentage * group.count;

        dmiResults[feedType] += totalGroupDMI;
      }
    }

    return dmiResults;
  }

  private calculateDMIGroup(
    feedDetails: FeedDetailsInput,
    herdCounts: ReturnType<typeof this.getHerdPopulationCounts>
  ): Record<string, Record<string, number>> {
    const herdGroups = [
      { key: 'milkingHerd', count: herdCounts.lactating },
      { key: 'dryHerd', count: herdCounts.dry },
      { key: 'bredHeifers', count: herdCounts.replacements },
      { key: 'youngHeifers', count: herdCounts.young },
    ];
  
    const dmiGroupResults: Record<string, Record<string, number>> = {};
  
    // For each feed type (e.g. "cornSilage", "sorghumSilage", etc.)
    for (const feedType of Object.keys(this.DRY_MATTER_PERCENTAGES)) {
      // Initialize the inner object for each feed type.
      dmiGroupResults[feedType] = {};
  
      // For each herd group, calculate the DMI individually.
      for (const group of herdGroups) {
        // Assuming getFeedKey uses both feedType and group.key to generate the proper key
        const feedKey = this.getFeedKey(feedType, group.key);
        const lbsPerDay =
          feedDetails[group.key]?.[`${group.key}${feedKey}LbsAsFedPerDay`] || 0;
        const daysOnFeed =
          feedDetails[group.key]?.[`${group.key}${feedKey}DaysOnFeed`] || 0;
  
        const dmPercentage = this.DRY_MATTER_PERCENTAGES[feedType];
        const totalGroupDMI = lbsPerDay * daysOnFeed * dmPercentage * group.count;
  
        // Store the computed value for this herd group.
        dmiGroupResults[feedType][group.key] = totalGroupDMI;
      }
    }
  
    return dmiGroupResults;
  }

  private getFeedKey(feedType: string, herdGroup: string): string {
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
      soyHulls: 'SoyHulls',
    };

    return feedMap[feedType] || feedType;
  }

  private calculateFeedEmissions(
    herdTotalDMI: Record<string, number>,
    factors: Record<string, number>,
    annualFPCM: number,
  ) {
    const emissions: Record<string, number> = {
      ghgFeedTotal: 0,
      ghgFeedTotalPerFPCM: 0,
    };

    for (const feedType of Object.keys(herdTotalDMI)) {
      const dmi = herdTotalDMI[feedType] || 0;
      const factor = factors[feedType] || 0;

      const feedEmissionValue = dmi * factor;
      const feedEmissionPerFPCM = annualFPCM ? feedEmissionValue / annualFPCM : 0;

      emissions[`${feedType}FeedEmissions`] = feedEmissionValue;
      emissions[`${feedType}FeedEmissionsPerFPCM`] = feedEmissionPerFPCM;

      emissions.ghgFeedTotal += feedEmissionValue;
    }

    emissions.ghgFeedTotalPerFPCM = annualFPCM ? emissions.ghgFeedTotal / annualFPCM: 0;

    return emissions;
  }

  private calculateEntericEmissions(
    herdTotalDMI: Record<string, number>,
    annualFPCM: number,
  ) {
    const emissions: Record<string, number> = {
      totalEntericEmissions: 0,
      totalEntericEmissionsPerFPCM: 0,
    };

    for (const feedType of Object.keys(herdTotalDMI)) {
      const dmi = herdTotalDMI[feedType] || 0;
      const entericVal = dmi * this.ENTERIC_FACTOR;
      const entericPerFPCM = annualFPCM ? entericVal / annualFPCM : 0;

      emissions[`${feedType}EntericEmissions`] = entericVal;
      emissions[`${feedType}EntericEmissionsPerFPCM`] = entericPerFPCM;

      emissions.totalEntericEmissions += entericVal;
    }

    emissions.totalEntericEmissionsPerFPCM = annualFPCM
      ? emissions.totalEntericEmissions / annualFPCM
      : 0;

    return emissions;
  }

  private calculateTruckingEmissions(
    feedDetails: FeedDetailsInput,
    feedOutput: FeedDetailsOutput,
    emissionFactor: number,
    annualFPCM: number,
  ) {
    const emissions: Record<string, number> = {
      totalTruckingEmissions: 0,
      ghgTruckingFootprint: 0,
    };

    // same feed types
    const feedTypes = Object.keys(this.DRY_MATTER_PERCENTAGES);
    console.log("Calcualting trucking emmisions !")

    for (const feedType of feedTypes) {
      const transportKey = this.getTransportKey(feedType);
      const transportData =
        (feedDetails as any)[`${transportKey}TransportAndCost`] || {};

      const tonsProduced = (feedOutput as any)[`${feedType}TonsProduced`] || 0;
      let tonsPurchased =
        (feedOutput as any)[`${feedType}TonsToBePurchased`] || 0;
        console.log("Feedtype : " ,feedType)
        console.log("Tons Purchsed : " ,tonsPurchased)
      
        if (tonsPurchased<0){
          console.log("I am less than 0!!")
          tonsPurchased=0;
        }

      const grownMiles =
        transportData[`${transportKey}AvgGrownForageMilesTruckedToDairy`] || 0;
      const purchasedMiles =
        transportData[`${transportKey}AvgPurchasedFeedMilesTruckedToDairy`] ||
        0;

      const grownEmissions = tonsProduced * grownMiles * emissionFactor;
      const purchasedEmissions = tonsPurchased * purchasedMiles * emissionFactor;
      const totalEmissions = grownEmissions + purchasedEmissions;

      emissions[`${feedType}TruckingEmissions`] = totalEmissions;
      emissions.totalTruckingEmissions += totalEmissions;
    }

    emissions.ghgTruckingFootprint = annualFPCM
      ? emissions.totalTruckingEmissions / annualFPCM
      : 0;

    return emissions;
  }

  private getTransportKey(feedType: string): string {
    const transportMap: Record<string, string> = {
      cornSilage: 'cornSilage',
      sorghumSilage: 'sorghumSilage',
      smallGrain: 'smallGrainSilage',
      grassHay: 'grassHay',
      alfalfa: 'alfalfaHay',
      peanutHulls: 'peanutHulls',
      applePomace: 'applePomace',
      distillers: 'distillersGrainWet',
      brewers: 'brewersGrainWet',
      citrusPulp: 'citrusPulp',
      cornGluten: 'cornGluten',
      wholeCottonseed: 'wholeCottonseed',
      cottonseedHulls: 'cottonseedHulls',
      soybean48: 'soybeanMeal',
      soyHulls: 'soyHulls',
    };

    return transportMap[feedType] || feedType;
  }

  /**
   * Build the "herdTotalDMI" object matching the HerdTotalDMI sub-schema
   */
  private buildHerdTotalDMIObject(
    dmiResults: Record<string, number>,
  ): Record<string, number> {
    return {
      cornSilageDMI: dmiResults.cornSilage ?? 0,
      sorghumSilageDMI: dmiResults.sorghumSilage ?? 0,
      smallGrainDMI: dmiResults.smallGrain ?? 0,
      grassHayDMI: dmiResults.grassHay ?? 0,
      alfalfaDMI: dmiResults.alfalfa ?? 0,
      peanutHullsDMI: dmiResults.peanutHulls ?? 0,
      applePomaceDMI: dmiResults.applePomace ?? 0,
      distillersDMI: dmiResults.distillers ?? 0,
      brewersDMI: dmiResults.brewers ?? 0,
      citrusPulpDMI: dmiResults.citrusPulp ?? 0,
      cornGlutenDMI: dmiResults.cornGluten ?? 0,
      wholeCottonseedDMI: dmiResults.wholeCottonseed ?? 0,
      cottonseedHullsDMI: dmiResults.cottonseedHulls ?? 0,
      soybean48DMI: dmiResults.soybean48 ?? 0,
      soyHulls: dmiResults.soyHulls ?? 0,
      customGrainMix: dmiResults.customGrainMix ?? 0
    };
  }

  private buildHerdDMIGroupObject(
    dmiGroupResults: Record<string, Record<string, number>>
  ): Record<string, Record<string, number>> {
    // Initialize the result object with empty objects for each herd group.
    const result: Record<string, Record<string, number>> = {
      milkingHerd: {},
      dryHerd: {},
      bredHeifers: {},
      youngHeifers: {},
    };
  
    // For each feed type in the dmiGroupResults,
    // store its computed DMI for each herd group into the corresponding object.
    for (const feedType in dmiGroupResults) {
      const groupValues = dmiGroupResults[feedType];
      // Use the feed type plus 'DMI' as the property key.
      result.milkingHerd[`${feedType}DMI`] = groupValues.milkingHerd ?? 0;
      result.dryHerd[`${feedType}DMI`] = groupValues.dryHerd ?? 0;
      result.bredHeifers[`${feedType}DMI`] = groupValues.bredHeifers ?? 0;
      result.youngHeifers[`${feedType}DMI`] = groupValues.youngHeifers ?? 0;
    }
  
    return result;
  }
  

  private buildFeedGHGEmissionsObject(
    feedEmissions: Record<string, number>,
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const key of Object.keys(feedEmissions)) {
      if (key.endsWith('FeedEmissions') || key.endsWith('FeedEmissionsPerFPCM')) {
        result[key] = feedEmissions[key];
      }
    }
    return result;
  }

  private buildEntericEmissionsObject(
    enteric: Record<string, number>,
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const key of Object.keys(enteric)) {
      if (
        key.endsWith('EntericEmissions') ||
        key.endsWith('EntericEmissionsPerFPCM')
      ) {
        result[key] = enteric[key];
      }
    }
    return result;
  }

  private buildTruckingEmissionsObject(
    trucking: Record<string, number>,
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const key of Object.keys(trucking)) {
      if (key.endsWith('TruckingEmissions')) {
        result[key] = trucking[key];
      }
    }
    return result;
  }

  async getGHGInput(email: string): Promise<GHGInput | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const userId = user._id.toString();

    const inputDocument = await this.ghgInputModel.findOne({ userId }).exec();
    if (!inputDocument) {
      throw new HttpException(
        'Input record for this user not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return inputDocument;
  }

  async getGHGResults(email: string): Promise<GHGOutput> {
    //first find the user_id using the email, then find the document using the id
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();
    console.log('userId ', userId);

    
    const results = await this.ghgOutputModel.findOne({ userId }).exec();
    if (!results) {
      throw new Error('GHG results not found');
    }
    return results;
  }
}
