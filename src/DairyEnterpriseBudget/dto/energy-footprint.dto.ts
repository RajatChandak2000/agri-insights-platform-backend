import { IsNumber, IsObject } from 'class-validator';

class AnnualEnergyUseInputsDto {
  @IsNumber()
  electric: number;

  @IsNumber()
  diesel: number;

  @IsNumber()
  gasoline?: number;

  @IsNumber()
  propane?: number;

  @IsNumber()
  naturalGas?: number;

  @IsNumber()
  fuelOil?: number;

  @IsNumber()
  biodiesel?: number;
}

class DairyOperationsEnergyUseInputsDto {
    @IsNumber()
    electric: number;
  
    @IsNumber()
    diesel: number;
  
    @IsNumber()
    gasoline?: number;
  
    @IsNumber()
    propane?: number;
  
    @IsNumber()
    naturalGas?: number;
  
    @IsNumber()
    fuelOil?: number;
  
    @IsNumber()
    biodiesel?: number;
}

export class EnergyFootprintInputDto {
  @IsObject()
  annualEnergyUse: AnnualEnergyUseInputsDto;

  @IsObject()
  dairyOperationsEnergyUse: DairyOperationsEnergyUseInputsDto;
}
