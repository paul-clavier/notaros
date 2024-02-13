import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
    // TODO: Think about adding a refresh method on every object returned by Prisma
    // This would imply declaring all Prisma methods and return the object it returns as well as the refresh method
    // It would be very nice to have i in tests
}
