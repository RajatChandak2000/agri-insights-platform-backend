import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { FeedDetailsService } from "./feed-details.service";
import { FeedDetailsInputDto } from "../dto/feed-details-input.dto";
import { FeedDetailsOutput } from "../schemas/outputs/FeedDetailsOutput.schema";
import { FeedDetailsInput } from "../schemas/inputs/FeedDetailsInput.schema";

@Controller('feed-details')
export class FeedDetailsController{
    constructor(private feedDetailsService: FeedDetailsService){}

    @Patch('updateInput/:email')
    async updateInput(
        @Param('email') email: string,
        @Body() updateDto: FeedDetailsInputDto
    ){
        console.log("Data got from client is ", updateDto);
        return this.feedDetailsService.updateInput(email, updateDto)
    }

    @Get('outputDetails/:email')
    async getFeedDetailsOutput(@Param('email') email:string): Promise<FeedDetailsOutput | null>{
        console.log("Calleddd feed o");
        return this.feedDetailsService.getFeedDetailsOutput(email);
    }

    @Get('inputDetails/:email')
    async getFeedDetailsInput(@Param('email') email:string): Promise<FeedDetailsInput | null>{
        console.log("Called feed i");
        
        return this.feedDetailsService.getFeedDetailsInput(email);
    }

    // @Post('calculateProductionDetails')
    // async calculateOutputs(@Body() inputDto: FeedDetailsInputDto) {
    //   console.log("Calculating outputs for non-authenticated user");
    //   return this.feedDetailsService.calculateFeedDetailsOutput(inputDto);
    // }
}