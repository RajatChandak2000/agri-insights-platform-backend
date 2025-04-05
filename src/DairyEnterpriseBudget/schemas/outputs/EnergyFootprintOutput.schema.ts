import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class EnergyFootprintOutput extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  electric: number;

  @Prop({ required: true })
  diesel: number;

  @Prop({ required: true })
  gasoline: number;

  @Prop({ required: true })
  propane: number;

  @Prop({ required: true })
  naturalGas: number;

  @Prop({ required: true })
  fuelOil: number;

  @Prop({ required: true })
  biodiesel: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const EnergyFootprintOutputSchema = SchemaFactory.createForClass(EnergyFootprintOutput);