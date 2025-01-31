// src/DairyEnterprisebudget/ghg/ghg.controller.ts

import { Controller, Post, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { GHGService } from './ghg.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GHGInputDto } from '../dto/ghg-model.dto';
import { GHGInput } from '../schemas/inputs/ghg-input.schema';

@Controller('ghg-emissions')
// @UseGuards(JwtAuthGuard)
export class GHGController {
  constructor(private readonly ghgService: GHGService) {}

  @Patch('updateInput/:email')
  async updateInput(
    @Param('email') email: string,
    @Body() updateDto: GHGInputDto,
  ) {
    console.log('Data got from client is ', updateDto.fatPercentage, updateDto.proteinPercentage);
    return this.ghgService.updateInput(email, updateDto);
  }

  @Get('inputDetails/:email')
  async getGHGInput(
    @Param('email') email: string,
  ): Promise<GHGInput | null> {
    console.log('Api got called');
    return this.ghgService.getGHGInput(email);
  }

  @Post('calculateEmissions/:userId')
  async calculateGHGMetrics(
    @Param('userId') userId: string,
    @Body() ghgInputs: {
      fatPercentage: number;
      proteinPercentage: number;
      averageUSTruckingEmissions: number;
    }) {
    return this.ghgService.calculateGHGMetrics(userId, ghgInputs);
  }

  @Get('outputDetails/:userId')
  async getGHGResults(@Param('userId') userId: string) {
    return this.ghgService.getGHGResults(userId);
  }
}
