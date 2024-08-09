import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class LabourCostInput extends Document {

    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;

    @Prop({ required: true })
    numberOfOwners: number;

    @Prop({ required: true })
    ownerSalary: number;

    @Prop({ required: true })
    ownerBenefits: number;

    @Prop({ required: true })
    numberOfManagers: number;

    @Prop({ required: true })
    managerSalary: number;

    @Prop({ required: true })
    managerBenefits: number;

    @Prop({ required: true })
    numberOfHerdHealthEmployees: number;

    @Prop({ required: true })
    herdHealthEmployeeTime: number;

    @Prop({ required: true })
    herdHealthEmployeeWage: number;

    @Prop({ required: true })
    herdHealthEmployeeBenefits: number;

    @Prop({ required: true })
    numberOfFeederEmployees: number;

    @Prop({ required: true })
    feederEmployeeTime: number;

    @Prop({ required: true })
    feederEmployeeWage: number;

    @Prop({ required: true })
    feederEmployeeBenefits: number;

    @Prop({ required: true })
    numberOfCropEmployees: number;

    @Prop({ required: true })
    cropEmployeeTime: number;

    @Prop({ required: true })
    cropEmployeeWage: number;

    @Prop({ required: true })
    cropEmployeeBenefits: number;

    @Prop({ required: true })
    numberOfMilkerEmployees: number;

    @Prop({ required: true })
    milkerEmployeeTime: number;

    @Prop({ required: true })
    milkerEmployeeWage: number;

    @Prop({ required: true })
    milkerEmployeeBenefits: number;

    @Prop({ required: true })
    replacementEmployees: number;

    @Prop({ required: true })
    replacementEmployeeTime: number;

    @Prop({ required: true })
    replacementEmployeeWage: number;

    @Prop({ required: true })
    replacementEmployeeBenefits: number;

    @Prop({ required: true })
    facilitiesEmployees: number;

    @Prop({ required: true })
    facilitiesEmployeeTime: number;

    @Prop({ required: true })
    facilitiesEmployeeWage: number;

    @Prop({ required: true })
    facilitiesEmployeeBenefits: number;

    @Prop({ required: true })
    otherEmployees: number;

    @Prop({ required: true })
    otherEmployeeTime: number;

    @Prop({ required: true })
    otherEmployeeWage: number;

    @Prop({ required: true })
    otherEmployeeBenefits: number;

  
}

export const LabourCostInputsSchema = SchemaFactory.createForClass(LabourCostInput);
