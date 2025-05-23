import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class OperatingCostsInput extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  haulingFees: number;

  @Prop({ required: true })
  organizationalFees: number;

  @Prop({ required: true })
  dhiaFees: number;

  @Prop({ required: true })
  vetExpenses: number;

  @Prop({ required: true })
  insurance: number;

  @Prop({ required: true })
  utilities: number;

  @Prop({ required: true })
  inseminationSexedFees: number;

  @Prop({ required: true })
  inseminationConventionalFees: number;

  @Prop({ required: true })
  inseminationConventionalBeefFees: number;

  @Prop({ required: true })
  wasteManagement: number;

  @Prop({ required: true })
  bedding: number;

  @Prop({ required: true })
  raisedForageCost: number;

  @Prop({ required: true })
  purchasedFeedCost: number;

  @Prop({ required: true })
  additionalManagementCostsPercentage: number;

  @Prop({ required: true })
  estimatedLabourCost: number;

  @Prop({ required: true })
  useDetailedLaborCost: boolean;
}

export const OperatingCostsInputSchema =
  SchemaFactory.createForClass(OperatingCostsInput);
