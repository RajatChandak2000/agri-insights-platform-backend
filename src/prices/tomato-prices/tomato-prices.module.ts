import { Module } from "@nestjs/common";
import { TomatoPricesService } from "./tomato-prices.service";
import { TomatoPricesController } from "./tomato-prices.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { TomatoPrice, TomatoPriceSchema } from "../schemas/tomato-prices.schema";

@Module({
    imports:[
        MongooseModule.forFeature([{name: TomatoPrice.name, schema: TomatoPriceSchema}])
    ],
    providers:[TomatoPricesService],
    controllers:[TomatoPricesController]
})
export class TomatoPricesModule{}