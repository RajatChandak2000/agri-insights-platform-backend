// ghg-input.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class GHGInput extends Document {
  @Prop({type: Types.ObjectId, ref: 'User', required: true})
  userId: Types.ObjectId;

  @Prop({ required: true })
  fatPercentage: number;

  @Prop({ required: true })
  proteinPercentage: number;

  @Prop({ required: true, default: 0.3567 })
  averageUSTruckingEmissions: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const GHGInputSchema = SchemaFactory.createForClass(GHGInput);
