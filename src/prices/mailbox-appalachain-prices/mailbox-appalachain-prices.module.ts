import { Module } from "@nestjs/common";
import { MailboxAppalachainPricesService } from "./mailbox-appalachain-prices.service";
import { MailboxAppalachainPricesController } from "./mailbox-appalachain-prices.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MailboxAppalachianPrice, MailboxAppalachianSchema } from "../schemas/mailbox-appalachain-prices.schema";

@Module({
    imports:[
        MongooseModule.forFeature([{name: MailboxAppalachianPrice.name, schema: MailboxAppalachianSchema}])
    ],
    providers:[MailboxAppalachainPricesService],
    controllers:[MailboxAppalachainPricesController]
})
export class MailboxAppalachainPricesModule{}