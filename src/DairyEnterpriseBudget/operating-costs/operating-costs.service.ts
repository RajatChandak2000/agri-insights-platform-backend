import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OperatingCostsInput } from "../schemas/inputs/OperatingCostsInput.schema";
import { Model } from "mongoose";
import { OperatingCostsOutput } from "../schemas/outputs/OperatingCostsOutput.schema";
import { User } from "src/user/schemas/user.schema";
import { OperatingCostsInputDto } from "../dto/operating-costs-input.dto";
import { ProductionDetailsInput } from "../schemas/inputs/ProductionDetailsInput.schema";
import { ProductionDetailsOutput } from "../schemas/outputs/ProductionDetailsOutput.schema";
import { ProductionDetailsService } from "../production-details/production-details.service";
import { ReceiptsService } from "../receipts/receipts.service";
import { ReceiptsInput } from "../schemas/inputs/ReceiptsInput.schema";
import { ProductionDetailsInputDto } from "../dto/production-details-input.dto";
import { ReceiptsInputDto } from "../dto/receipts-input.dto";
import { ReceiptsOutput } from "../schemas/outputs/ReceiptsOutput.schema";
import { LabourCostInput } from "../schemas/inputs/LabourInput.schema";
import { LabourCostInputDto } from "../dto/labour-cost-input.dto";
import { LabourCostOutput } from "../schemas/outputs/LabourOutput.schema";
import { LabourCostService } from "../labour-cost/labour-cost.service";
@Injectable()
export class OperatingCostsService{
    private readonly logger = new Logger(OperatingCostsService.name);
    
    constructor(
        private readonly ProductionDetailsService: ProductionDetailsService,
        private readonly ReceiptsService: ReceiptsService,
        private readonly LabourCostService: LabourCostService,

        @InjectModel(OperatingCostsInput.name) private operatingCostsInputModel : Model<OperatingCostsInput>,
        @InjectModel(OperatingCostsOutput.name) private operatingCostsOutputModel : Model<OperatingCostsOutput>,
        @InjectModel(ProductionDetailsInput.name) private productionDetailsInputModel: Model<ProductionDetailsInput>,
        @InjectModel(ReceiptsInput.name) private receiptsInputModel: Model<ReceiptsInput>,
        @InjectModel(ProductionDetailsOutput.name) private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
        @InjectModel(ReceiptsOutput.name) private reciptsOutputModel: Model<ReceiptsOutput>,
        @InjectModel(LabourCostInput.name) private labourinputmodel: Model<LabourCostInput>,
        @InjectModel(LabourCostOutput.name) private labouroutputmodel:Model<LabourCostOutput>,
        @InjectModel(User.name) private userModel : Model<User>
    ){}

