import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class ReceiptsInput extends Document{
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;
    
    @Prop({required: true})
    milkPrice: number;

    @Prop({required: true})
    cullCowsPrice: number;

    @Prop({required: true})
    heifersPrice: number;

    @Prop({required: true})
    bullCalvesPrice: number;

    @Prop({required: true})
    beefCrossPrice: number;

    @Prop({required: true})
    otherIncome1: number;

    @Prop({required: true})
    otherIncome2: number;
}

export const ReceiptsInputSchema = SchemaFactory.createForClass(ReceiptsInput);
