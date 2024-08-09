import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class ProductionDetailsOutput extends Document{
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    // New variables added
    @Prop({ required: true })
    heifersProduced: number;

    @Prop({ required: true })
    bullCalvesProduced: number;

    @Prop({ required: true })
    beefCrossBullsProduced: number;

    @Prop({ required: true })
    beefCrossHeifersProduced: number;

    @Prop({required: true})
    numberOfLactationsPerYear: number;

    @Prop({required: true})
    rollingHerdAverage: number;

    @Prop({ required: true })
    totalAnnualMilkProduction: number;

    @Prop({ required: true })
    expectedAnnualMilkSales: number;

    @Prop({ required: true })
    numberOfReplacementHeifersNeeded: number;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const ProductionDetailsOutputSchema = SchemaFactory.createForClass(ProductionDetailsOutput);