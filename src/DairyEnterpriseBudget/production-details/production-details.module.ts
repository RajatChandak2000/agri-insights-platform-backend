import { Module } from '@nestjs/common';
import { ProductionDetailsService } from './production-details.service';
import { ProductionDetailsController } from './production-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductionDetailsInput,
  ProductionDetailsInputsSchema,
} from '../schemas/inputs/ProductionDetailsInput.schema';
import {
  ProductionDetailsOutput,
  ProductionDetailsOutputSchema,
} from '../schemas/outputs/ProductionDetailsOutput.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  providers: [ProductionDetailsService],
  controllers: [ProductionDetailsController],
  exports: [ProductionDetailsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductionDetailsInput.name,
        schema: ProductionDetailsInputsSchema,
      },
      {
        name: ProductionDetailsOutput.name,
        schema: ProductionDetailsOutputSchema,
      },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class ProductionDetailsModule {}
