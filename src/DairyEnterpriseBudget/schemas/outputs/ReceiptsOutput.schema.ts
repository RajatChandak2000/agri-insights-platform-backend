import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
@Schema()
export class ReceiptsOutput extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;
    @Prop({ required: true })
    heifersProduced: number;
    @Prop({ required: true })
    bullCalvesProduced: number;
    @Prop({ required: true })
    beefCrossBullsProduced: number;
    @Prop({ required: true })
    beefCrossHeifersProduced: number;
    @Prop({ required: true })
    milkSales: number;
    @Prop({ required: true })
    cullCowsSales: number;
    @Prop({ required: true })
    heifersSales: number;
    @Prop({ required: true })
    bullCalvesSales: number;
    @Prop({ required: true })
    beefCrossSales: number;
    @Prop({ required: true })
    otherIncome1: number;
    @Prop({ required: true })
    otherIncome2: number;
    @Prop({ required: true })
    totalReceipts: number;
}
export const ReceiptsOutputSchema = SchemaFactory.createForClass(ReceiptsOutput);