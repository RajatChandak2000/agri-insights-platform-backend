import { IsNumber } from "class-validator";

export class ReceiptsInputDto{
    @IsNumber()
    cullCowsPrice?: number;

    @IsNumber()
    heifersPrice?: number;

    @IsNumber()
    bullCalvesPrice?: number;

    @IsNumber()
    beefCrossPrice?: number;

    @IsNumber()
    otherIncome1?: number;

    @IsNumber()
    otherIncome2?: number;
}