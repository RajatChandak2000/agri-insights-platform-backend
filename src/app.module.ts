import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DairyPricesModule } from './prices/dairy-prices/dairy-prices.module';
import { TomatoPricesModule } from './prices/tomato-prices/tomato-prices.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [AuthModule,
    DairyPricesModule,
    UserModule, TomatoPricesModule, WeatherModule,
    ConfigModule.forRoot({isGlobal: true}), 
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is available
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URL'), // Get the DB URL from ConfigService
      }),
    }),
  ],
})
export class AppModule {}
