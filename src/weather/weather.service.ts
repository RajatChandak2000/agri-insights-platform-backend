import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather } from './schemas/weather.schema';
import { Model } from 'mongoose';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<Weather>,
  ) {}

  async getAllWeatherData(): Promise<Weather[]> {
    return await this.weatherModel.find({});
  }
}
