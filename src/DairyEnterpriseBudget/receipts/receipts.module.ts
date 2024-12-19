import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import {
  ReceiptsInput,
  ReceiptsInputSchema,
} from '../schemas/inputs/ReceiptsInput.schema';
import {
  ReceiptsOutput,
  ReceiptsOutputSchema,
} from '../schemas/outputs/ReceiptsOutput.schema';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import {
  ProductionDetailsInput,
  ProductionDetailsInputsSchema,
} from '../schemas/inputs/ProductionDetailsInput.schema';
import {
  ProductionDetailsOutput,
  ProductionDetailsOutputSchema,
} from '../schemas/outputs/ProductionDetailsOutput.schema';
import { ProductionDetailsModule } from '../production-details/production-details.module';
@Module({
  providers: [ReceiptsService],
  exports: [ReceiptsService],
  controllers: [ReceiptsController],
  imports: [
    ProductionDetailsModule,
    MongooseModule.forFeature([
      { name: ReceiptsInput.name, schema: ReceiptsInputSchema },
      { name: ReceiptsOutput.name, schema: ReceiptsOutputSchema },
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
export class ReceiptsModule {}
