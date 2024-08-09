import { Module } from "@nestjs/common";
import { LabourCostService } from "./labour-cost.service";
import { LabourCostController } from "./labour-cost.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { LabourCostInput, LabourCostInputsSchema } from "../schemas/inputs/LabourInput.schema";
import { LabourCostOutput, LabourCostOutputsSchema } from "../schemas/outputs/LabourOutput.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";

@Module({
    providers: [LabourCostService],
    controllers: [LabourCostController],
    exports: [LabourCostService],
    imports: [
        MongooseModule.forFeature([
            { name: LabourCostInput.name, schema: LabourCostInputsSchema },
            { name: LabourCostOutput.name, schema: LabourCostOutputsSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
})
export class LabourCostModule {}
