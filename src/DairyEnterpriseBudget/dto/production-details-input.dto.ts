import { IsNumber, IsObject, IsOptional } from "class-validator";

class MilkProductionInputsDto{
    @IsNumber()
    @IsOptional()
    totalNumberOfCows?: number;

    @IsNumber()
    @IsOptional()
    calvingInterval?: number;

    @IsNumber()
    @IsOptional()
    expectedMilkProduction?: number;
}

class HeiferProductionInputsDto{
    @IsNumber()
    @IsOptional()
    cullingRate?: number;

    @IsNumber()
    @IsOptional()
    cowDeathLossRate?: number;

    @IsNumber()
    @IsOptional()
    heiferRaisingDeathLossRate?: number;

    @IsNumber()
    @IsOptional()
    numberOfHeifers?: number;

    @IsNumber()
    @IsOptional()
    bullCalfDeath?: number;

    @IsNumber()
    @IsOptional()
    expectedPercentMale?: number;
}

class BeefCrossProductionDetailsDto {
    @IsNumber()
    @IsOptional()
    beefCrossPercent?: number;

    @IsNumber()
    @IsOptional()
    beefCrossDeathRate?: number;
}

export class ProductionDetailsInputDto{
    @IsObject()
    @IsOptional()
    milkProduction?: MilkProductionInputsDto;

    @IsObject()
    @IsOptional()
    heiferProduction?: HeiferProductionInputsDto;

    @IsObject()
    @IsOptional()
    beefCrossDetails?: BeefCrossProductionDetailsDto;
}