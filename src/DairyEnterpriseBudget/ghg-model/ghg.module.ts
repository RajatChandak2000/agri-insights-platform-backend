import { Module } from "@nestjs/common";
import { GHGService } from "./ghg.service";
import { GHGController } from "./ghg.controller";
import { ProductionDetailsModule } from "../production-details/production-details.module";
import { MongooseModule } from "@nestjs/mongoose";
import { GHGInput, GHGInputSchema } from "../schemas/inputs/ghg-input.schema";
import { GHGOutput, GHGOutputSchema } from "../schemas/outputs/ghg-output.schema";
import { ProductionDetailsInput, ProductionDetailsInputsSchema } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ProductionDetailsOutput,ProductionDetailsOutputSchema } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { FeedDetailsInput, FeedDetailsInputsSchema } from "../schemas/inputs/FeedDetailsInput.schema";
import { FeedDetailsOutput, FeedDetailsOutputSchema } from "../schemas/outputs/FeedDetailsOutput.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";

@Module({
    providers: [GHGService],
    controllers: [GHGController],
    imports: [
        ProductionDetailsModule,
        MongooseModule.forFeature([
            {name: GHGInput.name, schema: GHGInputSchema},
            {name: GHGOutput.name, schema: GHGOutputSchema},
            {name: ProductionDetailsInput.name, schema: ProductionDetailsInputsSchema},
            {name:ProductionDetailsOutput.name, schema:ProductionDetailsOutputSchema},
            {name: FeedDetailsInput.name, schema: FeedDetailsInputsSchema},
            {name: FeedDetailsOutput.name, schema: FeedDetailsOutputSchema},
            {name: User.name, schema: UserSchema}
        ])
    ]
})
export class GHGModule {}