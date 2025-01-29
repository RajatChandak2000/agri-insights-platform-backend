import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Analysis extends Document {
  @Prop()
  timestamp: string;

  @Prop()
  relative_humidity: number;

  @Prop()
  air_temperature: number;

  @Prop()
  rainfall: number;

  @Prop()
  consecutive_hours: number;

  @Prop()
  blight_units_S: number;

  @Prop()
  blight_units_MS: number;

  @Prop()
  blight_units_MR: number;

  @Prop()
  continuous_uninterrupted_hours_80: number;

  @Prop()
  severity_values: number;

  @Prop()
  fungicide_units: number;

  @Prop()
  blitecast_severity: number;

  @Prop()
  temp_celsius: number;

  @Prop()
  hutton_criteria: number;
}

export const AnalysisSchema = SchemaFactory.createForClass(Analysis);