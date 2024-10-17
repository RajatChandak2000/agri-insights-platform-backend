import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
class CattleFixedCostInputs {
    @Prop({ required: true })
    cowPurchaseValue: number;

    @Prop({ required: true })
    overheadCostPerCow: number;

    @Prop({ required: true })
    numberOfBredHeifers: number;

    @Prop({ required: true })
    bredHeiferPurchaseValue: number;

    @Prop({ required: true })
    numberOfOneYearOldHeifers: number;

    @Prop({ required: true })
    oneYearOldHeiferPurchaseValue: number;

    @Prop({ required: true })
    numberOfWeanedHeiferCalves: number;

    @Prop({ required: true })
    weanedHeiferCalvesPurchaseValue: number;
}

@Schema()
class FacilitiesAndBuildingsFixedCostInputs {
    @Prop({ required: true })
    farmShopAndGeneralRoadsInitialInvestment: number;

    @Prop({ required: true })
    farmShopAndGeneralRoadsYearsOfUsefulLife: number;

    @Prop({ required: true })
    milkingParlorAndEquipmentInitialInvestment: number;

    @Prop({ required: true })
    milkingParlorAndEquipmentYearsOfUsefulLife: number;

    @Prop({ required: true })
    feedingEquipmentInitialInvestment: number;

    @Prop({ required: true })
    feedingEquipmentYearsOfUsefulLife: number;

    @Prop({ required: true })
    freestallHousingAndLanesInitialInvestment: number;

    @Prop({ required: true })
    freestallHousingAndLanesYearsOfUsefulLife: number;

    @Prop({ required: true })
    threePhasePowerSupplyInitialInvestment: number;

    @Prop({ required: true })
    threePhasePowerSupplyYearsOfUsefulLife: number;

    @Prop({ required: true })
    waterSystemInitialInvestment: number;

    @Prop({ required: true })
    waterSystemYearsOfUsefulLife: number;

    @Prop({ required: true })
    hayShedInitialInvestment: number;

    @Prop({ required: true })
    hayShedYearsOfUsefulLife: number;

    @Prop({ required: true })
    trenchSilosInitialInvestment: number;

    @Prop({ required: true })
    trenchSilosYearsOfUsefulLife: number;

    @Prop({ required: true })
    fencesInitialInvestment: number;

    @Prop({ required: true })
    fencesYearsOfUsefulLife: number;

    @Prop({ required: true })
    commodityBarnInitialInvestment: number;

    @Prop({ required: true })
    commodityBarnYearsOfUsefulLife: number;

    @Prop({ required: true })
    calfOrHeiferBarnInitialInvestment: number;

    @Prop({ required: true })
    calfOrHeiferBarnYearsOfUsefulLife: number;

    @Prop({ required: true })
    tiltTableInitialInvestment: number;

    @Prop({ required: true })
    tiltTableYearsOfUsefulLife: number;

    @Prop({ required: true })
    cattleHandlingFacilitiesInitialInvestment: number;

    @Prop({ required: true })
    cattleHandlingFacilitiesYearsOfUsefulLife: number;

    @Prop({ required: true })
    otherFacilitiesAndBuildings1InitialInvestment: number;

    @Prop({ required: true })
    otherFacilitiesAndBuildings1YearsOfUsefulLife: number;

    @Prop({ required: true })
    otherFacilitiesAndBuildings2InitialInvestment: number;

    @Prop({ required: true })
    otherFacilitiesAndBuildings2YearsOfUsefulLife: number;
}

@Schema()
class WasteManagementFixedCostsInputs {
    @Prop({ required: true })
    wasteStoragePondInitialInvestment: number;

    @Prop({ required: true })
    wasteStoragePondYearsOfUsefulLife: number;

    @Prop({ required: true })
    compactClayLinerInitialInvestment: number;

    @Prop({ required: true })
    compactClayLinerYearsOfUsefulLife: number;

