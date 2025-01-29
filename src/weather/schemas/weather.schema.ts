import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Measurement extends Document {
  @Prop()
  location: string;

  @Prop()
  datetime: string;

  @Prop()
  var: string;

  @Prop()
  value: string;

  @Prop()
  unit: string;

  @Prop()
  paramtype: string;

  @Prop()
  obnum: string;

  @Prop()
  obavail: string;

  @Prop()
  obtime: string;

  @Prop()
  obmin: string;

  @Prop()
  obmax: string;

  @Prop()
  pdstart: string;

  @Prop()
  pdend: string;
}

export const MeasurementSchema = SchemaFactory.createForClass(Measurement);

@Schema()
export class Weather extends Document {
  @Prop()
  timestamp: string;

  @Prop({ type: MeasurementSchema, _id: false })
  airtempavg: Measurement;

  @Prop({ type: MeasurementSchema, _id: false })
  rhavg2m: Measurement;

  @Prop({ type: MeasurementSchema, _id: false })
  precip1m: Measurement;

  @Prop({ type: MeasurementSchema, _id: false })
  leafwetness: Measurement;

  @Prop({ type: MeasurementSchema, _id: false })
  wbgtavg2m: Measurement;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
