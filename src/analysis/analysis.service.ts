import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Analysis } from "./schemas/analysis.schema";
import { Model } from "mongoose";

@Injectable()
export class AnalysisService {
    constructor(
        @InjectModel(Analysis.name) private analysisModel: Model<Analysis>,
    ) {}

    async getAllAnalysisData(): Promise<Analysis[]> {
        return await this.analysisModel.find({}).exec();
    }

    async getLatestAnalysisData(): Promise<Analysis[]> {
        return await this.analysisModel
            .find({})
            .sort({ timestamp: -1 })
            .limit(336)
            .exec();
    }
}