    @Prop({ required: true })
    monitoringWellsInitialInvestment: number;

    @Prop({ required: true })
    monitoringWellsYearsOfUsefulLife: number;

    @Prop({ required: true })
    solidsSeparatorInitialInvestment: number;

    @Prop({ required: true })
    solidsSeparatorYearsOfUsefulLife: number;

    @Prop({ required: true })
    lagoonPumpInitialInvestment: number;

    @Prop({ required: true })
    lagoonPumpYearsOfUsefulLife: number;

    @Prop({ required: true })
    pipesInitialInvestment: number;

    @Prop({ required: true })
    pipesYearsOfUsefulLife: number;

    @Prop({ required: true })
    powerUnitInitialInvestment: number;

    @Prop({ required: true })
    powerUnitYearsOfUsefulLife: number;

    @Prop({ required: true })
    irrigationSystemInitialInvestment: number;

    @Prop({ required: true })
    irrigationSystemYearsOfUsefulLife: number;

    @Prop({ required: true })
    agitatorInitialInvestment: number;

    @Prop({ required: true })
    agitatorYearsOfUsefulLife: number;

    @Prop({ required: true })
    manureSpreaderInitialInvestment: number;

    @Prop({ required: true })
    manureSpreaderYearsOfUsefulLife: number;

    @Prop({ required: true })
    otherManureManagementStructure1InitialInvestment: number;

    @Prop({ required: true })
    otherManureManagementStructure1YearsOfUsefulLife: number;

    @Prop({ required: true })
    otherManureManagementStructure2InitialInvestment: number;

    @Prop({ required: true })
    otherManureManagementStructure2YearsOfUsefulLife: number;

}

@Schema()
class MachineryFixedCostsInputs {
    @Prop({ required: true })
    machineryFixedCostTotalEstimate: number;
}

@Schema()
class DetailedMachineryFixedCostsInputs {
    @Prop({ required: true })
    articulatedLoadersInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfArticulatedLoaders: number;

    @Prop({ required: true })
    articulatedLoadersTotalHoursOfUse: number;

    @Prop({ required: true })
    articulatedLoadersDairyHoursOfUse: number;

    @Prop({ required: true })
    articulatedLoadersEquipmentAge: number;

    @Prop({ required: true })
    articulatedLoadersYearsOfUsefulLife: number;

    @Prop({ required: true })
    skidSteerLoadersInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfSkidSteerLoaders: number;

    @Prop({ required: true })
    skidSteerLoadersTotalHoursOfUse: number;

    @Prop({ required: true })
    skidSteerLoadersDairyHoursOfUse: number;

    @Prop({ required: true })
    skidSteerLoadersEquipmentAge: number;

    @Prop({ required: true })
    skidSteerLoadersYearsOfUsefulLife: number;

    @Prop({ required: true })
    hpTractor130MfwDInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfHpTractorMFWD130: number;

    @Prop({ required: true })
    hpTractor130MfwDTotalHoursOfUse: number;

    @Prop({ required: true })
    hpTractor130MfwDDairyHoursOfUse: number;

    @Prop({ required: true })
    hpTractor130MfwDEquipmentAge: number;

    @Prop({ required: true })
    hpTractor130MfwDYearsOfUsefulLife: number;

    @Prop({ required: true })
    hpTractor75InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfHpTractor75: number;

    @Prop({ required: true })
    hpTractor75TotalHoursOfUse: number;

    @Prop({ required: true })
    hpTractor75DairyHoursOfUse: number;

    @Prop({ required: true })
    hpTractor75EquipmentAge: number;

    @Prop({ required: true })
    hpTractor75YearsOfUsefulLife: number;

    @Prop({ required: true })
    hpTractor50InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfHpTractor50: number;

    @Prop({ required: true })
    hpTractor50TotalHoursOfUse: number;

    @Prop({ required: true })
    hpTractor50DairyHoursOfUse: number;

