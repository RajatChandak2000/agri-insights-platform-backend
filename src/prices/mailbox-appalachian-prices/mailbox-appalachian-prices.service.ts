import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailboxAppalachianPrice } from '../schemas/mailbox-appalachain-prices.schema';
import { Model } from 'mongoose';

@Injectable()
export class MailboxAppalachianPricesService {
  constructor(
    @InjectModel(MailboxAppalachianPrice.name)
    private mailboxAppalachianPriceModel: Model<MailboxAppalachianPrice>,
  ) {}

  async getAllYearsPrices(): Promise<MailboxAppalachianPrice[]> {
    return await this.mailboxAppalachianPriceModel.find({}).exec();
  }
}
