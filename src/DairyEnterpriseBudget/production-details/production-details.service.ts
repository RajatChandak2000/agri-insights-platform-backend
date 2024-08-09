import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductionDetailsInputsSchema, ProductionDetailsInput } from "../schemas/inputs/ProductionDetailsInput.schema";
import { Model } from "mongoose";
import { ProductionDetailsInputDto } from "../dto";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { User } from "src/user/schemas/user.schema";

@Injectable()
export class ProductionDetailsService {
    private readonly logger = new Logger(ProductionDetailsService.name);

    constructor(
        @InjectModel(ProductionDetailsInput.name) private productionDetailsInputModel: Model<ProductionDetailsInput>,
        @InjectModel(ProductionDetailsOutput.name) private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async updateInput(email: string, updateDto: ProductionDetailsInputDto) {
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        this.logger.log(`Updating inputs for user: ${userId}`);
        const updateData: any = {};

        // Handling Milk Production Inputs
        if (updateDto.milkProduction) {
            for (const [key, value] of Object.entries(updateDto.milkProduction)) {
                if (value !== undefined) {
                    updateData[`milkProduction.${key}`] = value;
                }
            }
            this.logger.log(`Milk Production Data: ${JSON.stringify(updateDto.milkProduction)}`);
        }

        // Handling Heifer Production Inputs
        if (updateDto.heiferProduction) {
            for (const [key, value] of Object.entries(updateDto.heiferProduction)) {
                if (value !== undefined) {
                    updateData[`heiferProduction.${key}`] = value;
                }
            }
            this.logger.log(`Heifer Production Data: ${JSON.stringify(updateDto.heiferProduction)}`);
        }

        // Handling Beef Cross Production Details
        if (updateDto.beefCrossDetails) {
            for (const [key, value] of Object.entries(updateDto.beefCrossDetails)) {
                if (value !== undefined) {
                    updateData[`beefCrossDetails.${key}`] = value;
                }
            }
            this.logger.log(`Beef Cross Details Data: ${JSON.stringify(updateDto.beefCrossDetails)}`);
        }

        try {
            const updatedDocument = await this.productionDetailsInputModel.findOneAndUpdate(
                { userId },
                { $set: updateData },
                { new: true, upsert: true }
            );

            if (!updatedDocument) {
                this.logger.warn(`User not found: ${userId}`);
                throw new Error('User not found');
            }

            this.logger.log(`Successfully updated inputs for user: ${userId}`);

            //If successful, we need to call another service that calculates the output
            //and updates the output schema accordingly
            
            return await this.calculateProductionDetailsOutput(updatedDocument);
            
        } catch (error) {
            this.logger.error(`Failed to update user inputs: ${error.message}`);
            throw new Error(`Failed to update user inputs: ${error.message}`);
        }
    }

    async calculateProductionDetailsOutput(updatedDocument: ProductionDetailsInput | ProductionDetailsInputDto) {

        
        if ('userId' in updatedDocument){
            this.logger.log(`Calculating production details output for user: ${updatedDocument.userId}`);
            
        }
        
        // Inputs and temp variables required to calculate the outputs
        const expectedMilkProduction = updatedDocument.milkProduction.expectedMilkProduction;
        const calvingInterval = updatedDocument.milkProduction.calvingInterval;
        const cullingRate = updatedDocument.heiferProduction.cullingRate;
        const totalNumberOfCows = updatedDocument.milkProduction.totalNumberOfCows;
        const cowDeathLossRate = updatedDocument.heiferProduction.cowDeathLossRate;
        const heiferRaisingDeathLossRate = updatedDocument.heiferProduction.heiferRaisingDeathLossRate;
        const numberOfLactationsPerYear = (totalNumberOfCows * 12) / calvingInterval; //Stored in database in output for a particular user if logged  in.
        const expectedMilkPrice = 100; // default, will change later, need to automate with data collected
      
        // Outputs calculated and rounded to 2 decimal points
        const rollingHerdAverage = ((expectedMilkProduction) / (calvingInterval / 12)).toFixed(2);
        const totalAnnualMilkProduction = ((numberOfLactationsPerYear * expectedMilkProduction) / 100).toFixed(2);
        const expectedAnnualMilkSales = ((parseFloat(rollingHerdAverage) / (100 * expectedMilkPrice)) * totalNumberOfCows).toFixed(2);
        const numberOfReplacementHeifersNeeded = (totalNumberOfCows * (cullingRate/100 + cowDeathLossRate/100 + heiferRaisingDeathLossRate/100)).toFixed(2);
      
        // Convert to numbers for storage
        const updatedOutputDocument = {
          numberOfLactationsPerYear : numberOfLactationsPerYear,
          rollingHerdAverage: parseFloat(rollingHerdAverage),
          totalAnnualMilkProduction: parseFloat(totalAnnualMilkProduction),
          expectedAnnualMilkSales: parseFloat(expectedAnnualMilkSales),
          numberOfReplacementHeifersNeeded: parseFloat(numberOfReplacementHeifersNeeded),
        };
      
        if ('userId' in updatedDocument){
            try {
            const result = await this.productionDetailsOutputModel.findOneAndUpdate(
                { 'userId': updatedDocument.userId },
                { $set: updatedOutputDocument },
                { new: true, upsert: true }
            );
        
            this.logger.log(`Successfully calculated and updated production details output for user: ${updatedDocument.userId}`);
            return result;
            } catch (error) {
            this.logger.error(`Failed to calculate production details output: ${error.message}`);
            throw new Error(`Failed to calculate production details output: ${error.message}`);
            }
        }

        return updatedOutputDocument;
    }      

    async getProductionDetailsOutput(email: string): Promise<ProductionDetailsOutput|null>{
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        console.log('userId ', userId);

        const outputDocument = await this.productionDetailsOutputModel.findOne({userId}).exec();
        console.log("outputDocument ",outputDocument);
        

        if(!outputDocument){
            throw new HttpException('Output record for this user not found', HttpStatus.NOT_FOUND)
        }

        return outputDocument;
    }

    async getProductionDetailsInput(email:string): Promise<ProductionDetailsInput | null>{
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        console.log('userId ', userId);

        const inputDocument = this.productionDetailsInputModel.findOne({userId}).exec();

        if(!inputDocument){
            throw new HttpException('Input record for this user not found', HttpStatus.NOT_FOUND)
        }

        return inputDocument;
    }
}
