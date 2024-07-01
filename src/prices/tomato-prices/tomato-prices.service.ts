import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TomatoPrice } from "../schemas/tomato-prices.schema";
import { Model } from "mongoose";

@Injectable()
export class TomatoPricesService{
    constructor(
        @InjectModel(TomatoPrice.name) private tomatoPriceModel: Model<TomatoPrice>
    ){}

    async getAllTomatoPrices(): Promise<TomatoPrice[]>{
        return await this.tomatoPriceModel.find({}).exec()
    }
}