import { IsNotEmpty, IsNumber } from 'class-validator';

export class LabourCostInputDto {
  @IsNotEmpty()
  @IsNumber()
  numberOfOwners: number;

  @IsNotEmpty()
  @IsNumber()
  ownerSalary: number;

  @IsNotEmpty()
  @IsNumber()
  ownerBenefits: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfManagers: number;

  @IsNotEmpty()
  @IsNumber()
  managerSalary: number;

  @IsNotEmpty()
  @IsNumber()
  managerBenefits: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfHerdHealthEmployees: number;

  @IsNotEmpty()
  @IsNumber()
  herdHealthEmployeeTime: number;

  @IsNotEmpty()
  @IsNumber()
  herdHealthEmployeeWage: number;

  @IsNotEmpty()
  @IsNumber()
  herdHealthEmployeeBenefits: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfFeederEmployees: number;

  @IsNotEmpty()
  @IsNumber()
  feederEmployeeTime: number;

  @IsNotEmpty()
  @IsNumber()
  feederEmployeeWage: number;

  @IsNotEmpty()
  @IsNumber()
  feederEmployeeBenefits: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfCropEmployees: number;

  @IsNotEmpty()
  @IsNumber()
  cropEmployeeTime: number;

  @IsNotEmpty()
  @IsNumber()
  cropEmployeeWage: number;

  @IsNotEmpty()
  @IsNumber()
  cropEmployeeBenefits: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfMilkerEmployees: number;

  @IsNotEmpty()
  @IsNumber()
  milkerEmployeeTime: number;

  @IsNotEmpty()
  @IsNumber()
  milkerEmployeeWage: number;

  @IsNotEmpty()
  @IsNumber()
  milkerEmployeeBenefits: number;

  @IsNotEmpty()
  @IsNumber()
  replacementEmployees: number;

  @IsNotEmpty()
  @IsNumber()
  replacementEmployeeTime: number;

  @IsNotEmpty()
  @IsNumber()
  replacementEmployeeWage: number;

  @IsNotEmpty()
  @IsNumber()
  replacementEmployeeBenefits: number;

  @IsNotEmpty()
  @IsNumber()
  facilitiesEmployees: number;

  @IsNotEmpty()
  @IsNumber()
  facilitiesEmployeeTime: number;

  @IsNotEmpty()
  @IsNumber()
  facilitiesEmployeeWage: number;

  @IsNotEmpty()
  @IsNumber()
  facilitiesEmployeeBenefits: number;

  @IsNotEmpty()
  @IsNumber()
  otherEmployees: number;

  @IsNotEmpty()
  @IsNumber()
  otherEmployeeTime: number;

  @IsNotEmpty()
  @IsNumber()
  otherEmployeeWage: number;

  @IsNotEmpty()
  @IsNumber()
  otherEmployeeBenefits: number;
}
