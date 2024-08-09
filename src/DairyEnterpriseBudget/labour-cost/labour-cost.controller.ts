import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { LabourCostService } from "./labour-cost.service";
import { LabourCostInputDto } from "../dto/labour-cost-input.dto";
import { LabourCostInput } from "../schemas/inputs/LabourInput.schema";
import { LabourCostOutput } from "../schemas/outputs/LabourOutput.schema";

@Controller('labour-cost')
export class LabourCostController {
    constructor(private labourCostService: LabourCostService) {}

    @Patch('updateInput/:email')
    async updateInput(
        @Param('email') email: string,
        @Body() updateDto: LabourCostInputDto
    ) {
        console.log("Data received from client is ", updateDto);
        return this.labourCostService.updateInput(email, updateDto);
    }

    @Get('outputDetails/:email')
    async getLabourCostOutput(@Param('email') email: string): Promise<LabourCostOutput | null> {
        console.log('API called to get labour cost output');
        return this.labourCostService.getLabourCostOutput(email);
    }

    @Get('inputDetails/:email')
    async getLabourCostInput(@Param('email') email: string): Promise<LabourCostInput | null> {
        console.log('API called to get labour cost input');
        return this.labourCostService.getLabourCostInput(email);
    }

    @Post('calculateLabourCost')
    async calculateOutputs(@Body() inputDto: LabourCostInputDto) {
        console.log("Calculating labour cost outputs for non-authenticated user");
        return this.labourCostService.calculateLabourCostOutput(inputDto);
    }
}