    @Prop({ required: true })
    hpTractor50EquipmentAge: number;

    @Prop({ required: true })
    hpTractor50YearsOfUsefulLife: number;

    @Prop({ required: true })
    mixerWagon650InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfMixerWagon650: number;

    @Prop({ required: true })
    mixerWagon650TotalHoursOfUse: number;

    @Prop({ required: true })
    mixerWagon650DairyHoursOfUse: number;

    @Prop({ required: true })
    mixerWagon650EquipmentAge: number;

    @Prop({ required: true })
    mixerWagon650YearsOfUsefulLife: number;

    @Prop({ required: true })
    threeQuarterTonPickupInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfThreeQuarterTonPickup: number;

    @Prop({ required: true })
    threeQuarterTonPickupTotalHoursOfUse: number;

    @Prop({ required: true })
    threeQuarterTonPickupDairyHoursOfUse: number;

    @Prop({ required: true })
    threeQuarterTonPickupEquipmentAge: number;

    @Prop({ required: true })
    threeQuarterTonPickupYearsOfUsefulLife: number;

    @Prop({ required: true })
    halfTonPickupInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfHalfTonPickup: number;

    @Prop({ required: true })
    halfTonPickupTotalHoursOfUse: number;

    @Prop({ required: true })
    halfTonPickupDairyHoursOfUse: number;

    @Prop({ required: true })
    halfTonPickupEquipmentAge: number;

    @Prop({ required: true })
    halfTonPickupYearsOfUsefulLife: number;

    @Prop({ required: true })
    jdGatorInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfJdGator: number;

    @Prop({ required: true })
    jdGatorTotalHoursOfUse: number;

    @Prop({ required: true })
    jdGatorDairyHoursOfUse: number;

    @Prop({ required: true })
    jdGatorEquipmentAge: number;

    @Prop({ required: true })
    jdGatorYearsOfUsefulLife: number;

    @Prop({ required: true })
    sandSpreaderInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfSandSpreader: number;

    @Prop({ required: true })
    sandSpreaderTotalHoursOfUse: number;

    @Prop({ required: true })
    sandSpreaderDairyHoursOfUse: number;

    @Prop({ required: true })
    sandSpreaderEquipmentAge: number;

    @Prop({ required: true })
    sandSpreaderYearsOfUsefulLife: number;

    @Prop({ required: true })
    hpTractor300MfwDInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfHpTractorMfwd300: number;

    @Prop({ required: true })
    hpTractor300MfwDTotalHoursOfUse: number;

    @Prop({ required: true })
    hpTractor300MfwDDairyHoursOfUse: number;

    @Prop({ required: true })
    hpTractor300MfwDEquipmentAge: number;

    @Prop({ required: true })
    hpTractor300MfwDYearsOfUsefulLife: number;

    @Prop({ required: true })
    hpTractor200MfwDInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfHpTractorMFWD200: number;

    @Prop({ required: true })
    hpTractor200MfwDTotalHoursOfUse: number;

    @Prop({ required: true })
    hpTractor200MfwDDairyHoursOfUse: number;

    @Prop({ required: true })
    hpTractor200MfwDEquipmentAge: number;

    @Prop({ required: true })
    hpTractor200MfwDYearsOfUsefulLife: number;

    @Prop({ required: true })
    diskHarrow24InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfDiskHarrow24: number;

    @Prop({ required: true })
    diskHarrow24TotalHoursOfUse: number;

    @Prop({ required: true })
    diskHarrow24DairyHoursOfUse: number;

    @Prop({ required: true })
    diskHarrow24EquipmentAge: number;

    @Prop({ required: true })
    diskHarrow24YearsOfUsefulLife: number;

    @Prop({ required: true })
    stripTillPlanter8RowInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfStripTillPlanter8Row: number;

    @Prop({ required: true })
    stripTillPlanter8RowTotalHoursOfUse: number;

