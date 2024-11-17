import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
class MilkingHerdFeedPlanInputs{
    @Prop({ required: true })
    milkingHerdCornSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdCornSilageDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdSorghumSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdSorghumSilageDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdSmallGrainSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdSmallGrainSilageDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdGrassHayLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdGrassHayDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdAlfalfaHayLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdAlfalfaHayDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdPeanutHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdPeanutHullsDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdApplePomaceNoHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdApplePomaceNoHullsDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdDistillersGrainWetLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdDistillersGrainWetDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdBrewersGrainWetLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdBrewersGrainWetDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdCitrusPulpDryLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdCitrusPulpDryDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdCornGlutenFeedLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdCornGlutenFeedDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdWholeCottonseedLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdWholeCottonseedDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdCottonseedHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdCottonseedHullsDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdSoybeanMeal48LbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdSoybeanMeal48DaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdCustomFeedMixLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdCustomFeedMixDaysOnFeed: number;

    @Prop({ required: true })
    milkingHerdCustomMineralMixLbsAsFedPerDay: number;

    @Prop({ required: true })
    milkingHerdCustomMineralMixDaysOnFeed: number;

}

@Schema()
class DryHerdFeedPlanInputs{
    @Prop({ required: true })
    dryHerdCornSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdCornSilageDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdSorghumSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdSorghumSilageDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdSmallGrainSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdSmallGrainSilageDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdGrassHayLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdGrassHayDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdAlfalfaHayLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdAlfalfaHayDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdPeanutHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdPeanutHullsDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdApplePomaceNoHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdApplePomaceNoHullsDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdDistillersGrainWetLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdDistillersGrainWetDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdBrewersGrainWetLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdBrewersGrainWetDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdCitrusPulpDryLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdCitrusPulpDryDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdCornGlutenFeedLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdCornGlutenFeedDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdWholeCottonseedLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdWholeCottonseedDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdCottonseedHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdCottonseedHullsDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdSoybeanMeal48LbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdSoybeanMeal48DaysOnFeed: number;

    @Prop({ required: true })
    dryHerdCustomFeedMixLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdCustomFeedMixDaysOnFeed: number;

    @Prop({ required: true })
    dryHerdCustomMineralMixLbsAsFedPerDay: number;

    @Prop({ required: true })
    dryHerdCustomMineralMixDaysOnFeed: number;
}

@Schema()
class BredHeifersFeedPlanInputs{
    @Prop({ required: true })
    bredHeifersCornSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersCornSilageDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersSorghumSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersSorghumSilageDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersSmallGrainSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersSmallGrainSilageDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersGrassHayLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersGrassHayDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersAlfalfaHayLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersAlfalfaHayDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersPeanutHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersPeanutHullsDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersApplePomaceNoHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersApplePomaceNoHullsDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersDistillersGrainWetLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersDistillersGrainWetDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersBrewersGrainWetLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersBrewersGrainWetDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersCitrusPulpDryLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersCitrusPulpDryDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersCornGlutenFeedLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersCornGlutenFeedDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersWholeCottonseedLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersWholeCottonseedDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersCottonseedHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersCottonseedHullsDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersSoybeanMeal48LbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersSoybeanMeal48DaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersCustomFeedMixLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersCustomFeedMixDaysOnFeed: number;

    @Prop({ required: true })
    bredHeifersCustomMineralMixLbsAsFedPerDay: number;

    @Prop({ required: true })
    bredHeifersCustomMineralMixDaysOnFeed: number;
}

@Schema()
class YoungHeifersFeedPlanInputs{
    @Prop({ required: true })
    youngHeifersCornSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersCornSilageDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersSorghumSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersSorghumSilageDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersSmallGrainSilageLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersSmallGrainSilageDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersGrassHayLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersGrassHayDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersAlfalfaHayLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersAlfalfaHayDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersPeanutHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersPeanutHullsDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersApplePomaceNoHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersApplePomaceNoHullsDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersDistillersGrainWetLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersDistillersGrainWetDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersBrewersGrainWetLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersBrewersGrainWetDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersCitrusPulpDryLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersCitrusPulpDryDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersCornGlutenFeedLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersCornGlutenFeedDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersWholeCottonseedLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersWholeCottonseedDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersCottonseedHullsLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersCottonseedHullsDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersSoybeanMeal48LbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersSoybeanMeal48DaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersCustomFeedMixLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersCustomFeedMixDaysOnFeed: number;

    @Prop({ required: true })
    youngHeifersCustomMineralMixLbsAsFedPerDay: number;

    @Prop({ required: true })
    youngHeifersCustomMineralMixDaysOnFeed: number;
}

@Schema()
class CalvesFeedPlanInputs{
    @Prop({ required: true })
    calvesMilkReplacerLbsAsFedPerDay: number;

    @Prop({ required: true })
    calvesMilkReplacerDaysOnFeed: number;

    @Prop({ required: true })
    calvesRaisedMilkUsedForCalvesLbsAsFedPerDay: number;

