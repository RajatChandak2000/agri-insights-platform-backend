import { IsNumber, IsString, IsDate, IsOptional, IsMongoId } from 'class-validator';

export class ManureManagementInputDto {
  @IsNumber()
  percentLactatingManureRecoverable: number;
  
  @IsNumber()
  percentDryManureRecoverable: number;

  @IsNumber()
  percentBredManureRecoverable: number;

  @IsNumber()
  percentYoungManureRecoverable: number;

  @IsString()
  manureManagementSystem1: string;

  @IsNumber()
  percentOfManureMMS1: number;

  @IsString()
  manureManagementSystem2: string;

  @IsNumber()
  percentOfManureMMS2: number;

  @IsString()
  manureManagementSystem3: string;

  @IsNumber()
  percentOfManureMMS3: number;

  @IsString()
  manureManagementSystem4: string;

  @IsNumber()
  percentOfManureMMS4: number;
}
