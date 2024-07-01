import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class TomatoPrice extends Document{
    @Prop({required: true})
    report_date: string;

    @Prop({ required: true })
    begin_date: string;

    @Prop({ required: true })
    end_date: string;

    @Prop({ required: true })
    season: number;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    group: string;

    @Prop({ required: true })
    commodity: string;

    @Prop({ required: true })
    variety: string;

    @Prop({ required: true })
    package: string;

    @Prop({ required: true })
    grade: string;

    @Prop({ required: true })
    district: string;

    @Prop({ required: true })
    item_size: string;

    @Prop({ type: String, default: null })
    environment: string | null;

    @Prop({ type: Number, default: null })
    unit_sales: number | null;

    @Prop({ type: String, default: null })
    quality: string | null;

    @Prop({ type: String, default: null })
    condition: string | null;

    @Prop({ type: String, default: null })
    appearance: string | null;

    @Prop({ type: String, default: null })
    storage: string | null;

    @Prop({ type: String, default: 'N' }) // Assuming 'N' as default for organic
    organic: string;

    @Prop({ type: String, default: 'D (domestic)' }) // Assuming 'D (domestic)' as default for import/export
    import_export: string;

    @Prop({ type: String, default: null })
    properties: string | null;

    @Prop({ required: true })
    low_price: number;

    @Prop({ required: true })
    high_price: number;

    @Prop({ type: Number, default: null })
    mostly_low_price: number | null;
}

export const TomatoPriceSchema = SchemaFactory.createForClass(TomatoPrice)