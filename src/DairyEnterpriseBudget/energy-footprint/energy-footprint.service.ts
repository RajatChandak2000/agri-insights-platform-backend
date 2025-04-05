import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EnergyFootprintInput } from "../schemas/inputs/EnergyFootprintInput.schema";
import { User } from "src/user/schemas/user.schema";
import { EnergyFootprintInputDto } from "../dto/energy-footprint.dto";
import { EnergyFootprintOutput } from "../schemas/outputs/EnergyFootprintOutput.schema";
import { GHGOutput } from "../schemas/outputs/ghg-output.schema";

@Injectable()
export class EnergyFootprintService{
    private readonly logger = new Logger(EnergyFootprintService.name);

    constructor(
        @InjectModel(EnergyFootprintInput.name)
        private energyFootprintInputModel: Model<EnergyFootprintInput>,
        @InjectModel(EnergyFootprintOutput.name)
        private energyFootprintOutputModel: Model<EnergyFootprintOutput>,
        @InjectModel(GHGOutput.name)
        private ghgOutputModel: Model<GHGOutput>,
        @InjectModel(User.name)
        private userModel: Model<User>,
    ) {}

    async updateInput(email: string, updateDto: EnergyFootprintInputDto) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
          throw new HttpException(
            'User with this email does not exist',
            HttpStatus.NOT_FOUND,
          );
        }
    
        const userId = user._id.toString();
        this.logger.log(`Updating inputs for user: ${userId}`);
        const updateData: any = {};
    
        // Handling Annual Energy Use Inputs
        if (updateDto.annualEnergyUse) {
          for (const [key, value] of Object.entries(updateDto.annualEnergyUse)) {
            if (value !== undefined) {
              updateData[`annualEnergyUse.${key}`] = value;
            }
          }
          this.logger.log(
            `Annual Energy Data: ${JSON.stringify(updateDto.annualEnergyUse)}`,
          );
        }
    
        // Handling Heifer Production Inputs
        if (updateDto.dairyOperationsEnergyUse) {
          for (const [key, value] of Object.entries(updateDto.dairyOperationsEnergyUse)) {
            if (value !== undefined) {
              updateData[`dairyOperationsEnergyUse.${key}`] = value;
            }
          }
          this.logger.log(
            `Dairy Operations Energy Use Data: ${JSON.stringify(updateDto.dairyOperationsEnergyUse)}`,
          );
        }
    
        try {
          const updatedDocument =
            await this.energyFootprintInputModel.findOneAndUpdate(
              { userId },
              { $set: updateData },
              { new: true, upsert: true },
            );
    
          if (!updatedDocument) {
            this.logger.warn(`User not found: ${userId}`);
            throw new Error('User not found');
          }
    
          this.logger.log(`Successfully updated inputs for user: ${userId}`);
    
          //If successful, we need to call another service that calculates the output
          //and updates the output schema accordingly
    
          return await this.calculateEnergyFootprintOutput(userId, updatedDocument);
        } catch (error) {
          this.logger.error(`Failed to update user inputs: ${error.message}`);
          throw new Error(`Failed to update user inputs: ${error.message}`);
        }
    }

    async calculateEnergyFootprintOutput(
        userId: string,
        updatedDocument: EnergyFootprintInput
    ){
        if ('userId' in updatedDocument) {
            this.logger.log(
              `Calculating energy footprint output for user: ${updatedDocument.userId}`,
            );
        }

        const ghgModelOutputs = await this.ghgOutputModel.findOne({ userId }).exec();

        // Some const values required
        const electricEmissionFactor = 1.86;           // lbsCO2e per kWh
        const dieselEmissionFactor = 26.21;            // lbsCO2e per gallon
        const gasolineEmissionFactor = 22.51;          // lbsCO2e per gallon
        const propaneEmissionFactor = 16.89;           // lbsCO2e per gallon
        const naturalGasEmissionFactor = 16.62;        // lbsCO2e per therm
        const fuelOilEmissionFactor = 27.27;           // lbsCO2e per gallon
        const biodieselEmissionFactor = 17.55;         // lbsCO2e per gallon

        // Value required from other models
        const annualFPCM = ghgModelOutputs.annualFPCM;
      
        // Inputs and temp variables required to calculate the outputs
        const electricAnnualUse = updatedDocument.annualEnergyUse.electric;
        const dieselAnnualUse = updatedDocument.annualEnergyUse.diesel;
        const gasolineAnnualUse = updatedDocument.annualEnergyUse.gasoline;
        const propaneAnnualUse = updatedDocument.annualEnergyUse.propane;
        const naturalGasAnnualUse = updatedDocument.annualEnergyUse.naturalGas;
        const fuelOilAnnualUse = updatedDocument.annualEnergyUse.fuelOil;
        const biodieselAnnualUse = updatedDocument.annualEnergyUse.biodiesel;

        const percentElectricDairy = updatedDocument.dairyOperationsEnergyUse.electric;
        const percentDieselDairy = updatedDocument.dairyOperationsEnergyUse.diesel;
        const percentGasolineDairy = updatedDocument.dairyOperationsEnergyUse.gasoline;
        const percentPropaneDairy = updatedDocument.dairyOperationsEnergyUse.propane;
        const percentNaturalGasDairy = updatedDocument.dairyOperationsEnergyUse.naturalGas;
        const percentFuelOilDairy = updatedDocument.dairyOperationsEnergyUse.fuelOil;
        const percentBiodieselDairy = updatedDocument.dairyOperationsEnergyUse.biodiesel;
    
        // Outputs calculated
        const electricGHG = (electricAnnualUse * electricEmissionFactor * percentElectricDairy) / annualFPCM;
        const dieselGHG = (dieselAnnualUse * dieselEmissionFactor * percentDieselDairy) / annualFPCM;
        const gasolineGHG = (gasolineAnnualUse * gasolineEmissionFactor * percentGasolineDairy) / annualFPCM;
        const propaneGHG = (propaneAnnualUse * propaneEmissionFactor * percentPropaneDairy) / annualFPCM;
        const naturalGasGHG = (naturalGasAnnualUse * naturalGasEmissionFactor * percentNaturalGasDairy) / annualFPCM;
        const fuelOilGHG = (fuelOilAnnualUse * fuelOilEmissionFactor * percentFuelOilDairy) / annualFPCM;
        const biodieselGHG = (biodieselAnnualUse * biodieselEmissionFactor * percentBiodieselDairy) / annualFPCM;
    
        // Rounded to 2 decimal points
        const updatedOutputDocument = {
            electric: parseFloat(electricGHG.toFixed(2)),
            diesel: parseFloat(dieselGHG.toFixed(2)),
            gasoline: parseFloat(gasolineGHG.toFixed(2)),
            propane: parseFloat(propaneGHG.toFixed(2)),
            naturalGas: parseFloat(naturalGasGHG.toFixed(2)),
            fuelOil: parseFloat(fuelOilGHG.toFixed(2)),
            biodiesel: parseFloat(biodieselGHG.toFixed(2))
        };

        console.log("updatedOutputDocument ", updatedOutputDocument);
      
        if ('userId' in updatedDocument) {
            try {
            const result = await this.energyFootprintOutputModel.findOneAndUpdate(
                { userId: updatedDocument.userId },
                { $set: updatedOutputDocument },
                { new: true, upsert: true },
            );
      
            this.logger.log(
            `Successfully calculated and updated energy footprint output for user: ${updatedDocument.userId}`,
            );
              return result;
            } catch (error) {
              this.logger.error(
                `Failed to calculate energy footprint output: ${error.message}`,
              );
              throw new Error(
                `Failed to calculate energy footprint output: ${error.message}`,
              );
            }
        }
        
        console.log("updatedOutputDocument ", updatedOutputDocument);
        
        return updatedOutputDocument;
    }

    async getEnergyFootprintOutput(
        email: string,
      ): Promise<EnergyFootprintOutput | null> {
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
          throw new HttpException(
            'User with this email does not exist',
            HttpStatus.NOT_FOUND,
          );
        }
    
        const userId = user._id.toString();
        console.log('userId ', userId);
    
        const outputDocument = await this.energyFootprintOutputModel
          .findOne({ userId })
          .exec();
        console.log('outputDocument ', outputDocument);
    
        if (!outputDocument) {
          throw new HttpException(
            'Output record for this user not found',
            HttpStatus.NOT_FOUND,
          );
        }
    
        return outputDocument;
    }
    
    async getEnergyFootprintInput(
    email: string,
    ): Promise<EnergyFootprintInput | null> {
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
          throw new HttpException(
            'User with this email does not exist',
            HttpStatus.NOT_FOUND,
          );
        }
    
        const userId = user._id.toString();
        console.log('userId ', userId);
    
        const inputDocument = this.energyFootprintInputModel
          .findOne({ userId })
          .exec();
    
        if (!inputDocument) {
          throw new HttpException(
            'Input record for this user not found',
            HttpStatus.NOT_FOUND,
          );
        }
    
        return inputDocument;
    }

}

