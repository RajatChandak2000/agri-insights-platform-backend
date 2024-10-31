import { IsNumber, IsObject } from "class-validator";

class CornSilageDetailsDto {
  @IsNumber()
  cornSilageExpectedYieldTonsPerAcre: number;

  @IsNumber()
  cornSilageHarvestedAcres: number;

  @IsNumber()
  cornSilageEstimatedTotalOperatingCost: number;

  @IsNumber()
  cornSilagePercentOfForageFixedCostAllocated: number;

  @IsNumber()
  cornSilageShrinkLossPercentage: number;
}

class SorghumSilageDetailsDto {
  @IsNumber()
  sorghumSilageExpectedYieldTonsPerAcre: number;

  @IsNumber()
  sorghumSilageHarvestedAcres: number;

  @IsNumber()
  sorghumSilageEstimatedTotalOperatingCost: number;

  @IsNumber()
  sorghumSilagePercentOfForageFixedCostAllocated: number;

  @IsNumber()
  sorghumSilageShrinkLossPercentage: number;
}

class SmallGrainSilageDetailsDto {
  @IsNumber()
  smallGrainSilageExpectedYieldTonsPerAcre: number;

  @IsNumber()
  smallGrainSilageHarvestedAcres: number;

  @IsNumber()
  smallGrainSilageEstimatedTotalOperatingCost: number;

  @IsNumber()
  smallGrainSilagePercentOfForageFixedCostAllocated: number;

  @IsNumber()
  smallGrainSilageShrinkLossPercentage: number;
}

class GrassHayDetailsDto {
  @IsNumber()
  grassHayExpectedYieldTonsPerAcre: number;

  @IsNumber()
  grassHayHarvestedAcres: number;

  @IsNumber()
  grassHayEstimatedTotalOperatingCost: number;

  @IsNumber()
  grassHayPercentOfForageFixedCostAllocated: number;

  @IsNumber()
  grassHayShrinkLossPercentage: number;
}

class AlfalfaHayEstablishmentDetailsDto {
  @IsNumber()
  alfalfaHayEstablishmentExpectedYieldTonsPerAcre: number;

  @IsNumber()
  alfalfaHayEstablishmentHarvestedAcres: number;

  @IsNumber()
  alfalfaHayEstablishmentEstimatedTotalOperatingCost: number;

  @IsNumber()
  alfalfaHayEstablishmentPercentOfForageFixedCostAllocated: number;
}

class AlfalfaHayStandDetailsDto {
  @IsNumber()
  alfalfaHayStandExpectedYieldTonsPerAcre: number;

  @IsNumber()
  alfalfaHayStandHarvestedAcres: number;

  @IsNumber()
  alfalfaHayStandEstimatedTotalOperatingCost: number;

  @IsNumber()
  alfalfaHayStandPercentOfForageFixedCostAllocated: number;
}

class AlfalfaHayShrinkLossDto {
  @IsNumber()
  alfalfaHayShrinkLossPercentage: number;
}

export class RaisedForageInputDto {
  @IsObject()
  cornSilage: CornSilageDetailsDto;

  @IsObject()
  sorghumSilage: SorghumSilageDetailsDto;

  @IsObject()
  smallGrainSilage: SmallGrainSilageDetailsDto;

  @IsObject()
  grassHay: GrassHayDetailsDto;

  @IsObject()
  alfalfaHayEstablishment: AlfalfaHayEstablishmentDetailsDto;

  @IsObject()
  alfalfaHayStand: AlfalfaHayStandDetailsDto;

  @IsObject()
  alfalfaHayShrinkLoss: AlfalfaHayShrinkLossDto;
}
