import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ReceiptsInput } from '../schemas/inputs/ReceiptsInput.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReceiptsOutput } from '../schemas/outputs/ReceiptsOutput.schema';
import { User } from 'src/user/schemas/user.schema';
import { ReceiptsInputDto } from '../dto/receipts-input.dto';
import { ProductionDetailsInput } from '../schemas/inputs/ProductionDetailsInput.schema';
import { ProductionDetailsOutput } from '../schemas/outputs/ProductionDetailsOutput.schema';
import { ProductionDetailsInputDto } from '../dto/production-details-input.dto';
import { ProductionDetailsService } from '../production-details/production-details.service';

@Injectable()
export class ReceiptsService {
  private readonly logger = new Logger(ReceiptsService.name);

  constructor(
    private readonly ProductionDetailsService: ProductionDetailsService,
    @InjectModel(ReceiptsInput.name)
    private receiptsInputModel: Model<ReceiptsInput>,
    @InjectModel(ReceiptsOutput.name)
    private receiptsOutputModel: Model<ReceiptsOutput>,
    @InjectModel(ProductionDetailsInput.name)
    private productionDetailsInputModel: Model<ProductionDetailsInput>,
    @InjectModel(ProductionDetailsOutput.name)
    private productionDetailsOutputModel: Model<ProductionDetailsOutput>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateInput(email: string, updateDto: ReceiptsInputDto) {
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

    for (const [key, value] of Object.entries(updateDto)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    try {
      const updatedDocument = await this.receiptsInputModel.findOneAndUpdate(
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

      const productionDetailsInputs = await this.productionDetailsInputModel
        .findOne({ userId })
        .exec();

      return await this.calculateReceiptsOutput(
        updatedDocument,
        productionDetailsInputs,
      );
    } catch (error) {
      this.logger.error(`Failed to update user inputs: ${error.message}`);
      throw new Error(`Failed to update user inputs: ${error.message}`);
    }
  }

  async calculateReceiptsOutput(
    updatedDocument: ReceiptsInput | ReceiptsInputDto,
    productionDetailsInputs: ProductionDetailsInput | ProductionDetailsInputDto,
  ) {
    let fetchedproductionDetailsOutputs: any = null;

    // Check if userId is present in updatedDocument
    if ('userId' in updatedDocument) {
      this.logger.log(
        `Calculating recipts input details output for user: ${updatedDocument.userId}`,
      );
      console.log(
        'Here are the upadted document-----------------------------------------',
        productionDetailsInputs,
      );
      // Fetch production details using userId
      const userId = updatedDocument.userId;
      fetchedproductionDetailsOutputs = await this.productionDetailsOutputModel
        .findOne({ userId })
        .exec();

      if (!fetchedproductionDetailsOutputs) {
        this.logger.error(`No production details found for user: ${userId}`);
        throw new Error(`No production details found for user: ${userId}`);
      }
    } else {
      // Calculate production details if userId is not present
      fetchedproductionDetailsOutputs =
        await this.ProductionDetailsService.calculateProductionDetailsOutput(
          productionDetailsInputs,
        );
    }

    // Ensure productionDetailsInputs has required structure
    if (
      !productionDetailsInputs ||
      !productionDetailsInputs.milkProduction ||
      !productionDetailsInputs.heiferProduction ||
      !productionDetailsInputs.beefCrossDetails
    ) {
      this.logger.error(
        `Production details inputs are missing required fields`,
      );
      throw new Error(`Production details inputs are missing required fields`);
    }

    // Inputs from Receipts
    const {
      cullCowsPrice,
      heifersPrice,
      bullCalvesPrice,
      beefCrossPrice,
      otherIncome1,
      otherIncome2,
    } = updatedDocument;

    // Extract values from productionDetailsInputs
    const { totalNumberOfCows, calvingInterval } =
      productionDetailsInputs.milkProduction;
    const {
      expectedPercentMaleWithSexedSemen,
      expectedPercentMaleWithConventional,
      cullingRate,
      cowDeathLossRate,
      heiferRaisingDeathLossRate,
      bullCalfDeath,
      numberOfHeifersRaised,
    } = productionDetailsInputs.heiferProduction;
    const { beefCrossPercent, beefCrossDeathRate } =
      productionDetailsInputs.beefCrossDetails;
    const expectedAnnualMilkSales =
      fetchedproductionDetailsOutputs.expectedAnnualMilkSales;

    const lactations = (totalNumberOfCows * 12) / calvingInterval;

    // Calculate various outputs

    console.log('Number of heifers rased : ', numberOfHeifersRaised);
    const cullcows = Math.round(
      (cullingRate / 100) * totalNumberOfCows * (1 - cowDeathLossRate / 100),
    );
    const heifersProduced = Math.round(
      (2 / 3) * lactations * (1 - expectedPercentMaleWithSexedSemen / 100) +
        (1 / 3) * lactations * (1 - expectedPercentMaleWithConventional / 100),
    );
    const bullCalvesProduced = Math.round(
      (2 / 3) * lactations * (expectedPercentMaleWithSexedSemen / 100) +
        (1 / 3) * lactations * (expectedPercentMaleWithConventional / 100),
    );
    const beefCrossBullsProduced = Math.round(
      (1 / 3) *
        lactations *
        (expectedPercentMaleWithConventional / 100) *
        (beefCrossPercent / 100),
    );
    const beefCrossHeifersProduced = Math.round(
      ((2 / 3) * lactations * (1 - expectedPercentMaleWithSexedSemen / 100) -
        numberOfHeifersRaised +
        (1 / 3) *
          lactations *
          (1 - expectedPercentMaleWithConventional / 100)) *
        (beefCrossPercent / 100),
    );

    console.log('cullcows: ', cullcows);
    console.log('heifersProduced: ', heifersProduced);
    console.log('bullCalvesProduced: ', bullCalvesProduced);
    console.log('beefCrossBullsProduced: ', beefCrossBullsProduced);
    console.log('beefCrossHeifersProduced: ', beefCrossHeifersProduced);

    // Calculate sales
    const milkSales = expectedAnnualMilkSales;
    const cullCowsSales = cullcows * cullCowsPrice;
    const heifersSales =
      Math.round(
        (heifersProduced - numberOfHeifersRaised - beefCrossHeifersProduced) *
          (1 - heiferRaisingDeathLossRate / 100),
      ) * heifersPrice;
    const bullCalvesSales =
      Math.round(
        (bullCalvesProduced - beefCrossBullsProduced) *
          (1 - bullCalfDeath / 100),
      ) * bullCalvesPrice;
    const beefCrossSales =
      Math.round(
        beefCrossBullsProduced * (1 - beefCrossDeathRate / 100) +
          beefCrossHeifersProduced * (1 - beefCrossDeathRate / 100),
      ) * beefCrossPrice;

    //calculate the total receipts
    const totalReceipts =
      milkSales +
      cullCowsSales +
      heifersSales +
      bullCalvesSales +
      beefCrossSales +
      otherIncome1 +
      otherIncome2;

    // Prepare the updated output document
    const updatedOutputDocument = {
      milkSales: parseFloat(milkSales.toFixed(2)),
      cullCowsSales: parseFloat(cullCowsSales.toFixed(2)),
      heifersSales: parseFloat(heifersSales.toFixed(2)),
      bullCalvesSales: parseFloat(bullCalvesSales.toFixed(2)),
      beefCrossSales: parseFloat(beefCrossSales.toFixed(2)),
      heifersProduced: parseFloat(heifersProduced.toFixed(2)),
      bullCalvesProduced: parseFloat(bullCalvesProduced.toFixed(2)),
      beefCrossBullsProduced: parseFloat(beefCrossBullsProduced.toFixed(2)),
      beefCrossHeifersProduced: parseFloat(beefCrossHeifersProduced.toFixed(2)),
      otherIncome1: parseFloat(otherIncome1.toFixed(2)),
      otherIncome2: parseFloat(otherIncome2.toFixed(2)),
      totalReceipts: parseFloat(totalReceipts.toFixed(2)),
    };

    if ('userId' in updatedDocument) {
      try {
        const result = await this.receiptsOutputModel.findOneAndUpdate(
          { userId: updatedDocument.userId },
          { $set: updatedOutputDocument },
          { new: true, upsert: true },
        );

        this.logger.log(
          `Successfully calculated and updated receipts output for user: ${updatedDocument.userId}`,
        );
        return result;
      } catch (error) {
        this.logger.error(
          `Failed to calculate receipts output: ${error.message}`,
        );
        throw new Error(
          `Failed to calculate receipts output: ${error.message}`,
        );
      }
    }

    return updatedOutputDocument;
  }

  async getReceiptsOutput(email: string): Promise<ReceiptsOutput | null> {
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

    const outputDocument = await this.receiptsOutputModel
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

  async getReceiptsInput(email: string): Promise<ReceiptsInput | null> {
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

    const inputDocument = this.receiptsInputModel.findOne({ userId }).exec();

    if (!inputDocument) {
      throw new HttpException(
        'Input record for this user not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return inputDocument;
  }
}
