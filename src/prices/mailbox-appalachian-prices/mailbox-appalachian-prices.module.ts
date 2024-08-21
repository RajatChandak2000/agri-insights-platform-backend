import { Module } from "@nestjs/common";
import { MailboxAppalachianPricesService } from "./mailbox-appalachian-prices.service";
import { MailboxAppalachianPricesController } from "./mailbox-appalachian-prices.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MailboxAppalachianPrice, MailboxAppalachianSchema } from "../schemas/mailbox-appalachain-prices.schema";

@Module({
    imports:[
        MongooseModule.forFeature([{name: MailboxAppalachianPrice.name, schema: MailboxAppalachianSchema}])
    ],
    providers:[MailboxAppalachianPricesService],
    controllers:[MailboxAppalachianPricesController]
})
export class MailboxAppalachianPricesModule{}