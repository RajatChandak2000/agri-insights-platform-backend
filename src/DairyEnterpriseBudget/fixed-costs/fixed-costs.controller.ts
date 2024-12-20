import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { FixedCostsService } from './fixed-costs.service';
import { FixedCostsInputDto } from '../dto/fixed-costs-input.dto';
import { FixedCostsOutput } from '../schemas/outputs/FixedCostsOutput.schema';
import { FixedCostsInput } from '../schemas/inputs/FixedCostsInput.schema';

@Controller('fixed-costs')
export class FixedCostsController {
  constructor(private fixedCostsSerive: FixedCostsService) {}

  @Patch('updateInput/:email')
  async updateInput(
    @Param('email') email: string,
    @Body() updateDto: FixedCostsInputDto,
  ) {
    return this.fixedCostsSerive.updateInput(email, updateDto);
  }

  @Get('outputDetails/:email')
  async getFixedCostsOutput(
    @Param('email') email: string,
  ): Promise<FixedCostsOutput | null> {
    console.log('Api got called');
    return this.fixedCostsSerive.getFixedCostsOutput(email);
  }

  @Get('inputDetails/:email')
  async getFixedCostsInput(
    @Param('email') email: string,
  ): Promise<FixedCostsInput | null> {
    console.log('Api got called');
    return this.fixedCostsSerive.getFixedCostsInput(email);
  }
}
