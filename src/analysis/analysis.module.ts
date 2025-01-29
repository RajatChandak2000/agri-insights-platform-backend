import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Analysis, AnalysisSchema } from "./schemas/analysis.schema";
import { AnalysisService } from "./analysis.service";
import { AnalysisController } from "./analysis.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Analysis.name, schema: AnalysisSchema }]),
    ],
    providers: [AnalysisService],
    controllers: [AnalysisController],
})
export class AnalysisModule {}
