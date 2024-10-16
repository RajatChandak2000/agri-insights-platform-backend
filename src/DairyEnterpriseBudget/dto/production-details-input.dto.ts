import { IsNumber, IsObject, IsOptional } from "class-validator";

class MilkProductionInputsDto{
    @IsNumber()
    totalNumberOfCows: number;

    @IsNumber()
    calvingInterval: number;

    @IsNumber()
    expectedMilkProduction?: number;

    @IsNumber()
    expectedMilkPrice?: number;
}

class HeiferProductionInputsDto{
    @IsNumber()
    cullingRate?: number;

    @IsNumber() 
    cowDeathLossRate?: number;

    @IsNumber()
    heiferRaisingDeathLossRate?: number;

    @IsNumber()
    numberOfHeifersRaised?: number;

    @IsNumber()
    bullCalfDeath?: number;

    @IsNumber()
    expectedPercentMaleWithSexedSemen?: number;

    @IsNumber()
    expectedPercentMaleWithConventional?: number;
}

class BeefCrossProductionDetailsDto {
    @IsNumber()
    beefCrossPercent?: number;

    @IsNumber()
    beefCrossDeathRate?: number;
}

export class ProductionDetailsInputDto{
    @IsObject()
    milkProduction: MilkProductionInputsDto;

    @IsObject()
    heiferProduction: HeiferProductionInputsDto;

    @IsObject()
    beefCrossDetails: BeefCrossProductionDetailsDto;
}