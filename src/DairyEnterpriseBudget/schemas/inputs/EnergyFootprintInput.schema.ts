import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
class AnnualEnergyUseInputs {
    @Prop({ required: true })
    electric: number;

    @Prop({ required: true})
    diesel: number;

    @Prop({ required: true})
    gasoline: number;

    @Prop({ required: true})
    propane: number;

    @Prop({ required: true})
    naturalGas: number;

    @Prop({ required: true})
    fuelOil: number;

    @Prop({ required: true})
    biodiesel: number;
}

@Schema()
class DairyOperationsEnergyUseInputs {
    @Prop({ required: true })
    electric: number;

    @Prop({ required: true})
    diesel: number;

    @Prop({ required: true})
    gasoline: number;

    @Prop({ required: true})
    propane: number;

    @Prop({ required: true})
    naturalGas: number;

    @Prop({ required: true})
    fuelOil: number;

    @Prop({ required: true})
    biodiesel: number;
}

@Schema()
export class EnergyFootprintInput extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: AnnualEnergyUseInputs, default: {} })
    annualEnergyUse: AnnualEnergyUseInputs

    @Prop({ type: DairyOperationsEnergyUseInputs, default: {} })
    dairyOperationsEnergyUse: DairyOperationsEnergyUseInputs

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const EnergyFootprintInputSchema = SchemaFactory.createForClass(EnergyFootprintInput)