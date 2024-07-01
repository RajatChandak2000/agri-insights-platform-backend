import { Injectable } from '@nestjs/common';
import { DairyPrice } from '../schemas/dairy-prices.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DairyPricesService {
    constructor(
        @InjectModel(DairyPrice.name) private dairyPriceModel: Model<DairyPrice>, 
    ){}

    async getAllDairyPrices(): Promise<DairyPrice[]>{
        return await this.dairyPriceModel.find({}).exec()
    }

    async getDairyPricesByYear(reportYear: number): Promise<DairyPrice[]>{
        return await this.dairyPriceModel.find({report_year: reportYear}).exec()
    }
}
