import { IsNumber, IsObject } from "class-validator";

class MilkingHerdFeedDetailsDto {
  @IsNumber()
  milkingHerdCornSilageLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdCornSilageDaysOnFeed: number;

  @IsNumber()
  milkingHerdSorghumSilageLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdSorghumSilageDaysOnFeed: number;

  @IsNumber()
  milkingHerdSmallGrainSilageLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdSmallGrainSilageDaysOnFeed: number;

  @IsNumber()
  milkingHerdGrassHayLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdGrassHayDaysOnFeed: number;

  @IsNumber()
  milkingHerdAlfalfaHayLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdAlfalfaHayDaysOnFeed: number;

  @IsNumber()
  milkingHerdPeanutHullsLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdPeanutHullsDaysOnFeed: number;

  @IsNumber()
  milkingHerdApplePomaceNoHullsLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdApplePomaceNoHullsDaysOnFeed: number;

  @IsNumber()
  milkingHerdDistillersGrainWetLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdDistillersGrainWetDaysOnFeed: number;

  @IsNumber()
  milkingHerdBrewersGrainWetLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdBrewersGrainWetDaysOnFeed: number;

  @IsNumber()
  milkingHerdCitrusPulpDryLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdCitrusPulpDryDaysOnFeed: number;

  @IsNumber()
  milkingHerdCornGlutenFeedLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdCornGlutenFeedDaysOnFeed: number;

  @IsNumber()
  milkingHerdWholeCottonseedLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdWholeCottonseedDaysOnFeed: number;

  @IsNumber()
  milkingHerdCottonseedHullsLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdCottonseedHullsDaysOnFeed: number;

  @IsNumber()
  milkingHerdSoybeanMeal48LbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdSoybeanMeal48DaysOnFeed: number;

  @IsNumber()
  milkingHerdCustomFeedMixLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdCustomFeedMixDaysOnFeed: number;

  @IsNumber()
  milkingHerdCustomMineralMixLbsAsFedPerDay: number;

  @IsNumber()
  milkingHerdCustomMineralMixDaysOnFeed: number;
}

class DryHerdFeedDetailsDto {
  @IsNumber()
  dryHerdCornSilageLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdCornSilageDaysOnFeed: number;

  @IsNumber()
  dryHerdSorghumSilageLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdSorghumSilageDaysOnFeed: number;

  @IsNumber()
  dryHerdSmallGrainSilageLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdSmallGrainSilageDaysOnFeed: number;

  @IsNumber()
  dryHerdGrassHayLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdGrassHayDaysOnFeed: number;

  @IsNumber()
  dryHerdAlfalfaHayLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdAlfalfaHayDaysOnFeed: number;

  @IsNumber()
  dryHerdPeanutHullsLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdPeanutHullsDaysOnFeed: number;

  @IsNumber()
  dryHerdApplePomaceNoHullsLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdApplePomaceNoHullsDaysOnFeed: number;

  @IsNumber()
  dryHerdDistillersGrainWetLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdDistillersGrainWetDaysOnFeed: number;

  @IsNumber()
  dryHerdBrewersGrainWetLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdBrewersGrainWetDaysOnFeed: number;

  @IsNumber()
  dryHerdCitrusPulpDryLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdCitrusPulpDryDaysOnFeed: number;

  @IsNumber()
  dryHerdCornGlutenFeedLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdCornGlutenFeedDaysOnFeed: number;

  @IsNumber()
  dryHerdWholeCottonseedLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdWholeCottonseedDaysOnFeed: number;

  @IsNumber()
  dryHerdCottonseedHullsLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdCottonseedHullsDaysOnFeed: number;

  @IsNumber()
  dryHerdSoybeanMeal48LbsAsFedPerDay: number;

  @IsNumber()
  dryHerdSoybeanMeal48DaysOnFeed: number;

  @IsNumber()
  dryHerdCustomFeedMixLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdCustomFeedMixDaysOnFeed: number;

  @IsNumber()
  dryHerdCustomMineralMixLbsAsFedPerDay: number;

  @IsNumber()
  dryHerdCustomMineralMixDaysOnFeed: number;
}

class BredHeifersFeedDetailsDto {
    @IsNumber()
    bredHeifersCornSilageLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersCornSilageDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersSorghumSilageLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersSorghumSilageDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersSmallGrainSilageLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersSmallGrainSilageDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersGrassHayLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersGrassHayDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersAlfalfaHayLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersAlfalfaHayDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersPeanutHullsLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersPeanutHullsDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersApplePomaceNoHullsLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersApplePomaceNoHullsDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersDistillersGrainWetLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersDistillersGrainWetDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersBrewersGrainWetLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersBrewersGrainWetDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersCitrusPulpDryLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersCitrusPulpDryDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersCornGlutenFeedLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersCornGlutenFeedDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersWholeCottonseedLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersWholeCottonseedDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersCottonseedHullsLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersCottonseedHullsDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersSoybeanMeal48LbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersSoybeanMeal48DaysOnFeed: number;
  
    @IsNumber()
    bredHeifersCustomFeedMixLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersCustomFeedMixDaysOnFeed: number;
  
    @IsNumber()
    bredHeifersCustomMineralMixLbsAsFedPerDay: number;
  
    @IsNumber()
    bredHeifersCustomMineralMixDaysOnFeed: number;
}
  
class YoungHeifersFeedDetailsDto {
    @IsNumber()
    youngHeifersCornSilageLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersCornSilageDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersSorghumSilageLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersSorghumSilageDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersSmallGrainSilageLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersSmallGrainSilageDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersGrassHayLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersGrassHayDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersAlfalfaHayLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersAlfalfaHayDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersPeanutHullsLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersPeanutHullsDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersApplePomaceNoHullsLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersApplePomaceNoHullsDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersDistillersGrainWetLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersDistillersGrainWetDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersBrewersGrainWetLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersBrewersGrainWetDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersCitrusPulpDryLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersCitrusPulpDryDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersCornGlutenFeedLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersCornGlutenFeedDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersWholeCottonseedLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersWholeCottonseedDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersCottonseedHullsLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersCottonseedHullsDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersSoybeanMeal48LbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersSoybeanMeal48DaysOnFeed: number;
  
    @IsNumber()
    youngHeifersCustomFeedMixLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersCustomFeedMixDaysOnFeed: number;
  
    @IsNumber()
    youngHeifersCustomMineralMixLbsAsFedPerDay: number;
  
    @IsNumber()
    youngHeifersCustomMineralMixDaysOnFeed: number;
}  

class CalvesFeedDetailsDto {
  @IsNumber()
  calvesMilkReplacerLbsAsFedPerDay: number;

  @IsNumber()
  calvesMilkReplacerDaysOnFeed: number;

  @IsNumber()
  calvesRaisedMilkUsedForCalvesLbsAsFedPerDay: number;

  @IsNumber()
  calvesRaisedMilkUsedForCalvesDaysOnFeed: number;

  @IsNumber()
  calvesCalfStarterFeedLbsAsFedPerDay: number;

  @IsNumber()
  calvesCalfStarterFeedDaysOnFeed: number;
}

export class FeedDetailsInputDto {
  @IsObject()
  milkingHerd: MilkingHerdFeedDetailsDto;

  @IsObject()
  dryHerd: DryHerdFeedDetailsDto;

  @IsObject()
  bredHeifers: BredHeifersFeedDetailsDto;

  @IsObject()
  youngHeifers: YoungHeifersFeedDetailsDto;

  @IsObject()
  calves: CalvesFeedDetailsDto;
}