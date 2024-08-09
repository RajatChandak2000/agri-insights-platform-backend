import { Module } from "@nestjs/common";
import { OperatingCostsService } from "./operating-costs.service";
import { OperatingCostsController } from "./operating-costs.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { OperatingCostsInput, OperatingCostsInputSchema } from "../schemas/inputs/OperatingCostsInput.schema";
import { OperatingCostsOutput, OperatingCostsOutputSchema } from "../schemas/outputs/OperatingCostsOutput.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { ProductionDetailsInput, ProductionDetailsInputsSchema } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ProductionDetailsOutput, ProductionDetailsOutputSchema } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { ProductionDetailsModule } from "../production-details/production-details.module";
import { ReceiptsModule } from "../receipts/receipts.module";
import { ReceiptsInput, ReceiptsInputSchema } from "../schemas/inputs/ReceiptsInput.schema";
import { ReceiptsOutput, ReceiptsOutputSchema } from "../schemas/outputs/ReceiptsOutput.schema";
import { ReceiptsService } from "../receipts/receipts.service";
import { LabourCostInput, LabourCostInputsSchema } from "../schemas/inputs/LabourInput.schema";
import { LabourCostOutput, LabourCostOutputsSchema } from "../schemas/outputs/LabourOutput.schema";
import { LabourCostService } from "../labour-cost/labour-cost.service";
@Module({
    providers:[OperatingCostsService,ReceiptsService,LabourCostService],
    controllers:[OperatingCostsController],
    imports:[
        ProductionDetailsModule,
        ReceiptsModule,
        MongooseModule.forFeature([
            {name: OperatingCostsInput.name, schema: OperatingCostsInputSchema},
            {name: OperatingCostsOutput.name, schema: OperatingCostsOutputSchema},
            {name: ProductionDetailsInput.name, schema: ProductionDetailsInputsSchema},
            {name: ReceiptsInput.name, schema: ReceiptsInputSchema},
            {name: ReceiptsOutput.name, schema: ReceiptsOutputSchema},
            {name: LabourCostInput.name, schema: LabourCostInputsSchema},
            {name: LabourCostOutput.name, schema:LabourCostOutputsSchema},
            {name: ProductionDetailsOutput.name, schema: ProductionDetailsOutputSchema},
            {name: User.name, schema: UserSchema}
        ])
    ]
})
export class OperatingCostsModule{}