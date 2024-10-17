import { IsNumber, IsObject, IsOptional, IsBoolean } from "class-validator";

class CattleFixedCostDto {
    @IsOptional()
    @IsNumber()
    cowPurchaseValue?: number;

    @IsOptional()
    @IsNumber()
    overheadCostPerCow?: number;

    @IsOptional()
    @IsNumber()
    numberOfBredHeifers?: number;

    @IsOptional()
    @IsNumber()
    bredHeiferPurchaseValue?: number;

    @IsOptional()
    @IsNumber()
    numberOfOneYearOldHeifers?: number;

    @IsOptional()
    @IsNumber()
    oneYearOldHeiferPurchaseValue?: number;

    @IsOptional()
    @IsNumber()
    numberOfWeanedHeiferCalves?: number;

    @IsOptional()
    @IsNumber()
    weanedHeiferCalvesPurchaseValue?: number;
}

class FacilitiesAndBuildingsFixedCostDto {
    @IsOptional()
    @IsNumber()
    farmShopAndGeneralRoadsInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    farmShopAndGeneralRoadsYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    milkingParlorAndEquipmentInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    milkingParlorAndEquipmentYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    feedingEquipmentInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    feedingEquipmentYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    freestallHousingAndLanesInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    freestallHousingAndLanesYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    threePhasePowerSupplyInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    threePhasePowerSupplyYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    waterSystemInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    waterSystemYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    hayShedInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    hayShedYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    trenchSilosInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    trenchSilosYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    fencesInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    fencesYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    commodityBarnInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    commodityBarnYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    calfOrHeiferBarnInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    calfOrHeiferBarnYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    tiltTableInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    tiltTableYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    cattleHandlingFacilitiesInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    cattleHandlingFacilitiesYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    otherFacilitiesAndBuildings1InitialInvestment?: number

    @IsOptional()
    @IsNumber()
    otherFacilitiesAndBuildings1YearsOfUsefulLife?: number

    @IsOptional()
    @IsNumber()
    otherFacilitiesAndBuildings2InitialInvestment?: number

    @IsOptional()
    @IsNumber()
    otherFacilitiesAndBuildings2YearsOfUsefulLife?: number
}

class WasteManagementFixedCostsDto {
    @IsOptional()
    @IsNumber()
    wasteStoragePondInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    wasteStoragePondYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    compactClayLinerInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    compactClayLinerYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    monitoringWellsInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    monitoringWellsYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    solidsSeparatorInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    solidsSeparatorYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    lagoonPumpInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    lagoonPumpYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    pipesInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    pipesYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    powerUnitInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    powerUnitYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    irrigationSystemInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    irrigationSystemYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    agitatorInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    agitatorYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    manureSpreaderInitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    manureSpreaderYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    otherManureManagementStructure1InitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    otherManureManagementStructure1YearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    otherManureManagementStructure2InitialInvestment?: number;

    @IsOptional()
    @IsNumber()
    otherManureManagementStructure2YearsOfUsefulLife?: number;

}

class MachineryFixedCostsDto {
    @IsOptional()
    @IsNumber()
    machineryFixedCostTotalEstimate?: number;
}

class DetailedMachineryFixedCostsDto {
    @IsOptional()
    @IsNumber()
    articulatedLoadersInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    numberOfArticulatedLoaders?: number;

    @IsOptional()
    @IsNumber()
    articulatedLoadersTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    articulatedLoadersDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    articulatedLoadersEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    articulatedLoadersYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    skidSteerLoadersInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    numberOfSkidSteerLoaders?: number;

    @IsOptional()
    @IsNumber()
    skidSteerLoadersTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    skidSteerLoadersDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    skidSteerLoadersEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    skidSteerYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    hpTractor130MfwDInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    hpTractor130MfwDTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor130MfwDDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor130MfwDEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    hpTractor130MfwDYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    hpTractor75InitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    hpTractor75TotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor75DairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor75EquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    hpTractor75YearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    hpTractor50InitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    hpTractor50TotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor50DairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor50EquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    hpTractor50YearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    mixerWagon650InitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    mixerWagon650TotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    mixerWagon650DairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    mixerWagon650EquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    mixerWagon650YearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    threeQuarterTonPickupInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    threeQuarterTonPickupTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    threeQuarterTonPickupDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    threeQuarterTonPickupEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    threeQuarterTonPickupYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    halfTonPickupInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    halfTonPickupTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    halfTonPickupDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    halfTonPickupEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    halfTonPickupYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    jdGatorInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    jdGatorTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    jdGatorDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    jdGatorEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    jdGatorYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    sandSpreaderInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    sandSpreaderTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    sandSpreaderDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    sandSpreaderEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    sandSpreaderYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    hpTractor300MfwDInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    hpTractor300MfwDTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor300MfwDDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor300MfwDEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    hpTractor300MfwDYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    hpTractor200MfwDInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    hpTractor200MfwDTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor200MfwDDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    hpTractor200MfwDEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    hpTractor200MfwDYearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    diskHarrow24InitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    diskHarrow24TotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    diskHarrow24DairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    diskHarrow24EquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    diskHarrow24YearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    foldingSprayer40InitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    foldingSprayer40TotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    foldingSprayer40DairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    foldingSprayer40EquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    foldingSprayer40YearsOfUsefulLife?: number;

    @IsOptional()
    @IsNumber()
    cornPicker6RowInitialInvestmentPerUnit?: number;

    @IsOptional()
    @IsNumber()
    cornPicker6RowTotalHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    cornPicker6RowDairyHoursOfUse?: number;

    @IsOptional()
    @IsNumber()
    cornPicker6RowEquipmentAge?: number;

    @IsOptional()
    @IsNumber()
    cornPicker6RowYearsOfUsefulLife?: number;
}

class LandFixedCostsDto {
    @IsNumber()
    acres?: number;

    @IsNumber()
    rentalCost?: number;
}

export class FixedCostsInputDto {
    @IsObject()
    @IsOptional()
    cattleFixedCost?: CattleFixedCostDto;

    @IsObject()
    @IsOptional()
    facilitiesAndBuildingsFixedCost?: FacilitiesAndBuildingsFixedCostDto;

    @IsObject()
    @IsOptional()
    wasteManagementFixedCosts?: WasteManagementFixedCostsDto;

    @IsObject()
    @IsOptional()
    machineryFixedCosts?: MachineryFixedCostsDto;

    @IsObject()
    @IsOptional()
    detailedMachineryFixedCosts?: DetailedMachineryFixedCostsDto;

    @IsObject()
    @IsOptional()
    landFixedCosts?: LandFixedCostsDto;

    @IsOptional()
    @IsBoolean()
    isDetailedMachineryCosts?: boolean;
}
