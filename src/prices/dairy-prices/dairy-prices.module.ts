import { Module } from '@nestjs/common';
import { DairyPricesService } from './dairy-prices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DairyPrice, DairyPriceSchema } from '../schemas/dairy-prices.schema';
import { DairyPricesController } from './dairy-prices.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DairyPrice.name, schema: DairyPriceSchema },
    ]),
  ],
  providers: [DairyPricesService],
  controllers: [DairyPricesController],
})
export class DairyPricesModule {}
