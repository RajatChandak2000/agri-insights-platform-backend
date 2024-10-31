import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

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
export class RaisedForageInput extends Document {
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

export const RaisedForageInputsSchema = SchemaFactory.createForClass(RaisedForageInput);