    @Prop({ required: true })
    stripTillPlanter8RowDairyHoursOfUse: number;

    @Prop({ required: true })
    stripTillPlanter8RowEquipmentAge: number;

    @Prop({ required: true })
    stripTillPlanter8RowYearsOfUsefulLife: number;

    @Prop({ required: true })
    foldingSprayer40InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfFoldingSprayer40: number;

    @Prop({ required: true })
    foldingSprayer40TotalHoursOfUse: number;

    @Prop({ required: true })
    foldingSprayer40DairyHoursOfUse: number;

    @Prop({ required: true })
    foldingSprayer40EquipmentAge: number;

    @Prop({ required: true })
    foldingSprayer40YearsOfUsefulLife: number;

    // Field Cultivator
    @Prop({ required: true })
    fieldCultivatorInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfFieldCultivator: number;

    @Prop({ required: true })
    fieldCultivatorTotalHoursOfUse: number;

    @Prop({ required: true })
    fieldCultivatorDairyHoursOfUse: number;

    @Prop({ required: true })
    fieldCultivatorEquipmentAge: number;

    @Prop({ required: true })
    fieldCultivatorYearsOfUsefulLife: number;

    // Grain drill - 15’ no-till
    @Prop({ required: true })
    grainDrill15NoTillInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfGrainDrill15NoTill: number;

    @Prop({ required: true })
    grainDrill15NoTillTotalHoursOfUse: number;

    @Prop({ required: true })
    grainDrill15NoTillDairyHoursOfUse: number;

    @Prop({ required: true })
    grainDrill15NoTillEquipmentAge: number;

    @Prop({ required: true })
    grainDrill15NoTillYearsOfUsefulLife: number;

    // Mower conditioner (self-propelled)
    @Prop({ required: true })
    mowerConditionerSelfPropelledInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfMowerConditionerSelfPropelled: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledTotalHoursOfUse: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledDairyHoursOfUse: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledEquipmentAge: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledYearsOfUsefulLife: number;

    // Tedder
    @Prop({ required: true })
    tedderInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfTedder: number;

    @Prop({ required: true })
    tedderTotalHoursOfUse: number;

    @Prop({ required: true })
    tedderDairyHoursOfUse: number;

    @Prop({ required: true })
    tedderEquipmentAge: number;

    @Prop({ required: true })
    tedderYearsOfUsefulLife: number;

    // Power Rake
    @Prop({ required: true })
    powerRakeInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfPowerRake: number;

    @Prop({ required: true })
    powerRakeTotalHoursOfUse: number;

    @Prop({ required: true })
    powerRakeDairyHoursOfUse: number;

    @Prop({ required: true })
    powerRakeEquipmentAge: number;

    @Prop({ required: true })
    powerRakeYearsOfUsefulLife: number;

    // 15’ folding rotary mower
    @Prop({ required: true })
    foldingRotaryMower15InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfFoldingRotaryMower15: number;

    @Prop({ required: true })
    foldingRotaryMower15TotalHoursOfUse: number;

    @Prop({ required: true })
    foldingRotaryMower15DairyHoursOfUse: number;

    @Prop({ required: true })
    foldingRotaryMower15EquipmentAge: number;

    @Prop({ required: true })
    foldingRotaryMower15YearsOfUsefulLife: number;

    // Deep-ripper
    @Prop({ required: true })
    deepRipperInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfDeepRipper: number;

    @Prop({ required: true })
    deepRipperTotalHoursOfUse: number;

    @Prop({ required: true })
    deepRipperDairyHoursOfUse: number;

    @Prop({ required: true })
    deepRipperEquipmentAge: number;

    @Prop({ required: true })
    deepRipperYearsOfUsefulLife: number;

    // 24’ Livestock trailer
    @Prop({ required: true })
    livestockTrailer24InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfLivestockTrailer24: number;

    @Prop({ required: true })
    livestockTrailer24TotalHoursOfUse: number;

