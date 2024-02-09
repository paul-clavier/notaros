import { DomainModule } from "@/domain/domain.module";
import { InfrastructureModule } from "@/infrastructure/infrastructure.module";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

@Module({
    imports: [InfrastructureModule, DomainModule],
    controllers: [AuthController],
})
export class AuthModule {}
