import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class FeedDetailsOutput extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Corn Silage
  @Prop({ required: true }) cornSilageTonsRequired: number;

  @Prop({ required: true }) cornSilageTonsProduced: number;

  @Prop({ required: true }) cornSilageBalanceToBePurchasedOrSold: number;

  // Sorghum Silage
  @Prop({ required: true }) sorghumSilageTonsRequired: number;

  @Prop({ required: true }) sorghumSilageTonsProduced: number;

  @Prop({ required: true }) sorghumSilageBalanceToBePurchasedOrSold: number;

  // Small Grain Silage
  @Prop({ required: true }) smallGrainSilageTonsRequired: number;

  @Prop({ required: true }) smallGrainSilageTonsProduced: number;

  @Prop({ required: true }) smallGrainSilageBalanceToBePurchasedOrSold: number;

  // Grass Hay
  @Prop({ required: true }) grassHayTonsRequired: number;

  @Prop({ required: true }) grassHayTonsProduced: number;

  @Prop({ required: true }) grassHayBalanceToBePurchasedOrSold: number;

  // Alfalfa Hay
  @Prop({ required: true }) alfalfaHayTonsRequired: number;

  @Prop({ required: true }) alfalfaHayTonsProduced: number;

  @Prop({ required: true }) alfalfaHayBalanceToBePurchasedOrSold: number;

  // Peanut Hulls
  @Prop({ required: true }) peanutHullsTonsRequired: number;

  // Apple Pomace
  @Prop({ required: true }) applePomaceTonsRequired: number;

  // Distiller's Grain
  @Prop({ required: true }) distillersGrainTonsRequired: number;

  // Brewer's Grain
  @Prop({ required: true }) brewersGrainTonsRequired: number;

  // Citrus Pulp
  @Prop({ required: true }) citrusPulpTonsRequired: number;

  // Corn Gluten
  @Prop({ required: true }) cornGlutenTonsRequired: number;

  // Whole Cottonseed
  @Prop({ required: true }) wholeCottonseedTonsRequired: number;

  @Prop({ required: true }) cottonseedHullsTonsRequired: number;

  // Soybean Meal 48
  @Prop({ required: true }) soybeanMeal48TonsRequired: number;

  // Soy Hulls
  @Prop({ required: true }) soyHullsTonsRequired: number;

  // Custom Grain Mix
  @Prop({ required: true }) customGrainMixTonsRequired: number;

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

  @Prop({ required: true }) alfalfaHayTonsToBePurchased: number;
  @Prop({ required: true }) alfalfaHayCostOfCommodity: number;
  @Prop({ required: true }) alfalfaHayCostOfTrucking: number;
  @Prop({ required: true }) purchasedAlfalfaHayTotalCost: number;

  @Prop({ required: true }) peanutHullsTonsToBePurchased: number;
  @Prop({ required: true }) peanutHullsCostOfCommodity: number;
  @Prop({ required: true }) peanutHullsCostOfTrucking: number;
  @Prop({ required: true }) purchasedPeanutHullsTotalCost: number;

  @Prop({ required: true }) applePomaceNoHullsTonsToBePurchased: number;
  @Prop({ required: true }) applePomaceNoHullsCostOfCommodity: number;
  @Prop({ required: true }) applePomaceNoHullsCostOfTrucking: number;
  @Prop({ required: true }) purchasedApplePomaceNoHullsTotalCost: number;

  @Prop({ required: true }) distillersGrainWetTonsToBePurchased: number;
  @Prop({ required: true }) distillersGrainWetCostOfCommodity: number;
  @Prop({ required: true }) distillersGrainWetCostOfTrucking: number;
  @Prop({ required: true }) purchasedDistillersGrainWetTotalCost: number;

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

  @Prop({ required: true }) soyHullsTonsToBePurchased: number;
  @Prop({ required: true }) soyHullsCostOfCommodity: number;
  @Prop({ required: true }) soyHullsCostOfTrucking: number;
  @Prop({ required: true }) purchasedSoyHullsTotalCost: number;

  @Prop({ required: true }) customGrainMixTonsToBePurchased: number;
  @Prop({ required: true }) customGrainMixCostOfCommodity: number;
  @Prop({ required: true }) customGrainMixCostOfTrucking: number;
  @Prop({ required: true }) purchasedCustomGrainMixTotalCost: number;

  // Grown Forage Trucking Cost
  @Prop({ required: true }) cornSilageGrownForageTruckingCost: number;
  @Prop({ required: true }) sorghumSilageGrownForageTruckingCost: number;
  @Prop({ required: true }) smallGrainSilageGrownForageTruckingCost: number;
  @Prop({ required: true }) grassHayGrownForageTruckingCost: number;
  @Prop({ required: true }) alfalfaHayGrownForageTruckingCost: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FeedDetailsOutputSchema =
  SchemaFactory.createForClass(FeedDetailsOutput);
