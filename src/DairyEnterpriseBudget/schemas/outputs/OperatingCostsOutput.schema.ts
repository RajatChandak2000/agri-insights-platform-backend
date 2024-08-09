import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class OperatingCostsOutput extends Document{

    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;

    @Prop({required: true})
    totalFeedCost: number;

    @Prop({required: true})
    totalRaisedForageCost: number;

    @Prop({required: true})
    totalPurchasedFeedCost: number;

    @Prop({required: true})
    dairyOperatingCosts: number;

    @Prop({required: true})
    dairyPayroll: number;

    @Prop({required: true})
    additionalManagementCosts: number;

    @Prop({required: true})
    totalOperatingCosts: number;

    @Prop({ required: true })
    haulingCosts: number;

    @Prop({ required: true })
    organizationalCosts: number;

    @Prop({ required: true })
    dhiaCosts: number;

    @Prop({ required: true })
    vetCosts: number;

    @Prop({ required: true })
    utilityCosts: number;

    @Prop({ required: true })
    inseminationSexedCosts: number;

    @Prop({ required: true })
    inseminationConventionalCosts: number;

    @Prop({ required: true })
    inseminationConventionalBeefCosts: number;

    @Prop({ required: true })
    wasteManagementCosts: number;

    @Prop({ required: true })
    beddingCosts: number;




}

export const OperatingCostsOutputSchema = SchemaFactory.createForClass(OperatingCostsOutput);