import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabourCostInput } from '../schemas/inputs/LabourInput.schema';
import { LabourCostOutput } from '../schemas/outputs/LabourOutput.schema';
import { LabourCostInputDto } from '../dto/labour-cost-input.dto';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class LabourCostService {
  private readonly logger = new Logger(LabourCostService.name);

  constructor(
    @InjectModel(LabourCostInput.name)
    private labourCostInputModel: Model<LabourCostInput>,
    @InjectModel(LabourCostOutput.name)
    private labourCostOutputModel: Model<LabourCostOutput>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateInput(email: string, updateDto: LabourCostInputDto) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();
    this.logger.log(`Updating labour cost inputs for user: ${userId}`);
    const updateData: any = {};

    // Handling Labour Cost Inputs
    for (const [key, value] of Object.entries(updateDto)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    try {
      const updatedDocument = await this.labourCostInputModel.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, upsert: true },
      );

      if (!updatedDocument) {
        this.logger.warn(`User not found: ${userId}`);
        throw new Error('User not found');
      }

      this.logger.log(
        `Successfully updated labour cost inputs for user: ${userId}`,
      );
      return await this.calculateLabourCostOutput(updatedDocument);
    } catch (error) {
      this.logger.error(`Failed to update user inputs: ${error.message}`);
      throw new Error(`Failed to update user inputs: ${error.message}`);
    }
  }

  async calculateLabourCostOutput(
    updatedDocument: LabourCostInput | LabourCostInputDto,
  ) {
    this.logger.log(
      `Calculating labour cost output for user: ${updatedDocument['userId'] || 'non-authenticated'}`,
    );

    const ownerLaborCost =
      updatedDocument.numberOfOwners *
      (updatedDocument.ownerSalary + updatedDocument.ownerBenefits);
    const managerLaborCosts =
      updatedDocument.numberOfManagers *
      (updatedDocument.managerSalary + updatedDocument.managerBenefits);
    const herdHealthAndMaintenanceLaborCosts =
      updatedDocument.numberOfHerdHealthEmployees *
      updatedDocument.herdHealthEmployeeTime *
      (updatedDocument.herdHealthEmployeeWage +
        updatedDocument.herdHealthEmployeeBenefits);
    const feederLaborCosts =
      updatedDocument.numberOfFeederEmployees *
      updatedDocument.feederEmployeeTime *
      (updatedDocument.feederEmployeeWage +
        updatedDocument.feederEmployeeBenefits);
    const cropLaborCosts =
      updatedDocument.numberOfCropEmployees *
      updatedDocument.cropEmployeeTime *
      (updatedDocument.cropEmployeeWage + updatedDocument.cropEmployeeBenefits);
    const milkerLaborCosts =
      updatedDocument.numberOfMilkerEmployees *
      updatedDocument.milkerEmployeeTime *
      (updatedDocument.milkerEmployeeWage +
        updatedDocument.milkerEmployeeBenefits);
    const replacementLaborCosts =
      updatedDocument.replacementEmployees *
      updatedDocument.replacementEmployeeTime *
      (updatedDocument.replacementEmployeeWage +
        updatedDocument.replacementEmployeeBenefits);
    const facilitiesAndEquipmentLaborCosts =
      updatedDocument.facilitiesEmployees *
      updatedDocument.facilitiesEmployeeTime *
      (updatedDocument.facilitiesEmployeeWage +
        updatedDocument.facilitiesEmployeeBenefits);
    const otherEmployeeLaborCosts =
      updatedDocument.otherEmployees *
      updatedDocument.otherEmployeeTime *
      (updatedDocument.otherEmployeeWage +
        updatedDocument.otherEmployeeBenefits);

    const updatedOutputDocument = {
      ownerLaborCost,
      managerLaborCosts,
      herdHealthAndMaintenanceLaborCosts,
      feederLaborCosts,
      cropLaborCosts,
      milkerLaborCosts,
      replacementLaborCosts,
      facilitiesAndEquipmentLaborCosts,
      otherEmployeeLaborCosts,
    };

    if ('userId' in updatedDocument) {
      try {
        const result = await this.labourCostOutputModel.findOneAndUpdate(
          { userId: updatedDocument['userId'] },
          { $set: updatedOutputDocument },
          { new: true, upsert: true },
        );

        this.logger.log(
          `Successfully calculated and updated labour cost output for user: ${updatedDocument['userId']}`,
        );
        return result;
      } catch (error) {
        this.logger.error(
          `Failed to calculate labour cost output: ${error.message}`,
        );
        throw new Error(
          `Failed to calculate labour cost output: ${error.message}`,
        );
      }
    }

    return updatedOutputDocument;
  }

  async getLabourCostOutput(email: string): Promise<LabourCostOutput | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();
    const outputDocument = await this.labourCostOutputModel
      .findOne({ userId })
      .exec();

    if (!outputDocument) {
      throw new HttpException(
        'Output record for this user not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return outputDocument;
  }

  async getLabourCostInput(email: string): Promise<LabourCostInput | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = user._id.toString();
    const inputDocument = await this.labourCostInputModel
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
