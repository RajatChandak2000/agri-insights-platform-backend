import { IsNumber, IsOptional } from 'class-validator';

export class GHGInputDto {
  @IsNumber()
  fatPercentage?: number;

  @IsNumber()
  proteinPercentage?: number;

  @IsNumber()
  @IsOptional()
  averageUSTruckingEmissions: number;
}
