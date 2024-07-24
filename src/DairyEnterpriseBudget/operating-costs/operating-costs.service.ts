import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OperatingCostsInput } from "../schemas/inputs/OperatingCostsInput.schema";
import { Model } from "mongoose";
import { OperatingCostsOutput } from "../schemas/outputs/OperatingCostsOutput.schema";
import { User } from "src/user/schemas/user.schema";
import { OperatingCostsInputDto } from "../dto/operating-costs-input.dto";
import { ProductionDetailsInput } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";

@Injectable()
export class OperatingCostsService{
    private readonly logger = new Logger(OperatingCostsService.name);
    
    constructor(
        @InjectModel(OperatingCostsInput.name) private operatingCostsInputModel : Model<OperatingCostsInput>,
        @InjectModel(OperatingCostsOutput.name) private operatingCostsOutputModel : Model<OperatingCostsOutput>,
        @InjectModel(ProductionDetailsInput.name) private productionDetailsInputModel: Model<ProductionDetailsInput>,
        @InjectModel(ProductionDetailsOutput.name) private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
        @InjectModel(User.name) private userModel : Model<User>
    ){}

    async updateInput(email: string, updateDto: OperatingCostsInputDto) {
        
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        this.logger.log(`Updating inputs for user: ${userId}`);
        const updateData: any = {};

        for (const [key, value] of Object.entries(updateDto)) {
            if (value !== undefined) {
                updateData[key] = value;
            }
        }

        try {
            const updatedDocument = await this.operatingCostsInputModel.findOneAndUpdate(
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
            
            return await this.calculateOperatingCostsOutput(userId, updatedDocument);
            
        } catch (error) {
            this.logger.error(`Failed to update user inputs: ${error.message}`);
            throw new Error(`Failed to update user inputs: ${error.message}`);
        }
    }

    async calculateOperatingCostsOutput(userId: string, updatedDocument: OperatingCostsInput) {
        this.logger.log(`Calculating production details output for user: ${userId}`);
        //Get the required documents from ProductionDetails Inputs and Outputs
        const productionDetailsInputs = await this.productionDetailsInputModel.findOne({userId}).exec();
        const productionDetailsOutputs = await this.productionDetailsOutputModel.findOne({userId}).exec();
      
        // Inputs from operating costs
        const haulingFees = updatedDocument.haulingFees;
        const organizationalFees = updatedDocument.organizationalFees;
        const dhiaFees = updatedDocument.dhiaFees;
        const vetExpenses = updatedDocument.vetExpenses;
        const utilities = updatedDocument.utilities;
        const inseminationSexedFees = updatedDocument.inseminationSexedFees;
        const inseminationConventionalFees = updatedDocument.inseminationConventionalFees;
        const inseminationConventionalBeefFees = updatedDocument.inseminationConventionalBeefFees;
        const wasteManagement = updatedDocument.wasteManagement;
        const bedding = updatedDocument.bedding;

        //Temp variables required to calculate operating costs output
        const totalAnnualMilkProduction = productionDetailsOutputs.totalAnnualMilkProduction;
        const totalNumberOfCows = productionDetailsInputs.milkProduction.totalNumberOfCows;

        //Some other Variables required to calculate operating costs output
        const haulingCosts = (haulingFees)*(productionDetailsOutputs.totalAnnualMilkProduction);
        const organizationalCosts = (organizationalFees)*(totalAnnualMilkProduction);
        const dhiaCosts = (dhiaFees)*(totalNumberOfCows);
        const vetCosts = (vetExpenses)*(totalNumberOfCows);
        const utilityCosts = (utilities)*(totalNumberOfCows);
        // const inseminationSexedCosts = 
        // const inseminationConventionalFees = 
        // const inseminationConventionalBeefFees = 
        const wasteManagementCosts = (wasteManagement)*(totalNumberOfCows);
        const beddingCosts = (bedding)*(totalNumberOfCows)

        
        // Outputs calculated and rounded to 2 decimal points
        
      
        // Convert to numbers for storage
      
        // try {
        //   const result = await this.productionDetailsOutputModel.findOneAndUpdate(
        //     { userId },
        //     { $set: updatedOutputDocument },
        //     { new: true, upsert: true }
        //   );
      
        //   this.logger.log(`Successfully calculated and updated production details output for user: ${userId}`);
        //   return result;
        // } catch (error) {
        //   this.logger.error(`Failed to calculate production details output: ${error.message}`);
        //   throw new Error(`Failed to calculate production details output: ${error.message}`);
        // }
      }

}