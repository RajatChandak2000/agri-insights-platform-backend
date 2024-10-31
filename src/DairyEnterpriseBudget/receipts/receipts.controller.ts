import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ProductionDetailsInputDto } from "../dto";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { ReceiptsService } from "./receipts.service";
import { ReceiptsInputDto } from "../dto/receipts-input.dto";
import { ReceiptsOutput } from "../schemas/outputs/ReceiptsOutput.schema";
import { ProductionDetailsInput } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ReceiptsInput } from "../schemas/inputs/ReceiptsInput.schema";

@Controller('receipts')
export class ReceiptsController{
    constructor(private receiptsService: ReceiptsService){}

    @Patch('updateInput/:email')
    async updateInput(
        @Param('email') email: string,
        @Body() updateDto: ReceiptsInputDto
    ){
        console.log("Data got from client is ", updateDto);
        return this.receiptsService.updateInput(email, updateDto)
    }

    @Get('outputDetails/:email')
    async getReceiptsOutput(@Param('email') email:string): Promise<ReceiptsOutput | null>{
        console.log('Api got called');
        return this.receiptsService.getReceiptsOutput(email);
    }

    @Get('inputDetails/:email')
    async getReceiptsInput(@Param('email') email:string): Promise<ReceiptsInput | null>{
        console.log('Api got called');
        return this.receiptsService.getReceiptsInput(email);
    }

    @Post('calculateReceiptsOutput')
    async updateInputWithProductionDetails(
      @Body() body: { inputs: ReceiptsInputDto, productionDetails: ProductionDetailsInputDto }
    ) {
      
      const { inputs, productionDetails } = body;
      console.log(inputs)
      return this.receiptsService.calculateReceiptsOutput(inputs, productionDetails);
    }
  }