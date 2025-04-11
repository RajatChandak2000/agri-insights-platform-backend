import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ManureManagementService } from "./manure-management.service";
import { ManureManagementInputDto } from "../dto/manure-management.dto";
import { ManureManagementInput } from "../schemas/inputs/ManureManagementInput.schema";
import { ManureManagementOutput } from "../schemas/outputs/ManureManagementOutput.schema";

@Controller('manure-management')
export class ManureManagementController{
    constructor(private readonly manureManagementService: ManureManagementService) {}
    
    @Patch('updateInput/:email')
      async updateInput(
        @Param('email') email: string,
        @Body() updateDto: ManureManagementInputDto,
    ) {
        console.log("Request hit ", updateDto);
        
        return this.manureManagementService.updateInput(email, updateDto);
    }

    @Get('inputDetails/:email')
    async getManureManagementInput(
        @Param('email') email: string,
    ): Promise<ManureManagementInput | null> {
        return this.manureManagementService.getManureManagementInput(email);
    }

    @Get('outputDetails/:email')
    async getManureManagementOutput(
        @Param('email') email: string,
    ): Promise<ManureManagementOutput | null> {
        return this.manureManagementService.getManureManagementOutput(email);
    }
}