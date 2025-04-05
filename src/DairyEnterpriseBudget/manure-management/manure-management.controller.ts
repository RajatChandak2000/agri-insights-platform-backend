import { Body, Controller, Param, Patch } from "@nestjs/common";
import { ManureManagementService } from "./manure-management.service";
import { ManureManagementInputDto } from "../dto/manure-management.dto";

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


}