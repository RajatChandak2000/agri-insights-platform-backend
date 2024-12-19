import { Controller, Get } from '@nestjs/common';
import { TomatoPricesService } from './tomato-prices.service';
import { TomatoPrice } from '../schemas/tomato-prices.schema';

@Controller('tomatoPrices')
export class TomatoPricesController {
  constructor(private tomatoPricesService: TomatoPricesService) {}

  @Get('allPrices')
  async getAllTomatoPrices(): Promise<TomatoPrice[]> {
    const tomatoPrices = await this.tomatoPricesService.getAllTomatoPrices();
    console.log('tomatoPrices ', tomatoPrices);
    return tomatoPrices;
  }
}
