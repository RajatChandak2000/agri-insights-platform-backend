import { Controller, Get } from "@nestjs/common";
import { MailboxAppalachainPricesService } from "./mailbox-appalachain-prices.service";
import { MailboxAppalachianPrice } from "../schemas/mailbox-appalachain-prices.schema";

@Controller('mailboxAppalachainPrices')
export class MailboxAppalachainPricesController{
    constructor(private mailboxAppalachainPricesService: MailboxAppalachainPricesService){}

    @Get('/allYears')
    async getAllYearsPrices(): Promise<MailboxAppalachianPrice[]>{
        return this.mailboxAppalachainPricesService.getAllYearsPrices()
    }
}