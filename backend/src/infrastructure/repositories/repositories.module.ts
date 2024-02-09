import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { UserRepositoryProvider } from "./repositories.provider";

const repositories = [UserRepositoryProvider];

@Module({
    providers: [PrismaService, ...repositories],
    exports: [PrismaService, ...repositories],
})
export class RepositoriesModule {}
