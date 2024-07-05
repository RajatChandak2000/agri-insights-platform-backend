import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MailboxAppalachianPrice extends Document {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  report_month: string;

  @Prop({ required: true })
  report_year: number;

  @Prop({ required: true })
  Reporting_Area: string;

  @Prop({ required: true })
  Jan: string;

  @Prop({ required: true })
  Feb: string;

  @Prop({ required: true })
  Mar: string;

  @Prop({ required: true })
  Apr: string;

  @Prop({ required: true })
  May: string;

  @Prop({ required: true })
  Jun: string;

  @Prop({ required: true })
  Jul: string;

  @Prop({ required: true })
  Aug: string;

  @Prop({ required: true })
  Sep: string;

  @Prop({ required: true })
  Oct: string;

  @Prop({ required: true })
  Nov: string;

  @Prop({ required: true })
  Dec: string;

  @Prop({ required: true })
  Avg: string;

  @Prop({ required: true })
  market_location_city: string;

  @Prop({ required: true })
  published_date: string;
}

export const MailboxAppalachianSchema = SchemaFactory.createForClass(MailboxAppalachianPrice);
