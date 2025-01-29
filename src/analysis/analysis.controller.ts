import { Controller, Get } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { Analysis } from './schemas/analysis.schema';

@Controller('analysis')
export class AnalysisController {
    constructor(private analysisService: AnalysisService) {}

    @Get('')
    async getAllAnalysisData(): Promise<Analysis[]> {
        return await this.analysisService.getAllAnalysisData();
    }

    @Get('/latestWeeks')
    async getLatestAnalysisData(): Promise<Analysis[]> {
        const latestAnalysisData = await this.analysisService.getLatestAnalysisData();
        console.log("latestAnalysisData ", latestAnalysisData);

        return latestAnalysisData;
    }
}
