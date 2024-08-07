import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class MachineryCostsInput extends Document {
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
    skidSteerYearsOfUsefulLife: number;

    @Prop({ required: true })
    hpTractor130MfwDInitialInvestmentPerUnit: number;

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
    foldingSprayer40TotalHoursOfUse: number;

    @Prop({ required: true })
    foldingSprayer40DairyHoursOfUse: number;

    @Prop({ required: true })
    foldingSprayer40EquipmentAge: number;

    @Prop({ required: true })
    foldingSprayer40YearsOfUsefulLife: number;

    @Prop({ required: true })
    fieldCultivatorInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    fieldCultivatorTotalHoursOfUse: number;

    @Prop({ required: true })
    fieldCultivatorDairyHoursOfUse: number;

    @Prop({ required: true })
    fieldCultivatorEquipmentAge: number;

    @Prop({ required: true })
    fieldCultivatorYearsOfUsefulLife: number;

    @Prop({ required: true })
    grainDrill15NoTillInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    grainDrill15NoTillTotalHoursOfUse: number;

    @Prop({ required: true })
    grainDrill15NoTillDairyHoursOfUse: number;

    @Prop({ required: true })
    grainDrill15NoTillEquipmentAge: number;

    @Prop({ required: true })
    grainDrill15NoTillYearsOfUsefulLife: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledTotalHoursOfUse: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledDairyHoursOfUse: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledEquipmentAge: number;

    @Prop({ required: true })
    mowerConditionerSelfPropelledYearsOfUsefulLife: number;

    @Prop({ required: true })
    tedderInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    tedderTotalHoursOfUse: number;

    @Prop({ required: true })
    tedderDairyHoursOfUse: number;

    @Prop({ required: true })
    tedderEquipmentAge: number;

    @Prop({ required: true })
    tedderYearsOfUsefulLife: number;

    @Prop({ required: true })
    powerRakeInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    powerRakeTotalHoursOfUse: number;

    @Prop({ required: true })
    powerRakeDairyHoursOfUse: number;

    @Prop({ required: true })
    powerRakeEquipmentAge: number;

    @Prop({ required: true })
    powerRakeYearsOfUsefulLife: number;

    @Prop({ required: true })
    foldingRotaryMower15InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    foldingRotaryMower15TotalHoursOfUse: number;

    @Prop({ required: true })
    foldingRotaryMower15DairyHoursOfUse: number;

    @Prop({ required: true })
    foldingRotaryMower15EquipmentAge: number;

    @Prop({ required: true })
    foldingRotaryMower15YearsOfUsefulLife: number;

    @Prop({ required: true })
    deepRipperInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    deepRipperTotalHoursOfUse: number;

    @Prop({ required: true })
    deepRipperDairyHoursOfUse: number;

    @Prop({ required: true })
    deepRipperEquipmentAge: number;

    @Prop({ required: true })
    deepRipperYearsOfUsefulLife: number;

    @Prop({ required: true })
    livestockTrailer24InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    livestockTrailer24TotalHoursOfUse: number;

    @Prop({ required: true })
    livestockTrailer24DairyHoursOfUse: number;

    @Prop({ required: true })
    livestockTrailer24EquipmentAge: number;

    @Prop({ required: true })
    livestockTrailer24YearsOfUsefulLife: number;

    @Prop({ required: true })
    roundBalerInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    roundBalerTotalHoursOfUse: number;

    @Prop({ required: true })
    roundBalerDairyHoursOfUse: number;

    @Prop({ required: true })
    roundBalerEquipmentAge: number;

    @Prop({ required: true })
    roundBalerYearsOfUsefulLife: number;

    @Prop({ required: true })
    tubGrinderInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    tubGrinderTotalHoursOfUse: number;

    @Prop({ required: true })
    tubGrinderDairyHoursOfUse: number;

    @Prop({ required: true })
    tubGrinderEquipmentAge: number;

    @Prop({ required: true })
    tubGrinderYearsOfUsefulLife: number;

    @Prop({ required: true })
    miscellaneousEquipmentInitialInvestmentPerUnit: number;

    @Prop({ required: true })
    miscellaneousEquipmentTotalHoursOfUse: number;

    @Prop({ required: true })
    miscellaneousEquipmentDairyHoursOfUse: number;

    @Prop({ required: true })
    miscellaneousEquipmentEquipmentAge: number;

    @Prop({ required: true })
    miscellaneousEquipmentYearsOfUsefulLife: number;

    @Prop({ required: true })
    otherEquipment1InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    otherEquipment1TotalHoursOfUse: number;

    @Prop({ required: true })
    otherEquipment1DairyHoursOfUse: number;

    @Prop({ required: true })
    otherEquipment1EquipmentAge: number;

    @Prop({ required: true })
    otherEquipment1YearsOfUsefulLife: number;

    @Prop({ required: true })
    otherEquipment2InitialInvestmentPerUnit: number;

    @Prop({ required: true })
    otherEquipment2TotalHoursOfUse: number;

    @Prop({ required: true })
    otherEquipment2DairyHoursOfUse: number;

    @Prop({ required: true })
    otherEquipment2EquipmentAge: number;

    @Prop({ required: true })
    otherEquipment2YearsOfUsefulLife: number;

}

export const MachineryCostsInputSchema = SchemaFactory.createForClass(MachineryCostsInput);
