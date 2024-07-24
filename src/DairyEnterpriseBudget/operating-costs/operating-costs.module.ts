import { Module } from "@nestjs/common";
import { OperatingCostsService } from "./operating-costs.service";
import { OperatingCostsController } from "./operating-costs.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { OperatingCostsInput, OperatingCostsInputSchema } from "../schemas/inputs/OperatingCostsInput.schema";
import { OperatingCostsOutput, OperatingCostsOutputSchema } from "../schemas/outputs/OperatingCostsOutput.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { ProductionDetailsInput, ProductionDetailsInputsSchema } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ProductionDetailsOutput, ProductionDetailsOutputSchema } from "../schemas/outputs/ProductionDetailsOutput.schema";

@Module({
    providers:[OperatingCostsService],
    controllers:[OperatingCostsController],
    imports:[
        MongooseModule.forFeature([
            {name: OperatingCostsInput.name, schema: OperatingCostsInputSchema},
            {name: OperatingCostsOutput.name, schema: OperatingCostsOutputSchema},
            {name: ProductionDetailsInput.name, schema: ProductionDetailsInputsSchema},
            {name: ProductionDetailsOutput.name, schema: ProductionDetailsOutputSchema},
            {name: User.name, schema: UserSchema}
        ])
    ]
})
export class OperatingCostsModule{}