import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class ManureManagementInput extends Document {
  @Prop({type: Types.ObjectId, ref: 'User', required: true})
  userId: Types.ObjectId;

  @Prop({ required: true })
  percentLactatingManureRecoverable: number;
  
  @Prop({ required: true })
  percentDryManureRecoverable: number;

  @Prop({ required: true })
  percentBredManureRecoverable: number;

  @Prop({ required: true })
  percentYoungManureRecoverable: number;

  @Prop({ required: true })
  manureManagementSystem1: string;

  @Prop({ required: true })
  percentOfManureMMS1: number;

  @Prop({ required: true })
  manureManagementSystem2: string;

  @Prop({ required: true })
  percentOfManureMMS2: number;

  @Prop({ required: true })
  manureManagementSystem3: string;

  @Prop({ required: true })
  percentOfManureMMS3: number;

  @Prop({ required: true })
  manureManagementSystem4: string;

  @Prop({ required: true })
  percentOfManureMMS4: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ManureManagementInputSchema = SchemaFactory.createForClass(ManureManagementInput);