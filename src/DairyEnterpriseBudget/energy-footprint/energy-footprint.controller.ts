import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { EnergyFootprintService } from "./energy-footprint.service";
import { EnergyFootprintInputDto } from "../dto/energy-footprint.dto";
import { EnergyFootprintOutput } from "../schemas/outputs/EnergyFootprintOutput.schema";
import { EnergyFootprintInput } from "../schemas/inputs/EnergyFootprintInput.schema";

@Controller('energy-footprint')
export class EnergyFootprintController {
    constructor(private energyFootprintService: EnergyFootprintService) {}

    @Patch('updateInput/:email')
    async updateInput(
        @Param('email') email: string,
        @Body() updateDto: EnergyFootprintInputDto,
    ) {
        console.log('Data got from client is ', updateDto);
        return this.energyFootprintService.updateInput(email, updateDto);
    }

    @Get('outputDetails/:email')
    async getEnergyFootprintOutput(
        @Param('email') email: string,
    ): Promise<EnergyFootprintOutput | null> {
        console.log('Api got called');
        return this.energyFootprintService.getEnergyFootprintOutput(email);
    }

    @Get('inputDetails/:email')
    async getEnergyFootprintInput(
        @Param('email') email: string,
    ): Promise<EnergyFootprintInput | null> {
        console.log('Api got called');
        return this.energyFootprintService.getEnergyFootprintInput(email);
    }

    // @Post('calculateProductionDetails')
    //   async calculateOutputs(@Body() inputDto: EnergyFootprintInputDto) {
    //     console.log('Calculating outputs for non-authenticated user');
    //     return this.energyFootprintService.calculateEnergyFootprintOutput(
        
    //       inputDto,
    //     );
    // }
}