    @Prop({ required: true })
    calvesRaisedMilkUsedForCalvesDaysOnFeed: number;

    @Prop({ required: true })
    calvesCalfStarterFeedLbsAsFedPerDay: number;

    @Prop({ required: true })
    calvesCalfStarterFeedDaysOnFeed: number;
}

@Schema()
class CornSilageInputs {
  @Prop({ required: true })
  cornSilageExpectedYieldTonsPerAcre: number;

  @Prop({ required: true })
  cornSilageHarvestedAcres: number;

  @Prop({ required: true })
  cornSilageEstimatedTotalOperatingCost: number;

  @Prop({ required: true })
  cornSilagePercentOfForageFixedCostAllocated: number;

  @Prop({ required: true })
  cornSilageShrinkLossPercentage: number;
}

@Schema()
class SorghumSilageInputs {
  @Prop({ required: true })
  sorghumSilageExpectedYieldTonsPerAcre: number;

  @Prop({ required: true })
  sorghumSilageHarvestedAcres: number;

  @Prop({ required: true })
  sorghumSilageEstimatedTotalOperatingCost: number;

  @Prop({ required: true })
  sorghumSilagePercentOfForageFixedCostAllocated: number;

  @Prop({ required: true })
  sorghumSilageShrinkLossPercentage: number;
}

@Schema()
class SmallGrainSilageInputs {
  @Prop({ required: true })
  smallGrainSilageExpectedYieldTonsPerAcre: number;

  @Prop({ required: true })
  smallGrainSilageHarvestedAcres: number;

  @Prop({ required: true })
  smallGrainSilageEstimatedTotalOperatingCost: number;

  @Prop({ required: true })
  smallGrainSilagePercentOfForageFixedCostAllocated: number;

  @Prop({ required: true })
  smallGrainSilageShrinkLossPercentage: number;
}

@Schema()
class GrassHayInputs {
  @Prop({ required: true })
  grassHayExpectedYieldTonsPerAcre: number;

  @Prop({ required: true })
  grassHayHarvestedAcres: number;

  @Prop({ required: true })
  grassHayEstimatedTotalOperatingCost: number;

  @Prop({ required: true })
  grassHayPercentOfForageFixedCostAllocated: number;

  @Prop({ required: true })
  grassHayShrinkLossPercentage: number;
}

@Schema()
class AlfalfaHayEstablishmentInputs {
  @Prop({ required: true })
  alfalfaHayEstablishmentExpectedYieldTonsPerAcre: number;

  @Prop({ required: true })
  alfalfaHayEstablishmentHarvestedAcres: number;

  @Prop({ required: true })
  alfalfaHayEstablishmentEstimatedTotalOperatingCost: number;

  @Prop({ required: true })
  alfalfaHayEstablishmentPercentOfForageFixedCostAllocated: number;
}

@Schema()
class AlfalfaHayStandInputs {
  @Prop({ required: true })
  alfalfaHayStandExpectedYieldTonsPerAcre: number;

  @Prop({ required: true })
  alfalfaHayStandHarvestedAcres: number;

  @Prop({ required: true })
  alfalfaHayStandEstimatedTotalOperatingCost: number;

  @Prop({ required: true })
  alfalfaHayStandPercentOfForageFixedCostAllocated: number;
}

@Schema()
class AlfalfaHayShrinkLoss {
  @Prop({ required: true })
  alfalfaHayShrinkLossPercentage: number;
}

@Schema()
export class FeedDetailsInput extends Document{
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;

    @Prop({type: MilkingHerdFeedPlanInputs, default:{} })
    milkingHerd: MilkingHerdFeedPlanInputs;

    @Prop({ type: DryHerdFeedPlanInputs, default: {} })
    dryHerd: DryHerdFeedPlanInputs;

    @Prop({ type: BredHeifersFeedPlanInputs, default: {} })
    bredHeifers: BredHeifersFeedPlanInputs;

    @Prop({ type: YoungHeifersFeedPlanInputs, default: {} })
    youngHeifers: YoungHeifersFeedPlanInputs;

    @Prop({ type: CalvesFeedPlanInputs, default: {} })
    calves: CalvesFeedPlanInputs;

    //Raised Forage Classes
    @Prop({ type: CornSilageInputs, default: {} })
    cornSilage: CornSilageInputs;

    @Prop({ type: SorghumSilageInputs, default: {} })
    sorghumSilage: SorghumSilageInputs;

    @Prop({ type: SmallGrainSilageInputs, default: {} })
    smallGrainSilage: SmallGrainSilageInputs;

    @Prop({ type: GrassHayInputs, default: {} })
    grassHay: GrassHayInputs;

    @Prop({ type: AlfalfaHayEstablishmentInputs, default: {} })
    alfalfaHayEstablishment: AlfalfaHayEstablishmentInputs;

    @Prop({ type: AlfalfaHayStandInputs, default: {} })
    alfalfaHayStand: AlfalfaHayStandInputs;

    @Prop({ type: AlfalfaHayShrinkLoss, default: {} })
    alfalfaHayShrinkLoss: AlfalfaHayShrinkLoss;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const FeedDetailsInputsSchema = SchemaFactory.createForClass(FeedDetailsInput);