import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GHGInput } from '../schemas/inputs/ghg-input.schema';
import { GHGOutput } from '../schemas/outputs/ghg-output.schema';
import { FeedDetailsInput } from '../schemas/inputs/FeedDetailsInput.schema';
import { ProductionDetailsInput } from '../schemas/inputs/ProductionDetailsInput.schema';
import { FeedDetailsOutput } from '../schemas/outputs/FeedDetailsOutput.schema';



export interface GHGCalculationInputs {
    fpcmInputs: {
      fatPercentage: number;
      proteinPercentage: number;
    };
    characterizationFactors: {
      [key: string]: number;
    };
    averageUSTruckingEmissions: number;
  }
  
  export interface FeedEmissions {
    ghgFeedTotal: number;
    ghgFeedTotalPerFPCM: number;
    [key: string]: number; // Allows dynamic feed type emissions properties
  }
  
  export interface EntericEmissions {
    totalEntericEmissions: number;
    totalEntericEmissionsPerFPCM: number;
    [key: string]: number; // Allows dynamic feed type emissions properties
  }
  
  export interface TruckingEmissions {
    totalTruckingEmissions: number;
    ghgTruckingFootprint: number;
    [key: string]: number; // Allows dynamic feed type emissions properties
  }
  
@Injectable()
export class GHGService {
  // Dry matter percentages from nutrition table (as decimal)
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
  };

  private readonly ENTERIC_FACTOR = 0.46; // From GHG model document

  constructor(
    @InjectModel(GHGInput.name) private ghgInputModel: Model<GHGInput>,
    @InjectModel(GHGOutput.name) private ghgOutputModel: Model<GHGOutput>,
    @InjectModel(FeedDetailsInput.name)
    private feedDetailsModel: Model<FeedDetailsInput>,
    @InjectModel(ProductionDetailsInput.name)
    private productionDetailsModel: Model<ProductionDetailsInput>,
    @InjectModel(FeedDetailsOutput.name)
    private feedDetailsOutputModel: Model<FeedDetailsOutput>,
  ) {}

  async calculateGHGMetrics(
    userId: string,
    ghgInputs: GHGCalculationInputs,
  ): Promise<GHGOutput> {
    const [feedDetails, productionDetails, feedOutput] = await Promise.all([
      this.feedDetailsModel.findOne({ userId }).lean().exec(),
      this.productionDetailsModel.findOne({ userId }).lean().exec(),
      this.feedDetailsOutputModel.findOne({ userId }).lean().exec(),
    ]);

    if (!feedDetails || !productionDetails || !feedOutput) {
      throw new Error('Required input data not found');
    }

    // Calculate FPCM
    const totalMilkProduced =
      productionDetails.milkProduction.expectedMilkProduction * 100;
    const annualFPCM = this.calculateFPCM(
      totalMilkProduced,
      ghgInputs.fpcmInputs.fatPercentage,
      ghgInputs.fpcmInputs.proteinPercentage,
    );

    // Get herd population counts with explicit assumptions
    const herdCounts = this.getHerdPopulationCounts(productionDetails);

    // Calculate DMI for each feed type across all herd groups
    const herdTotalDMI = this.calculateTotalDMI(feedDetails, herdCounts);

    // Calculate emissions
    const feedEmissions = this.calculateFeedEmissions(
      herdTotalDMI,
      ghgInputs.characterizationFactors,
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

    // Create and save GHG output
    const ghgOutput = new this.ghgOutputModel({
      userId,
      annualFPCM,
      ...feedEmissions,
      ...entericEmissions,
      ...truckingEmissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return ghgOutput.save();
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
    productionDetails: ProductionDetailsInput,
  ): { lactating: number; dry: number; replacements: number; young: number } {
    // ASSUMPTION MADE: Dry cows represent 15% of total milking herd
    const DRY_COW_PERCENTAGE = 0.15;
    
    // ASSUMPTION MADE: Replacements are 70% of raised heifers, young are 30%
    const REPLACEMENT_HEIFER_SPLIT = 0.7;

    const totalCows = productionDetails.milkProduction.totalNumberOfCows;
    const totalHeifersRaised =
      productionDetails.heiferProduction.numberOfHeifersRaised;

    return {
      lactating: Math.round(totalCows * (1 - DRY_COW_PERCENTAGE)),
      dry: Math.round(totalCows * DRY_COW_PERCENTAGE),
      replacements: Math.round(totalHeifersRaised * REPLACEMENT_HEIFER_SPLIT),
      young: Math.round(totalHeifersRaised * (1 - REPLACEMENT_HEIFER_SPLIT)),
    };
  }

  private calculateTotalDMI(
    feedDetails: FeedDetailsInput,
    herdCounts: ReturnType<typeof this.getHerdPopulationCounts>,
  ): Record<string, number> {
    const herdGroups = [
      {
        key: 'milkingHerd',
        count: herdCounts.lactating,
        populationSource: 'totalNumberOfCows',
      },
      {
        key: 'dryHerd',
        count: herdCounts.dry,
        populationSource: 'totalNumberOfCows',
      },
      {
        key: 'bredHeifers',
        count: herdCounts.replacements,
        populationSource: 'numberOfHeifersRaised',
      },
      {
        key: 'youngHeifers',
        count: herdCounts.young,
        populationSource: 'numberOfHeifersRaised',
      },
    ];

    const dmiResults: Record<string, number> = {};

    Object.keys(this.DRY_MATTER_PERCENTAGES).forEach((feedType) => {
      dmiResults[feedType] = herdGroups.reduce((total, herdGroup) => {
        const feedKey = this.getFeedKey(feedType, herdGroup.key);
        const lbsPerDay = feedDetails[herdGroup.key]?.[`${feedKey}LbsAsFedPerDay`] || 0;
        const daysOnFeed = feedDetails[herdGroup.key]?.[`${feedKey}DaysOnFeed`] || 0;
        const dmPercentage = this.DRY_MATTER_PERCENTAGES[feedType];

        return (
          total +
          lbsPerDay * daysOnFeed * dmPercentage * herdGroup.count
        );
      }, 0);
    });

    return dmiResults;
  }

  private getFeedKey(feedType: string, herdGroup: string): string {
    // ASSUMPTION MADE: Mapping between feed types and schema property names
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

    return feedMap[feedType] || feedType;
  }

  private calculateFeedEmissions(
    herdTotalDMI: Record<string, number>,
    factors: Record<string, number>,
    annualFPCM: number,
  ): FeedEmissions {
    const emissions: FeedEmissions = {
      ghgFeedTotal: 0,
      ghgFeedTotalPerFPCM: 0,
    };

    Object.entries(herdTotalDMI).forEach(([feedType, dmi]) => {
      const factorKey = `${feedType}CharacterizationFactor`;
      const emissionsVal = dmi * (factors[factorKey] || 0);
      const perFPCM = emissionsVal / annualFPCM;

      emissions[`${feedType}FeedEmissions`] = emissionsVal;
      emissions[`${feedType}FeedEmissionsPerFPCM`] = perFPCM;
      emissions.ghgFeedTotal += emissionsVal;
    });

    emissions.ghgFeedTotalPerFPCM = emissions.ghgFeedTotal / annualFPCM;
    return emissions;
  }

  private calculateEntericEmissions(
    herdTotalDMI: Record<string, number>,
    annualFPCM: number,
  ): EntericEmissions {
    const emissions: EntericEmissions = {
      totalEntericEmissions: 0,
      totalEntericEmissionsPerFPCM: 0,
    };

    Object.entries(herdTotalDMI).forEach(([feedType, dmi]) => {
      const emissionsVal = dmi * this.ENTERIC_FACTOR;
      const perFPCM = emissionsVal / annualFPCM;

      emissions[`${feedType}EntericEmissions`] = emissionsVal;
      emissions[`${feedType}EntericEmissionsPerFPCM`] = perFPCM;
      emissions.totalEntericEmissions += emissionsVal;
    });

    emissions.totalEntericEmissionsPerFPCM =
      emissions.totalEntericEmissions / annualFPCM;
    return emissions;
  }

  private calculateTruckingEmissions(
    feedDetails: FeedDetailsInput,
    feedOutput: FeedDetailsOutput,
    emissionFactor: number,
    annualFPCM: number,
  ): TruckingEmissions {
    const emissions: TruckingEmissions = {
      totalTruckingEmissions: 0,
      ghgTruckingFootprint: 0,
    };

    const feedTypes = [
      'cornSilage',
      'sorghumSilage',
      'smallGrain',
      'grassHay',
      'alfalfa',
      'peanutHulls',
      'applePomace',
      'distillers',
      'brewers',
      'citrusPulp',
      'cornGluten',
      'wholeCottonseed',
      'cottonseedHulls',
      'soybean48',
    ];

    feedTypes.forEach((feedType) => {
      const transportKey = this.getTransportKey(feedType);
      const transportData = feedDetails[`${transportKey}TransportAndCost`] || {};
      
      // ASSUMPTION MADE: Fallback to 0 if values not found
      const tonsProduced = feedOutput[`${feedType}TonsProduced`] || 0;
      const tonsPurchased = feedOutput[`${feedType}TonsToBePurchased`] || 0;
      const grownMiles = transportData[`${transportKey}AvgGrownForageMilesTruckedToDairy`] || 0;
      const purchasedMiles = transportData[`${transportKey}AvgPurchasedFeedMilesTruckedToDairy`] || 0;

      const grownEmissions = tonsProduced * grownMiles * emissionFactor;
      const purchasedEmissions = tonsPurchased * purchasedMiles * emissionFactor;
      const totalEmissions = grownEmissions + purchasedEmissions;

      emissions[`${feedType}TruckingEmissions`] = totalEmissions;
      emissions.totalTruckingEmissions += totalEmissions;
    });

    emissions.ghgTruckingFootprint = emissions.totalTruckingEmissions / annualFPCM;
    return emissions;
  }

  private getTransportKey(feedType: string): string {
    // ASSUMPTION MADE: Transportation key mapping
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
    };

    return transportMap[feedType] || feedType;
  }

  async getGHGResults(userId: string): Promise<GHGOutput> {
    const results = await this.ghgOutputModel.findOne({ userId }).exec();
    if (!results) throw new Error('GHG results not found');
    return results;
  }
}