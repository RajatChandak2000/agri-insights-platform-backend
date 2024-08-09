import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types} from "mongoose";

@Schema()
export class LabourCostOutput extends Document {
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;

    @Prop({ required: true })
    ownerLaborCost: number;

    @Prop({ required: true })
    managerLaborCosts: number;

    @Prop({ required: true })
    herdHealthAndMaintenanceLaborCosts: number;

    @Prop({ required: true })
    feederLaborCosts: number;

    @Prop({ required: true })
    cropLaborCosts: number;

    @Prop({ required: true })
    milkerLaborCosts: number;

    @Prop({ required: true })
    replacementLaborCosts: number;

    @Prop({ required: true })
    facilitiesAndEquipmentLaborCosts: number;

    @Prop({ required: true })
    otherEmployeeLaborCosts: number;

}

export const LabourCostOutputsSchema = SchemaFactory.createForClass(LabourCostOutput);
