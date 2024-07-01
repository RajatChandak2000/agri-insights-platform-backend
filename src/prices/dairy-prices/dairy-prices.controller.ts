import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { DairyPricesService } from './dairy-prices.service';
import { DairyPrice } from '../schemas/dairy-prices.schema';

@Controller('dairyPrices')
export class DairyPricesController {
    constructor(private dairyPricesService: DairyPricesService){}

    @Get('allPrices')
    async getAllDairyPrices():Promise<DairyPrice[]>{
        const dairyPrices = await this.dairyPricesService.getAllDairyPrices()
        console.log("dairyPrices ", dairyPrices);
        return dairyPrices
    }

    @Get('year/:reportYear')
    async getDairyPricesByYear(@Param('reportYear') reportYear: number): Promise<DairyPrice[]>{
        const dairyPrices = await this.dairyPricesService.getDairyPricesByYear(reportYear)
        if (dairyPrices.length === 0) {
            throw new NotFoundException(`No dairy prices found for year ${reportYear}`);
        }
        console.log(`Dairy Prices for year ${reportYear}: `, dairyPrices);
        return dairyPrices;
    }
}
