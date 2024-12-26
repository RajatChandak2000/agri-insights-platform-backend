import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class FixedCostsOutput extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  totalCattleFixedCost: number;

  @Prop({ required: true })
  totalFacilitiesAndBuildingsFixedCost: number;

  @Prop({ required: true })
  totalWasteManagementSystemsFixedCost: number;

  @Prop({ required: true })
  totalMachineryFixedCost: number;

  @Prop({ required: true })
  totalLandFixedCost: number;

  @Prop({ required: true })
  overheadCost: number;

  @Prop({ required: true })
  totalDairyFixedCost: number;

  @Prop({ required: false })
  totalCroppingAnnualEconomicCosts?: number;
}

export const FixedCostsOutputSchema =
  SchemaFactory.createForClass(FixedCostsOutput);
