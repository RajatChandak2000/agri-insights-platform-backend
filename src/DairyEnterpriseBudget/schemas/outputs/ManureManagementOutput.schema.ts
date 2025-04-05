import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class MethaneEmissions {
  @Prop({ required: true })
  ch4EmissionsMMS1: number;

  @Prop({ required: true })
  ch4EmissionsMMS2: number;

  @Prop({ required: true })
  ch4EmissionsMMS3: number;

  @Prop({ required: true })
  ch4EmissionsMMS4: number;

  @Prop({ required: true })
  ch4EmissionsPastureNonrecoverable: number;

  @Prop({ required: true })
  ch4TotalEmissions: number;
}

@Schema()
class NitrousOxideEmissions {
  @Prop({ required: true })
  n2oDirectEmissionsMMS1: number;

  @Prop({ required: true })
  n2oDirectEmissionsMMS2: number;

  @Prop({ required: true })
  n2oDirectEmissionsMMS3: number;

  @Prop({ required: true })
  n2oDirectEmissionsMMS4: number;

  @Prop({ required: true })
  n2oDirectEmissionsPastureNonrecoverable: number;

  @Prop({ required: true })
  n2oIndirectVolatileEmissionsMMS1: number;

  @Prop({ required: true })
  n2oIndirectVolatileEmissionsMMS2: number;

  @Prop({ required: true })
  n2oIndirectVolatileEmissionsMMS3: number;

  @Prop({ required: true })
  n2oIndirectVolatileEmissionsMMS4: number;

  @Prop({ required: true })
  n2oIndirectVolatileEmissionsPastureNonrecoverable: number;

  @Prop({ required: true })
  n2oIndirectLeachEmissionsMMS1: number;

  @Prop({ required: true })
  n2oIndirectLeachEmissionsMMS2: number;

  @Prop({ required: true })
  n2oIndirectLeachEmissionsMMS3: number;

  @Prop({ required: true })
  n2oIndirectLeachEmissionsMMS4: number;

  @Prop({ required: true })
  n2oIndirectLeachEmissionsPastureNonrecoverable: number;

  @Prop({ required: true })
  n2oTotalEmissions: number;
}

@Schema()
class ManureManagementFootprint {
  @Prop({ required: true })
  totalCO2eFromCH4: number;

  @Prop({ required: true })
  totalCO2eFromN2O: number;

  @Prop({ required: true })
  totalCO2eFromManureManagement: number;

  @Prop({ required: true })
  footprintFromCH4: number;

  @Prop({ required: true })
  footprintFromN2O: number;

  @Prop({ required: true })
  footprintFromMMS: number;
}

@Schema()
export class ManureManagementOutput extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: MethaneEmissions, default: {} })
  methaneEmissions: MethaneEmissions;

  @Prop({ type: NitrousOxideEmissions, default: {} })
  nitrousOxideEmissions: NitrousOxideEmissions;

  @Prop({ type: ManureManagementFootprint, default: {} })
  manureManagementFootprint: ManureManagementFootprint;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ManureManagementOutputSchema = SchemaFactory.createForClass(ManureManagementOutput);
