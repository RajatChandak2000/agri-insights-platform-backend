import { Module } from "@nestjs/common";
import { FeedDetailsController } from "./feed-details.controller";
import { FeedDetailsService } from "./feed-details.service";
import { MongooseModule } from "@nestjs/mongoose";
import { FeedDetailsInput, FeedDetailsInputsSchema } from "../schemas/inputs/FeedDetailsInput.schema";
import { FeedDetailsOutput, FeedDetailsOutputSchema } from "../schemas/outputs/FeedDetailsOutput.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { ProductionDetailsInput, ProductionDetailsInputsSchema } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ProductionDetailsOutput, ProductionDetailsOutputSchema } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { RaisedForageInput, RaisedForageInputsSchema } from "../schemas/inputs/RaisedForageInput.schema";

@Module({
    providers: [FeedDetailsService],
    controllers: [FeedDetailsController],
    exports: [],
    imports: [
        MongooseModule.forFeature([
            {name: FeedDetailsInput.name, schema: FeedDetailsInputsSchema},
            {name: FeedDetailsOutput.name, schema: FeedDetailsOutputSchema},
            {name: ProductionDetailsInput.name, schema: ProductionDetailsInputsSchema},
            {name: ProductionDetailsOutput.name, schema: ProductionDetailsOutputSchema},
            {name: RaisedForageInput.name, schema: RaisedForageInputsSchema},
            {name: User.name, schema: UserSchema}
        ])
    ],

})
export class FeedDetailsModule{}