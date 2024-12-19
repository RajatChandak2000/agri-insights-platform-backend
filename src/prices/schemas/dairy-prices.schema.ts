import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DairyPrice extends Document {
  @Prop({ required: true })
  report_month: string;

  @Prop({ required: true })
  report_year: number;

  @Prop({ required: true })
  MarketingArea: string;

  @Prop({ required: true })
  order_no: string;

  @Prop({ required: true })
  ClassIWhole: string;

  @Prop({ required: true })
  ClassIIWhole: string;

  @Prop({ required: true })
  ClassIIIWhole: string;

  @Prop({ required: true })
  ClassIVWhole: string;

  @Prop({ required: true })
  market_type: string;

  @Prop({ required: true })
  published_date: string;
}

export const DairyPriceSchema = SchemaFactory.createForClass(DairyPrice);
