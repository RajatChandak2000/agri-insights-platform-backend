// src/DairyEnterprisebudget/ghg/ghg.controller.ts

import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { GHGService } from './ghg.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('ghg')
@UseGuards(JwtAuthGuard)
export class GHGController {
  constructor(private readonly ghgService: GHGService) {}

  @Post('calculate/:userId')
  async calculateGHGMetrics(
    @Param('userId') userId: string,
    @Body() ghgInputs: {
      fpcmInputs: {
        fatPercentage: number;
        proteinPercentage: number;
      };
      characterizationFactors: {
        cornSilageCharacterizationFactor: number;
        sorghumSilageCharacterizationFactor: number;
        smallGrainCharacterizationFactor: number;
        grassHayCharacterizationFactor: number;
        alfalfaCharacterizationFactor: number;
        peanutHullsCharacterizationFactor: number;
        applePomaceCharacterizationFactor: number;
        distillersCharacterizationFactor: number;
        brewersCharacterizationFactor: number;
        citrusPulpCharacterizationFactor: number;
        cornGlutenCharacterizationFactor: number;
        wholeCottonseedCharacterizationFactor: number;
        cottonseedHullsCharacterizationFactor: number;
        soybean48CharacterizationFactor: number;
      };
      averageUSTruckingEmissions: number;
    }) {
    return this.ghgService.calculateGHGMetrics(userId, ghgInputs);
  }

  @Get('results/:userId')
  async getGHGResults(@Param('userId') userId: string) {
    return this.ghgService.getGHGResults(userId);
  }
}
