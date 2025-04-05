import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FeedDetailsInput, FeedDetailsInputsSchema } from "../schemas/inputs/FeedDetailsInput.schema";
import { FeedDetailsOutput, FeedDetailsOutputSchema } from "../schemas/outputs/FeedDetailsOutput.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { ManureManagementService } from "./manure-management.service";
import { ManureManagementController } from "./manure-management.controller";
import { GHGOutput, GHGOutputSchema } from "../schemas/outputs/ghg-output.schema";
import { ProductionDetailsOutput, ProductionDetailsOutputSchema } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { ManureManagementInput, ManureManagementInputSchema } from "../schemas/inputs/ManureManagementInput.schema";
import { ManureManagementOutput, ManureManagementOutputSchema } from "../schemas/outputs/ManureManagementOutput.schema";

@Module({
    providers: [ManureManagementService],
    controllers: [ManureManagementController],
    imports: [
        MongooseModule.forFeature([
            {name: ManureManagementInput.name, schema: ManureManagementInputSchema},
            {name: ManureManagementOutput.name, schema: ManureManagementOutputSchema},
            {name: FeedDetailsInput.name, schema: FeedDetailsInputsSchema},
            {name: FeedDetailsOutput.name, schema: FeedDetailsOutputSchema},
            {name: ProductionDetailsOutput.name, schema: ProductionDetailsOutputSchema},
            {name: GHGOutput.name, schema: GHGOutputSchema},
            {name: User.name, schema: UserSchema}
        ])
    ]
})
export class ManureManagementModule {}