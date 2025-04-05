// ghg-output.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class HerdTotalDMI {
  @Prop({ required: true })
  cornSilageDMI: number;

  @Prop({ required: true })
  sorghumSilageDMI: number;

  @Prop({ required: true })
  smallGrainDMI: number;

  @Prop({ required: true })
  grassHayDMI: number;

  @Prop({ required: true })
  alfalfaDMI: number;

  @Prop({ required: true })
  peanutHullsDMI: number;

  @Prop({ required: true })
  applePomaceDMI: number;

  @Prop({ required: true })
  distillersDMI: number;

  @Prop({ required: true })
  brewersDMI: number;

  @Prop({ required: true })
  citrusPulpDMI: number;

  @Prop({ required: true })
  cornGlutenDMI: number;

  @Prop({ required: true })
  wholeCottonseedDMI: number;

  @Prop({ required: true })
  cottonseedHullsDMI: number;

  @Prop({ required: true })
  soybean48DMI: number;
}

@Schema()
export class HerdDMIGroup extends Document {
  @Prop({ required: true, type: HerdTotalDMI })
  milkingHerd: HerdTotalDMI;

  @Prop({ required: true, type: HerdTotalDMI })
  dryHerd: HerdTotalDMI;

  @Prop({ required: true, type: HerdTotalDMI })
  bredHeifers: HerdTotalDMI;

  @Prop({ required: true, type: HerdTotalDMI })
  youngHeifers: HerdTotalDMI;
}

@Schema()
export class FeedGHGEmissions{
  // Individual Feed Emissions
  @Prop({ required: true })
  cornSilageFeedEmissions: number;
  @Prop({ required: true })
  cornSilageFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  sorghumSilageFeedEmissions: number;
  @Prop({ required: true })
  sorghumSilageFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  smallGrainFeedEmissions: number;
  @Prop({ required: true })
  smallGrainFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  grassHayFeedEmissions: number;
  @Prop({ required: true })
  grassHayFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  alfalfaFeedEmissions: number;
  @Prop({ required: true })
  alfalfaFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  peanutHullsFeedEmissions: number;
  @Prop({ required: true })
  peanutHullsFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  applePomaceFeedEmissions: number;
  @Prop({ required: true })
  applePomaceFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  distillersFeedEmissions: number;
  @Prop({ required: true })
  distillersFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  brewersFeedEmissions: number;
  @Prop({ required: true })
  brewersFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  citrusPulpFeedEmissions: number;
  @Prop({ required: true })
  citrusPulpFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  cornGlutenFeedEmissions: number;
  @Prop({ required: true })
  cornGlutenFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  wholeCottonseedFeedEmissions: number;
  @Prop({ required: true })
  wholeCottonseedFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  cottonseedHullsFeedEmissions: number;
  @Prop({ required: true })
  cottonseedHullsFeedEmissionsPerFPCM: number;

  @Prop({ required: true })
  soybean48FeedEmissions: number;
  @Prop({ required: true })
  soybean48FeedEmissionsPerFPCM: number;
}

@Schema()
export class EntericEmissions{
  // Individual Enteric Emissions
  @Prop({ required: true })
  cornSilageEntericEmissions: number;
  @Prop({ required: true })
  cornSilageEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  sorghumSilageEntericEmissions: number;
  @Prop({ required: true })
  sorghumSilageEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  smallGrainEntericEmissions: number;
  @Prop({ required: true })
  smallGrainEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  grassHayEntericEmissions: number;
  @Prop({ required: true })
  grassHayEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  alfalfaEntericEmissions: number;
  @Prop({ required: true })
  alfalfaEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  peanutHullsEntericEmissions: number;
  @Prop({ required: true })
  peanutHullsEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  applePomaceEntericEmissions: number;
  @Prop({ required: true })
  applePomaceEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  distillersEntericEmissions: number;
  @Prop({ required: true })
  distillersEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  brewersEntericEmissions: number;
  @Prop({ required: true })
  brewersEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  citrusPulpEntericEmissions: number;
  @Prop({ required: true })
  citrusPulpEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  cornGlutenEntericEmissions: number;
  @Prop({ required: true })
  cornGlutenEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  wholeCottonseedEntericEmissions: number;
  @Prop({ required: true })
  wholeCottonseedEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  cottonseedHullsEntericEmissions: number;
  @Prop({ required: true })
  cottonseedHullsEntericEmissionsPerFPCM: number;

  @Prop({ required: true })
  soybean48EntericEmissions: number;
  @Prop({ required: true })
  soybean48EntericEmissionsPerFPCM: number;
}

@Schema()
export class TruckingEmissions{
  // Individual Trucking Emissions
  @Prop({ required: true })
  cornSilageTruckingEmissions: number;
  @Prop({ required: true })
  sorghumSilageTruckingEmissions: number;
  @Prop({ required: true })
  smallGrainTruckingEmissions: number;
  @Prop({ required: true })
  grassHayTruckingEmissions: number;
  @Prop({ required: true })
  alfalfaTruckingEmissions: number;
  @Prop({ required: true })
  peanutHullsTruckingEmissions: number;
  @Prop({ required: true })
  applePomaceTruckingEmissions: number;
  @Prop({ required: true })
  distillersTruckingEmissions: number;
  @Prop({ required: true })
  brewersTruckingEmissions: number;
  @Prop({ required: true })
  citrusPulpTruckingEmissions: number;
  @Prop({ required: true })
  cornGlutenTruckingEmissions: number;
  @Prop({ required: true })
  wholeCottonseedTruckingEmissions: number;
  @Prop({ required: true })
  cottonseedHullsTruckingEmissions: number;
  @Prop({ required: true })
  soybean48TruckingEmissions: number;
}

@Schema()
export class GHGOutput extends Document {
  @Prop({type: Types.ObjectId, ref: 'User', required: true})
  userId: Types.ObjectId;

  // FPCM Output
  @Prop({ required: true })
  annualFPCM: number;

  // Feed Emissions Total
  @Prop({ required: true })
  ghgFeedTotal: number;
  @Prop({ required: true })
  ghgFeedTotalPerFPCM: number;

  // Total Enteric Emissions
  @Prop({ required: true })
  totalEntericEmissions: number;
  @Prop({ required: true })
  totalEntericEmissionsPerFPCM: number;

  // Trucking Emissions
  @Prop({ required: true })
  totalTruckingEmissions: number;
  @Prop({ required: true })
  ghgTruckingFootprint: number;

  // Herd Total
  @Prop({ type: HerdTotalDMI, default: {} })
  herdTotalDMI: HerdTotalDMI;

  //Herd DMI Group
  @Prop({ type: HerdDMIGroup, default: {} })
  herdDMIGroup: HerdDMIGroup;

  // Feed GHG Emissions
  @Prop({ type: FeedGHGEmissions, default: {} })
  feedGHGEmissions = FeedGHGEmissions;

  // Enteric Emissions
  @Prop({ type: EntericEmissions, default: {}})
  entericEmissions = EntericEmissions

  // Individual Trucking Emissions
  @Prop({type : TruckingEmissions, default: {}})
  truckingEmissions: TruckingEmissions

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const GHGOutputSchema = SchemaFactory.createForClass(GHGOutput);