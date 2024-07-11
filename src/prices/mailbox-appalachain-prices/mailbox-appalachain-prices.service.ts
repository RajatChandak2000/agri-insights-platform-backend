import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MailboxAppalachianPrice } from "../schemas/mailbox-appalachain-prices.schema";
import { Model } from "mongoose";

@Injectable()
export class MailboxAppalachainPricesService{
    constructor(
        @InjectModel(MailboxAppalachianPrice.name) private mailboxAppalachainPriceModel: Model<MailboxAppalachianPrice>
    ){}

    async getAllYearsPrices(): Promise<MailboxAppalachianPrice[]>{
        return await this.mailboxAppalachainPriceModel.find({}).exec()
    }

}