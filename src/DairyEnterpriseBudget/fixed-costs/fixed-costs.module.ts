import { Module } from '@nestjs/common';
import { FixedCostsService } from './fixed-costs.service';
import { FixedCostsController } from './fixed-costs.controller';
import {
  ProductionDetailsInput,
  ProductionDetailsInputsSchema,
} from '../schemas/inputs/ProductionDetailsInput.schema';
import {
  ProductionDetailsOutput,
  ProductionDetailsOutputSchema,
} from '../schemas/outputs/ProductionDetailsOutput.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FixedCostsInput,
  FixedCostsInputsSchema,
} from '../schemas/inputs/FixedCostsInput.schema';
import {
  FixedCostsOutput,
  FixedCostsOutputSchema,
} from '../schemas/outputs/FixedCostsOutput.schema';
import {
  ReceiptsInput,
  ReceiptsInputSchema,
} from '../schemas/inputs/ReceiptsInput.schema';

@Module({
  providers: [FixedCostsService],
  controllers: [FixedCostsController],
  imports: [
    MongooseModule.forFeature([
      { name: FixedCostsInput.name, schema: FixedCostsInputsSchema },
      { name: FixedCostsOutput.name, schema: FixedCostsOutputSchema },
      {
        name: ProductionDetailsInput.name,
        schema: ProductionDetailsInputsSchema,
      },
      {
        name: ProductionDetailsOutput.name,
        schema: ProductionDetailsOutputSchema,
      },
      { name: ReceiptsInput.name, schema: ReceiptsInputSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class FixedCostsModule {}
