import { Module } from "@nestjs/common";
import { weatherController } from "./weather.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Weather, WeatherSchema } from "./schemas/weather.schema";
import { WeatherService } from "./weather.service";

@Module({
    imports:[
        MongooseModule.forFeature([{name: Weather.name, schema: WeatherSchema}])
    ],
    providers:[WeatherService],
    controllers:[weatherController]
})
export class WeatherModule{}