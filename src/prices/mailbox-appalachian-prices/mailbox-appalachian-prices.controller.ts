import { Controller, Get } from '@nestjs/common';
import { MailboxAppalachianPricesService } from './mailbox-appalachian-prices.service';
import { MailboxAppalachianPrice } from '../schemas/mailbox-appalachain-prices.schema';

@Controller('mailboxAppalachianPrices')
export class MailboxAppalachianPricesController {
  constructor(
    private mailboxAppalachianPricesService: MailboxAppalachianPricesService,
  ) {}

  @Get('/allYears')
  async getAllYearsPrices(): Promise<MailboxAppalachianPrice[]> {
    return this.mailboxAppalachianPricesService.getAllYearsPrices();
  }
}
