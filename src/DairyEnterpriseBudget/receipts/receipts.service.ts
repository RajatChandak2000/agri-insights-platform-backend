import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ReceiptsInput } from "../schemas/inputs/ReceiptsInput.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ReceiptsOutput } from "../schemas/outputs/ReceiptsOutput.schema";
import { User } from "src/user/schemas/user.schema";
import { ReceiptsInputDto } from "../dto/receipts-input.dto";
import { ProductionDetailsInput } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";

@Injectable()
export class ReceiptsService{
    private readonly logger = new Logger(ReceiptsService.name);

    constructor(
        @InjectModel(ReceiptsInput.name) private receiptsInputModel: Model<ReceiptsInput>,
        @InjectModel(ReceiptsOutput.name) private receiptsOutputModel: Model<ReceiptsOutput>,
        @InjectModel(ProductionDetailsInput.name) private productionDetailsInputModel: Model<ProductionDetailsInput>,
        @InjectModel(ProductionDetailsOutput.name) private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
        @InjectModel(User.name) private userModel: Model<User>
    ){}

    async updateInput(email: string, updateDto: ReceiptsInputDto) {
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
            const updatedDocument = await this.receiptsInputModel.findOneAndUpdate(
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
            
            return await this.calculateReceiptsOutput(userId, updatedDocument);
            
        } catch (error) {
            this.logger.error(`Failed to update user inputs: ${error.message}`);
            throw new Error(`Failed to update user inputs: ${error.message}`);
        }
    }

    async calculateReceiptsOutput(userId: string, updatedDocument: ReceiptsInputDto){
        this.logger.log(`Calculating Receipts output for user: ${userId}`);
        //Get the required documents from ProductionDetails Inputs and Outputs
        const productionDetailsInputs = await this.productionDetailsInputModel.findOne({userId}).exec();
        const productionDetailsOutputs = await this.productionDetailsOutputModel.findOne({userId}).exec();
      
        // Inputs from Receipts
        const milkPrice = updatedDocument.milkPrice;
        const cullCowsPrice = updatedDocument.cullCowsPrice;
        const heifersPrice = updatedDocument.heifersPrice;
        const bullCalvesPrice = updatedDocument.bullCalvesPrice;
        const beefCrossPrice = updatedDocument.beefCrossPrice;
        const otherIncome1 = updatedDocument.otherIncome1;
        const otherIncome2 = updatedDocument.otherIncome2;

        //Temp variables required to calculate operating costs output
        const totalNumberOfCows = productionDetailsInputs.milkProduction.totalNumberOfCows;
        const calvingInterval = productionDetailsInputs.milkProduction.calvingInterval;
        const expectedPercentMaleWithSexedSemen = productionDetailsInputs.heiferProduction.expectedPercentMaleWithSexedSemen;
        const expectedPercentMaleWithConventional = productionDetailsInputs.heiferProduction.expectedPercentMaleWithConventional;
        const beefCrossPercent = productionDetailsInputs.beefCrossDetails.beefCrossPercent;
        const numberOfHeifersRaised = productionDetailsInputs.heiferProduction.numberOfHeifersRaised;
        const expectedAnnualMilkSales = productionDetailsOutputs.expectedAnnualMilkSales;
        const cullingRate = productionDetailsInputs.heiferProduction.cullingRate;
        const cowDeathLossRate = productionDetailsInputs.heiferProduction.cowDeathLossRate;
        const heiferRaisingDeathLossRate = productionDetailsInputs.heiferProduction.heiferRaisingDeathLossRate;
        const bullCalfDeath = productionDetailsInputs.heiferProduction.bullCalfDeath;
        const beefCrossDeathRate = productionDetailsInputs.beefCrossDetails.beefCrossDeathRate;
        const lactations = (totalNumberOfCows*12)/(calvingInterval);
        

        //Some other Variables required to calculate operating costs output
        const heifersProduced = ((2/3)*lactations*(1-(expectedPercentMaleWithSexedSemen/100)))+((1/3)*lactations*(1-(expectedPercentMaleWithConventional/100)));
        const bullCalvesProduced = ((2/3)*lactations*(expectedPercentMaleWithSexedSemen/100))+((1/3)*lactations*(expectedPercentMaleWithConventional/100));
        const beefCrossBullsProduced = (((((1/3)*lactations*(expectedPercentMaleWithConventional/100))))*(beefCrossPercent/100));
        const beefCrossHeifersProduced = (
            (((2/3) * lactations * (1 - (expectedPercentMaleWithSexedSemen / 100))) - numberOfHeifersRaised) +
            ((1/3) * lactations * (1 - (expectedPercentMaleWithConventional / 100)))) * (beefCrossPercent / 100) + 
            ((heifersProduced - numberOfHeifersRaised) * (beefCrossPercent / 100));
        
        // Outputs calculated and rounded to 2 decimal points
        const milkSales = expectedAnnualMilkSales
        const cullCowsSales = (cullingRate/100)*(totalNumberOfCows)*(1-(cowDeathLossRate/100)*(cullCowsPrice));
        const heifersSales = (heifersProduced - numberOfHeifersRaised - beefCrossHeifersProduced)*(1-(heiferRaisingDeathLossRate/100))*heifersPrice;
        const bullCalvesSales = (bullCalvesProduced - beefCrossBullsProduced)*(1 - (bullCalfDeath/100))*bullCalvesPrice;
        const beefCrossSales = (beefCrossBullsProduced*(1 - (beefCrossDeathRate/100)))+(beefCrossHeifersProduced*(1 - (beefCrossDeathRate/100)))*beefCrossPrice;
      
        // Convert to numbers for storage
        const updatedOutputDocument = {
            milkSales: parseFloat(milkSales.toFixed(2)),
            cullCowsSales: parseFloat(cullCowsSales.toFixed(2)),
            heifersSales: parseFloat(heifersSales.toFixed(2)),
            bullCalvesSales: parseFloat(bullCalvesSales.toFixed(2)),
            beefCrossSales: parseFloat(beefCrossSales.toFixed(2)),
            otherIncome1:parseFloat(otherIncome1.toFixed(2)),
            otherIncome2:parseFloat(otherIncome2.toFixed(2))
        };

        console.log("updatedOutputDocument ",updatedOutputDocument);

        try {
          const result = await this.receiptsOutputModel.findOneAndUpdate(
            { userId },
            { $set: updatedOutputDocument },
            { new: true, upsert: true }
          );
      
          this.logger.log(`Successfully calculated and updated receipts output for user: ${userId}`);
          return result;
        } catch (error) {
          this.logger.error(`Failed to calculate receipts output: ${error.message}`);
          throw new Error(`Failed to calculate receipts output: ${error.message}`);
        }
    }

    async getReceiptsOutput(email: string): Promise<ReceiptsOutput|null>{
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        console.log('userId ', userId);

        const outputDocument = await this.receiptsOutputModel.findOne({userId}).exec();
        console.log("outputDocument ",outputDocument);

        if(!outputDocument){
            throw new HttpException('Output record for this user not found', HttpStatus.NOT_FOUND)
        }

        return outputDocument;
    }

    async getReceiptsInput(email:string): Promise<ReceiptsInput | null>{
        //first find the user_id using the email, then find the document using the id
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        console.log('userId ', userId);

        const inputDocument = this.receiptsInputModel.findOne({userId}).exec();

        if(!inputDocument){
            throw new HttpException('Input record for this user not found', HttpStatus.NOT_FOUND)
        }

        return inputDocument;
    }
}