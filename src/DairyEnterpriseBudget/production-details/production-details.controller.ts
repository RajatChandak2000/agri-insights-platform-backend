import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ProductionDetailsService } from "./production-details.service";
import { ProductionDetailsInputDto } from "../dto";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { ProductionDetailsInput } from "../schemas/inputs/ProductionDetailsInput.schema";

@Controller('production-details')
export class ProductionDetailsController{
    constructor(private productionDetailsService: ProductionDetailsService){}

    @Patch('updateInput/:email')
    async updateInput(
        @Param('email') email: string,
        @Body() updateDto: ProductionDetailsInputDto
    ){
        console.log("Data got from client is ", updateDto);
        return this.productionDetailsService.updateInput(email, updateDto)
    }

    @Get('outputDetails/:email')
    async getProductionDetailsOutput(@Param('email') email:string): Promise<ProductionDetailsOutput | null>{
        console.log('Api got called');
        return this.productionDetailsService.getProductionDetailsOutput(email);
    }

    @Get('inputDetails/:email')
    async getProductionDetailsInput(@Param('email') email:string): Promise<ProductionDetailsInput | null>{
        console.log('Api got called');
        return this.productionDetailsService.getProductionDetailsInput(email);
    }
}