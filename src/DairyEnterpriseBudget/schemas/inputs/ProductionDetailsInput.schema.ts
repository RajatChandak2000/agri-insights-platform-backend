import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class MilkProductionInputs {
  @Prop({ required: true })
  totalNumberOfCows: number;

  @Prop({ required: true })
  calvingInterval: number;

  @Prop({ required: true })
  expectedMilkProduction: number;

  @Prop({ required: true })
  expectedMilkPrice: number;
}

@Schema()
class HeiferProductionInputs {
  @Prop({ required: true })
  cullingRate: number;

  @Prop({ required: true })
  cowDeathLossRate: number;

  @Prop({ required: true })
  heiferRaisingDeathLossRate: number;

  @Prop({ required: true })
  numberOfHeifersRaised: number;

  @Prop({ required: true })
  bullCalfDeath: number;

  @Prop({ required: true })
  expectedPercentMaleWithSexedSemen: number;

  @Prop({ required: true })
  expectedPercentMaleWithConventional: number;

  @Prop({ required: true })
  heifersBredConventionalPercent: number;

  @Prop({ required: true })
  heifersBredSexedPercent: number;

  @Prop({ required: true })
  avgAgeofFirstCalving: number;
}

@Schema()
class BeefCrossProductionDetails {
  @Prop({ required: true })
  heifersBredBeefCrossPercent: number;

  @Prop({ required: true })
  expectedPercentMaleWithBeef: number;

  @Prop({ required: true })
  beefCrossDeathRate: number;
}

@Schema()
export class ProductionDetailsInput extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: MilkProductionInputs, default: {} })
  milkProduction: MilkProductionInputs;

  @Prop({ type: HeiferProductionInputs, default: {} })
  heiferProduction: HeiferProductionInputs;

  @Prop({ type: BeefCrossProductionDetails, default: {} })
  beefCrossDetails: BeefCrossProductionDetails;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductionDetailsInputsSchema = SchemaFactory.createForClass(
  ProductionDetailsInput,
);
