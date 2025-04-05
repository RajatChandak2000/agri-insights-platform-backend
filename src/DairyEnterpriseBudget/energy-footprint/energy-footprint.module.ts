import { Module } from "@nestjs/common";
import { EnergyFootprintService } from "./energy-footprint.service";
import { EnergyFootprintController } from "./energy-footprint.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { EnergyFootprintInput, EnergyFootprintInputSchema } from "../schemas/inputs/EnergyFootprintInput.schema";
import { EnergyFootprintOutput, EnergyFootprintOutputSchema } from "../schemas/outputs/EnergyFootprintOutput.schema";
import { GHGOutput, GHGOutputSchema } from "../schemas/outputs/ghg-output.schema";

@Module({
    providers: [EnergyFootprintService],
    controllers: [EnergyFootprintController],
    imports: [
        MongooseModule.forFeature([ 
            {name: EnergyFootprintInput.name, schema: EnergyFootprintInputSchema},
            {name: EnergyFootprintOutput.name, schema: EnergyFootprintOutputSchema},
            {name: GHGOutput.name, schema: GHGOutputSchema},
            {name: User.name, schema: UserSchema},  
        ])
    ]
})

export class EnergyFootprintModule {}