    async updateInput(email: string, updateDto: OperatingCostsInputDto) {
        
        const user = await this.userModel.findOne({email}).exec();
        if(!user){
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
        }

        const userId = user._id.toString();
        console.log("____________________________________________________________________________________-")
        this.logger.log(`Updating inputs for user: ${userId}`);
        const updateData: any = {};

        for (const [key, value] of Object.entries(updateDto)) {
            if (value !== undefined) {
                updateData[key] = value;
            }
        }
        console.log("Here is updated data",updateData)
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

            const productionDetailsInputs = await this.productionDetailsInputModel.findOne({userId}).exec();
            // const productionDetailsOutputs = await this.productionDetailsOutputModel.findOne({userId}).exec();
            const reciptsInputs= await this.receiptsInputModel.findOne({userId}).exec();

            const labourinputs= await this.labourinputmodel.findOne({userId}).exec();

            
            return await this.calculateOperatingCostsOutput(updatedDocument,productionDetailsInputs,reciptsInputs,labourinputs);
            
        } catch (error) {
            this.logger.error(`Failed to update user inputs: ${error.message}`);
            throw new Error(`Failed to update user inputs: ${error.message}`);
        }
    }

    async calculateOperatingCostsOutput(
        updatedDocument: OperatingCostsInput | OperatingCostsInputDto,
        productionDetailsInputs: ProductionDetailsInput | ProductionDetailsInputDto,
        receiptsInput: ReceiptsInput | ReceiptsInputDto,
        labourinputs: LabourCostInput | LabourCostInputDto | null
      ) {
        this.logger.log(`Calculating Operating cost output`);
      
        let fetchedProductionDetailsOutputs: any = null;
        let fetchedReceiptsOutputs: any = null;
        let fetchedLabourOutputs:any=null;
      
        // Check if userId is present in updatedDocument
        if ('userId' in updatedDocument) {
          const userId = updatedDocument.userId;
          this.logger.log(`Calculating operating costs output for user: ${userId}`);
      
          fetchedProductionDetailsOutputs = await this.productionDetailsOutputModel.findOne({ userId }).exec();
          fetchedReceiptsOutputs = await this.reciptsOutputModel.findOne({ userId }).exec();
          fetchedLabourOutputs = await this.labouroutputmodel.findOne({userId}).exec();
      
          if (!fetchedProductionDetailsOutputs || !fetchedReceiptsOutputs) {
            this.logger.error(`No production details or receipts found for user: ${userId}`);
            throw new Error(`No production details or receipts found for user: ${userId}`);
          }
        } else {
          fetchedProductionDetailsOutputs = await this.ProductionDetailsService.calculateProductionDetailsOutput(productionDetailsInputs);
          fetchedReceiptsOutputs = await this.ReceiptsService.calculateReceiptsOutput(receiptsInput, productionDetailsInputs);
          if (labourinputs!==null){
            fetchedLabourOutputs=await this.LabourCostService.calculateLabourCostOutput(labourinputs);
          }
          
        }
      
        // Ensure productionDetailsInputs has required structure
        if (!productionDetailsInputs || !productionDetailsInputs.milkProduction || !productionDetailsInputs.heiferProduction || !productionDetailsInputs.beefCrossDetails) {
          this.logger.error(`Production details inputs are missing required fields`);
          throw new Error(`Production details inputs are missing required fields`);
        }


        console.log("Here is production out[it",fetchedProductionDetailsOutputs)
        console.log("Here is fetchedReceiptsOutputs in number: ", fetchedReceiptsOutputs)
        console.log("HERE IS OC",updatedDocument)
      
        // Inputs from operating costs
        const {
          haulingFees,
          organizationalFees,
          dhiaFees,
          vetExpenses,
          insurance,
          utilities,
          inseminationSexedFees,
          inseminationConventionalFees,
          inseminationConventionalBeefFees,
          wasteManagement,
          bedding,
          raisedForageCost,
          purchasedFeedCost,
          additionalManagementCostsPercentage,
          estimatedLabourCost,
          useDetailedLaborCost

        } = updatedDocument;
      
        // Variables from production details
        const totalAnnualMilkProduction = Number(fetchedProductionDetailsOutputs.totalAnnualMilkProduction);
        const totalNumberOfCows = Number(productionDetailsInputs.milkProduction.totalNumberOfCows);
        const numberOfLactationsPerYear = Number(fetchedProductionDetailsOutputs.numberOfLactationsPerYear);
        const beefCrossBullsProduced = Number(fetchedReceiptsOutputs.beefCrossBullsProduced);
        const beefCrossHeifersProduced = Number(fetchedReceiptsOutputs.beefCrossHeifersProduced);
      



        const haulingCosts = haulingFees * totalAnnualMilkProduction;
        const organizationalCosts = organizationalFees * totalAnnualMilkProduction;
        const dhiaCosts = dhiaFees * totalNumberOfCows;
        const vetCosts = vetExpenses * totalNumberOfCows;
        const utilityCosts = utilities * totalNumberOfCows;
        const inseminationSexedCosts = inseminationSexedFees * ((1/0.47) * (2/3) * (numberOfLactationsPerYear - (beefCrossBullsProduced + beefCrossHeifersProduced)));
        const inseminationConventionalCosts = inseminationConventionalFees * ((1/0.57) * (1/3) * (numberOfLactationsPerYear - (beefCrossBullsProduced + beefCrossHeifersProduced)));
        const inseminationConventionalBeefCosts = inseminationConventionalBeefFees * ((1/0.57) * (beefCrossBullsProduced + beefCrossHeifersProduced));
        const wasteManagementCosts = wasteManagement * totalNumberOfCows;
        const beddingCosts = bedding * totalNumberOfCows;
      
      
       
        // Calculate total dairy operating costs
        const dairyOperatingCosts = 
          haulingCosts +
          organizationalCosts +
          dhiaCosts +
          vetCosts +
          insurance +
          utilityCosts +
          inseminationSexedCosts +
          inseminationConventionalCosts +
          inseminationConventionalBeefCosts +
          wasteManagementCosts +
          beddingCosts;
      
        // Note: The following calculations are not included in the provided formulas,
        // but they're mentioned in the final total operating cost formula.
        // You may need to add these as inputs or calculate them separately.
       

        console.log("fetchedLabourOutputs: ",fetchedLabourOutputs)
        let dairyPayroll=0;
        if (useDetailedLaborCost===false || fetchedLabourOutputs===null){
            dairyPayroll = estimatedLabourCost;
        }
        else{
            dairyPayroll = fetchedLabourOutputs.ownerLaborCost +
            fetchedLabourOutputs.managerLaborCosts +
            fetchedLabourOutputs.herdHealthAndMaintenanceLaborCosts +
            fetchedLabourOutputs.feederLaborCosts +
            fetchedLabourOutputs.cropLaborCosts +
            fetchedLabourOutputs.milkerLaborCosts +
            fetchedLabourOutputs.replacementLaborCosts +
            fetchedLabourOutputs.facilitiesAndEquipmentLaborCosts +
            fetchedLabourOutputs.otherEmployeeLaborCosts;
          }
         // Placeholder
      
        // Calculate additional management costs
        const totalReceipts = fetchedReceiptsOutputs.milkSales +
          fetchedReceiptsOutputs.cullCowsSales +
          fetchedReceiptsOutputs.heifersSales +
          fetchedReceiptsOutputs.bullCalvesSales +
          fetchedReceiptsOutputs.beefCrossSales +
          fetchedReceiptsOutputs.otherIncome1 +
          fetchedReceiptsOutputs.otherIncome2;
  
        const additionalManagementCosts = (additionalManagementCostsPercentage/100) * totalReceipts;
      
        // Calculate total operating cost
        const totalOperatingCosts = 
          raisedForageCost +
          purchasedFeedCost +
          dairyOperatingCosts +
          dairyPayroll +
          additionalManagementCosts;


        const totalRaisedForageCost = raisedForageCost*totalNumberOfCows;

        const totalPurchasedFeedCost = purchasedFeedCost*totalNumberOfCows;

        //to confirm with cooper
        const totalFeedCost = totalRaisedForageCost + totalPurchasedFeedCost;
        // Create the output document
        const operatingCostsOutput = {
          totalFeedCost,
          totalRaisedForageCost,
          totalPurchasedFeedCost,
          dairyOperatingCosts,
          dairyPayroll,
          additionalManagementCosts,
          totalOperatingCosts, 
          haulingCosts,
          organizationalCosts,
          dhiaCosts,
          vetCosts,
          utilityCosts,
          inseminationSexedCosts,
          inseminationConventionalCosts,
          inseminationConventionalBeefCosts,
          wasteManagementCosts,
          beddingCosts,
                    
        };
      
        // Save the output to the database
        if ('userId' in updatedDocument) {
        try {
          const result = await this.operatingCostsOutputModel.findOneAndUpdate(
            { userId: updatedDocument.userId },
            { $set: operatingCostsOutput },
            { new: true, upsert: true }
          );
      
          this.logger.log(`Successfully calculated and updated operating costs output for user: ${updatedDocument.userId}`);
          return result;
        } catch (error) {
          this.logger.error(`Failed to calculate operating costs output: ${error.message}`);
          throw new Error(`Failed to calculate operating costs output: ${error.message}`);
        }
    }

    console.log("Here are operating cost output",operatingCostsOutput)
    return operatingCostsOutput;
}

async getOperatingCostOutput(email: string): Promise<OperatingCostsOutput|null>{
    //first find the user_id using the email, then find the document using the id
    const user = await this.userModel.findOne({email}).exec();
    if(!user){
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
    }

    const userId = user._id.toString();
    console.log('userId ', userId);

    const outputDocument = await this.operatingCostsOutputModel.findOne({userId}).exec();
    console.log("outputDocument ",outputDocument);

    if(!outputDocument){
        throw new HttpException('Output record for this user not found', HttpStatus.NOT_FOUND)
    }

    return outputDocument;
}

async getOperatingCostInput(email:string): Promise<OperatingCostsInput | null>{
    //first find the user_id using the email, then find the document using the id
    const user = await this.userModel.findOne({email}).exec();
    if(!user){
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
    }

    const userId = user._id.toString();
    console.log('userId ', userId);

    const inputDocument = this.operatingCostsInputModel.findOne({userId}).exec();

    if(!inputDocument){
        throw new HttpException('Input record for this user not found', HttpStatus.NOT_FOUND)
    }

    return inputDocument;
}
}