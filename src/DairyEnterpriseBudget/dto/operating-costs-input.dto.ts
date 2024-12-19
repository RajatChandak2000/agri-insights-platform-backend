import { IsBoolean, IsNumber } from 'class-validator';

export class OperatingCostsInputDto {
  @IsNumber()
  haulingFees?: number;

  @IsNumber()
  organizationalFees?: number;

  @IsNumber()
  dhiaFees?: number;

  @IsNumber()
  vetExpenses?: number;

  @IsNumber()
  insurance?: number;

  @IsNumber()
  utilities?: number;

  @IsNumber()
  inseminationSexedFees?: number;

  @IsNumber()
  inseminationConventionalFees?: number;

  @IsNumber()
  inseminationConventionalBeefFees?: number;

  @IsNumber()
  wasteManagement?: number;

  @IsNumber()
  bedding?: number;

  @IsNumber()
  raisedForageCost?: number;

  @IsNumber()
  purchasedFeedCost?: number;

  @IsNumber()
  additionalManagementCostsPercentage?: number;

  @IsNumber()
  estimatedLabourCost?: number;

  @IsBoolean()
  useDetailedLaborCost?: boolean;
}
