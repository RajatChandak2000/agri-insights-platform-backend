import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class RaisedForageOutput extends Document {
  // Raised Forage Variable Costs
  @Prop({ required: true }) cornSilageTVC: number;
  @Prop({ required: true }) cornSilageTVCPerTon: number;
  @Prop({ required: true }) sorghumSilageTVC: number;
  @Prop({ required: true }) sorghumSilageTVCPerTon: number;
  @Prop({ required: true }) smallGrainSilageTVC: number;
  @Prop({ required: true }) smallGrainSilageTVCPerTon: number;
  @Prop({ required: true }) grassHayTVC: number;
  @Prop({ required: true }) grassHayTVCPerTon: number;
  @Prop({ required: true }) alfalfaHayEstablishmentTVC: number;
  @Prop({ required: true }) alfalfaHayEstablishmentTVCPerTon: number;
  @Prop({ required: true }) alfalfaHayStandTVC: number;
  @Prop({ required: true }) alfalfaHayStandTVCPerTon: number;

  // Raised Forage Fixed Cost
  @Prop({ required: true }) cornSilageFixedCostAllocation: number;
  @Prop({ required: true }) cornSilageFixedCostPerTon: number;
  @Prop({ required: true }) sorghumSilageFixedCostAllocation: number;
  @Prop({ required: true }) sorghumSilageFixedCostPerTon: number;
  @Prop({ required: true }) smallGrainSilageFixedCostAllocation: number;
  @Prop({ required: true }) smallGrainSilageFixedCostPerTon: number;
  @Prop({ required: true }) grassHayFixedCostAllocation: number;
  @Prop({ required: true }) grassHayFixedCostPerTon: number;
  @Prop({ required: true }) alfalfaHayEstablishmentFixedCostAllocation: number;
  @Prop({ required: true }) alfalfaHayEstablishmentFixedCostPerTon: number;
  @Prop({ required: true }) alfalfaHayStandFixedCostAllocation: number;
  @Prop({ required: true }) alfalfaHayStandFixedCostPerTon: number;

  // Raised Forage Total Cost
  @Prop({ required: true }) cornSilageTotalCost: number;
  @Prop({ required: true }) cornSilageTotalCostPerTon: number;
  @Prop({ required: true }) sorghumSilageTotalCost: number;
  @Prop({ required: true }) sorghumSilageTotalCostPerTon: number;
  @Prop({ required: true }) smallGrainSilageTotalCost: number;
  @Prop({ required: true }) smallGrainSilageTotalCostPerTon: number;
  @Prop({ required: true }) grassHayTotalCost: number;
  @Prop({ required: true }) grassHayTotalCostPerTon: number;
  @Prop({ required: true }) alfalfaHayEstablishmentTotalCost: number;
  @Prop({ required: true }) alfalfaHayEstablishmentTotalCostPerTon: number;
  @Prop({ required: true }) alfalfaHayStandTotalCost: number;
  @Prop({ required: true }) alfalfaHayStandTotalCostPerTon: number;

  // Purchased Feed Expenses
  @Prop({ required: true }) cornSilageTonsToBePurchased: number;
  @Prop({ required: true }) cornSilageCostOfCommodity: number;
  @Prop({ required: true }) cornSilageCostOfTrucking: number;
  @Prop({ required: true }) purchasedCornSilageTotalCost: number;
  @Prop({ required: true }) sorghumSilageTonsToBePurchased: number;
  @Prop({ required: true }) sorghumSilageCostOfCommodity: number;
  @Prop({ required: true }) sorghumSilageCostOfTrucking: number;
  @Prop({ required: true }) purchasedSorghumSilageTotalCost: number;
  @Prop({ required: true }) smallGrainSilageTonsToBePurchased: number;
  @Prop({ required: true }) smallGrainSilageCostOfCommodity: number;
  @Prop({ required: true }) smallGrainSilageCostOfTrucking: number;
  @Prop({ required: true }) purchasedSmallGrainSilageTotalCost: number;
  @Prop({ required: true }) grassHayTonsToBePurchased: number;
  @Prop({ required: true }) grassHayCostOfCommodity: number;
  @Prop({ required: true }) grassHayCostOfTrucking: number;
  @Prop({ required: true }) purchasedGrassHayTotalCost: number;
  @Prop({ required: true }) alfalfaLegumeHayTonsToBePurchased: number;
  @Prop({ required: true }) alfalfaLegumeHayCostOfCommodity: number;
  @Prop({ required: true }) alfalfaLegumeHayCostOfTrucking: number;
  @Prop({ required: true }) purchasedAlfalfaLegumeHayTotalCost: number;
  @Prop({ required: true }) peanutHullsTonsToBePurchased: number;
  @Prop({ required: true }) peanutHullsCostOfCommodity: number;
  @Prop({ required: true }) peanutHullsCostOfTrucking: number;
  @Prop({ required: true }) purchasedPeanutHullsTotalCost: number;
  @Prop({ required: true }) applePomaceNoHullsTonsToBePurchased: number;
  @Prop({ required: true }) applePomaceNoHullsCostOfCommodity: number;
  @Prop({ required: true }) applePomaceNoHullsCostOfTrucking: number;
  @Prop({ required: true }) purchasedApplePomaceNoHullsTotalCost: number;
  @Prop({ required: true }) brewersGrainWetTonsToBePurchased: number;
  @Prop({ required: true }) brewersGrainWetCostOfCommodity: number;
  @Prop({ required: true }) brewersGrainWetCostOfTrucking: number;
  @Prop({ required: true }) purchasedBrewersGrainWetTotalCost: number;
  @Prop({ required: true }) citrusPulpDryTonsToBePurchased: number;
  @Prop({ required: true }) citrusPulpDryCostOfCommodity: number;
  @Prop({ required: true }) citrusPulpDryCostOfTrucking: number;
  @Prop({ required: true }) purchasedCitrusPulpDryTotalCost: number;
  @Prop({ required: true }) cornGlutenFeedTonsToBePurchased: number;
  @Prop({ required: true }) cornGlutenFeedCostOfCommodity: number;
  @Prop({ required: true }) cornGlutenFeedCostOfTrucking: number;
  @Prop({ required: true }) purchasedCornGlutenFeedTotalCost: number;
  @Prop({ required: true }) wholeCottonseedTonsToBePurchased: number;
  @Prop({ required: true }) wholeCottonseedCostOfCommodity: number;
  @Prop({ required: true }) wholeCottonseedCostOfTrucking: number;
  @Prop({ required: true }) purchasedWholeCottonseedTotalCost: number;
  @Prop({ required: true }) cottonseedHullsTonsToBePurchased: number;
  @Prop({ required: true }) cottonseedHullsCostOfCommodity: number;
  @Prop({ required: true }) cottonseedHullsCostOfTrucking: number;
  @Prop({ required: true }) purchasedCottonseedHullsTotalCost: number;
  @Prop({ required: true }) soybeanMeal48TonsToBePurchased: number;
  @Prop({ required: true }) soybeanMeal48CostOfCommodity: number;
  @Prop({ required: true }) soybeanMeal48CostOfTrucking: number;
  @Prop({ required: true }) purchasedSoybeanMeal48TotalCost: number;
  @Prop({ required: true }) customFeedMixTonsToBePurchased: number;
  @Prop({ required: true }) customFeedMixCostOfCommodity: number;
  @Prop({ required: true }) customFeedMixCostOfTrucking: number;
  @Prop({ required: true }) purchasedCustomFeedMixTotalCost: number;
  @Prop({ required: true }) customMineralMixTonsToBePurchased: number;
  @Prop({ required: true }) customMineralMixCostOfCommodity: number;
  @Prop({ required: true }) customMineralMixCostOfTrucking: number;
  @Prop({ required: true }) purchasedCustomMineralMixTotalCost: number;

  // Grown Forage Trucking Cost
  @Prop({ required: true }) cornSilageGrownForageTruckingCost: number;
  @Prop({ required: true }) sorghumSilageGrownForageTruckingCost: number;
  @Prop({ required: true }) smallGrainSilageGrownForageTruckingCost: number;
  @Prop({ required: true }) grassHayGrownForageTruckingCost: number;
  @Prop({ required: true }) alfalfaHayEstablishmentGrownForageTruckingCost: number;
  @Prop({ required: true }) alfalfaHayStandGrownForageTruckingCost: number;
}

export const RaisedForageOutputSchema = SchemaFactory.createForClass(RaisedForageOutput);
