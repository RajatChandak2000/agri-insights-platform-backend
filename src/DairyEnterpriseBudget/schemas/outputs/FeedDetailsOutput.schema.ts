import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class FeedDetailsOutput extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Corn Silage
  @Prop({ required: true })
  cornSilageTonsRequired: number;

  @Prop({ required: true })
  cornSilageTonsProduced: number;

  @Prop({ required: true })
  cornSilageBalanceToBePurchasedOrSold: number;

  // Sorghum Silage
  @Prop({ required: true })
  sorghumSilageTonsRequired: number;

  @Prop({ required: true })
  sorghumSilageTonsProduced: number;

  @Prop({ required: true })
  sorghumSilageBalanceToBePurchasedOrSold: number;

  // Small Grain Silage
  @Prop({ required: true })
  smallGrainSilageTonsRequired: number;

  @Prop({ required: true })
  smallGrainSilageTonsProduced: number;

  @Prop({ required: true })
  smallGrainSilageBalanceToBePurchasedOrSold: number;

  // Grass Hay
  @Prop({ required: true })
  grassHayTonsRequired: number;

  @Prop({ required: true })
  grassHayTonsProduced: number;

  @Prop({ required: true })
  grassHayBalanceToBePurchasedOrSold: number;

  // Alfalfa Hay
  @Prop({ required: true })
  alfalfaHayTonsRequired: number;

  @Prop({ required: true })
  alfalfaHayTonsProduced: number;

  @Prop({ required: true })
  alfalfaHayBalanceToBePurchasedOrSold: number;

  // Peanut Hulls
  @Prop({ required: true })
  peanutHullsTonsRequired: number;

  // Apple Pomace
  @Prop({ required: true })
  applePomaceTonsRequired: number;

  // Distiller's Grain
  @Prop({ required: true })
  distillersGrainTonsRequired: number;

  // Brewer's Grain
  @Prop({ required: true })
  brewersGrainTonsRequired: number;

  // Citrus Pulp
  @Prop({ required: true })
  citrusPulpTonsRequired: number;

  // Corn Gluten
  @Prop({ required: true })
  cornGlutenTonsRequired: number;

  // Whole Cottonseed
  @Prop({ required: true })
  wholeCottonseedTonsRequired: number;

  // Soybean Meal 48
  @Prop({ required: true })
  soybeanMeal48TonsRequired: number;

  // Custom Feed Mix
  @Prop({ required: true })
  customFeedMixTonsRequired: number;

  // Custom Mineral Mix
  @Prop({ required: true })
  customMineralMixTonsRequired: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FeedDetailsOutputSchema = SchemaFactory.createForClass(FeedDetailsOutput);