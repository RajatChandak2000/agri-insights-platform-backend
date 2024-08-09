import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { OperatingCostsService } from "./operating-costs.service";
import { OperatingCostsInputDto } from "../dto/operating-costs-input.dto";
import { OperatingCostsOutput } from "../schemas/outputs/OperatingCostsOutput.schema"
import { OperatingCostsInput } from "../schemas/inputs/OperatingCostsInput.schema";
import { ProductionDetailsInputDto } from "../dto";
import { ReceiptsInputDto } from "../dto/receipts-input.dto";
import { LabourCostInputDto } from "../dto/labour-cost-input.dto";
@Controller('operating-costs')
export class OperatingCostsController{
    constructor(private operatingCostsService: OperatingCostsService){}

    @Patch('updateInput/:email')
    async updateInput(
        @Param('email') email,
        @Body() updateDto: OperatingCostsInputDto
    ){
        console.log("Operating Cost input received from client:", updateDto);
        return this.operatingCostsService.updateInput(email, updateDto)
    }


    @Get('operatingCostoutputDetails/:email')
    async geOperatingCostDetailsOutput(@Param('email') email:string): Promise<OperatingCostsOutput | null> {
    console.log('Fetching Operating cost output details for email:', email);
    return this.operatingCostsService.getOperatingCostOutput(email);
    }

    @Get('OperatingCostinputDetails/:email')
    async getOperatingCostInput(@Param('email') email:string): Promise<OperatingCostsInput | null>{
        console.log('Fetching input details for email : ',email);
        return this.operatingCostsService.getOperatingCostInput(email);
    }

    @Post('calculateOperatingCost')
    async calculateOutputs(
      @Body() body: { inputs: OperatingCostsInputDto; productionDetails: ProductionDetailsInputDto; reciptsInputs: ReceiptsInputDto, labourInputs: LabourCostInputDto }
    ) {
      // Log the entire request body to see the structure and data
      console.log('Received body:', body);
    
      // Destructure the body to get individual inputs
      const { inputs, productionDetails, reciptsInputs, labourInputs } = body;
    
      // Log each input separately
      console.log('Inputs:', inputs);
      console.log('Production Details:', productionDetails);
      console.log('Receipts Inputs:', reciptsInputs);
    
      // Proceed with processing
      console.log('Calculating Operating Cost outputs for non-authenticated user');
      return this.operatingCostsService.calculateOperatingCostsOutput(inputs, productionDetails, reciptsInputs,labourInputs);
    }
}

