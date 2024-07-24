import { Body, Controller, Param, Patch } from "@nestjs/common";
import { OperatingCostsService } from "./operating-costs.service";
import { OperatingCostsInputDto } from "../dto/operating-costs-input.dto";

@Controller('operating-costs')
export class OperatingCostsController{
    constructor(private operatingCostsService: OperatingCostsService){}

    @Patch('updateInput/:email')
    async updateInput(
        @Param('email') email,
        @Body() updateDto: OperatingCostsInputDto
    ){
        return this.operatingCostsService.updateInput(email, updateDto)
    }
}