    @Prop({ required: true })
    livestockTrailer24DairyHoursOfUse: number;

    @Prop({ required: true })
    livestockTrailer24EquipmentAge: number;

    @Prop({ required: true })
    livestockTrailer24YearsOfUsefulLife: number;

    // Round baler
    @Prop({ required: true })
    roundBalerInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfRoundBaler: number;

    @Prop({ required: true })
    roundBalerTotalHoursOfUse: number;

    @Prop({ required: true })
    roundBalerDairyHoursOfUse: number;

    @Prop({ required: true })
    roundBalerEquipmentAge: number;

    @Prop({ required: true })
    roundBalerYearsOfUsefulLife: number;

    // Tub grinder
    @Prop({ required: true })
    tubGrinderInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfTubGrinder: number;

    @Prop({ required: true })
    tubGrinderTotalHoursOfUse: number;

    @Prop({ required: true })
    tubGrinderDairyHoursOfUse: number;

    @Prop({ required: true })
    tubGrinderEquipmentAge: number;

    @Prop({ required: true })
    tubGrinderYearsOfUsefulLife: number;

    // Miscellaneous equipment
    @Prop({ required: true })
    miscellaneousEquipmentInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfMiscellaneousEquipment: number;

    @Prop({ required: true })
    miscellaneousEquipmentTotalHoursOfUse: number;

    @Prop({ required: true })
    miscellaneousEquipmentDairyHoursOfUse: number;

    @Prop({ required: true })
    miscellaneousEquipmentEquipmentAge: number;

    @Prop({ required: true })
    miscellaneousEquipmentYearsOfUsefulLife: number;

    // Other 1
    @Prop({ required: true })
    otherMachineryEquipment1InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfOtherMachineryEquipment1: number;

    @Prop({ required: true })
    otherMachineryEquipment1TotalHoursOfUse: number;

    @Prop({ required: true })
    otherMachineryEquipment1DairyHoursOfUse: number;

    @Prop({ required: true })
    otherMachineryEquipment1EquipmentAge: number;

    @Prop({ required: true })
    otherMachineryEquipment1YearsOfUsefulLife: number;

    // Other 2
    @Prop({ required: true })
    otherMachineryEquipment2InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    numberOfOtherMachineryEquipment2: number;

    @Prop({ required: true })
    otherMachineryEquipment2TotalHoursOfUse: number;

    @Prop({ required: true })
    otherMachineryEquipment2DairyHoursOfUse: number;

    @Prop({ required: true })
    otherMachineryEquipment2EquipmentAge: number;

    @Prop({ required: true })
    otherMachineryEquipment2YearsOfUsefulLife: number;
}

@Schema()
class LandFixedCostsInputs {
    @Prop({ required: true })
    acres: number;

    @Prop({ required: true })
    rentalCost: number;
}

@Schema()
export class FixedCostsInput extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: CattleFixedCostInputs, default: {} })
    cattleFixedCost: CattleFixedCostInputs;

    @Prop({ type: FacilitiesAndBuildingsFixedCostInputs, default: {} })
    facilitiesAndBuildingsFixedCost: FacilitiesAndBuildingsFixedCostInputs;

    @Prop({ type: WasteManagementFixedCostsInputs, default: {} })
    wasteManagementFixedCosts: WasteManagementFixedCostsInputs;

    @Prop({ type: MachineryFixedCostsInputs })
    machineryFixedCosts: MachineryFixedCostsInputs;

    @Prop({ type: DetailedMachineryFixedCostsInputs, default: {} })
    detailedMachineryFixedCosts: DetailedMachineryFixedCostsInputs;

    @Prop({ type: LandFixedCostsInputs, default: {} })
    landFixedCosts: LandFixedCostsInputs;

    @Prop({ default: false })
    isDetailedMachineryCosts: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const FixedCostsInputsSchema = SchemaFactory.createForClass(FixedCostsInput);