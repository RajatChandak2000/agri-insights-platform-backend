import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class OperatingCostsOutput extends Document{
    @Prop({required: true})
    totalFeedCost: number;

    @Prop({required: true})
    raisedFeedCost: number;

    @Prop({required: true})
    purchasedFeedCost: number;

    @Prop({required: true})
    dairyOperatingCosts: number;

    @Prop({required: true})
    dairyPayroll: number;

    @Prop({required: true})
    additionalManagementCosts: number;

    @Prop({required: true})
    totalOperatingCosts: number;
}

export const OperatingCostsOutputSchema = SchemaFactory.createForClass(OperatingCostsOutput);