// ghg-input.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
// class FPCMInputs {
//   @Prop({ required: true })
//   fatPercentage: number;

//   @Prop({ required: true })
//   proteinPercentage: number;
// }

// @Schema()
// class CharacterizationFactors {
//   @Prop({ required: true })
//   cornSilageCharacterizationFactor: number;

//   @Prop({ required: true })
//   sorghumSilageCharacterizationFactor: number;

//   @Prop({ required: true })
//   smallGrainCharacterizationFactor: number;

//   @Prop({ required: true })
//   grassHayCharacterizationFactor: number;

//   @Prop({ required: true })
//   alfalfaCharacterizationFactor: number;

//   @Prop({ required: true })
//   peanutHullsCharacterizationFactor: number;

//   @Prop({ required: true })
//   applePomaceCharacterizationFactor: number;

//   @Prop({ required: true })
//   distillersCharacterizationFactor: number;

//   @Prop({ required: true })
//   brewersCharacterizationFactor: number;

//   @Prop({ required: true })
//   citrusPulpCharacterizationFactor: number;

//   @Prop({ required: true })
//   cornGlutenCharacterizationFactor: number;

//   @Prop({ required: true })
//   wholeCottonseedCharacterizationFactor: number;

//   @Prop({ required: true })
//   cottonseedHullsCharacterizationFactor: number;

//   @Prop({ required: true })
//   soybean48CharacterizationFactor: number;
// }

@Schema()
export class GHGInput extends Document {
  @Prop({type: Types.ObjectId, ref: 'User', required: true})
  userId: Types.ObjectId;

  // @Prop({ type: FPCMInputs, required: true })
  // fpcmInputs: FPCMInputs;

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
