import { InfrastructureModule } from "@/infrastructure/infrastructure.module";
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./services/auth.service";
import { LoginUseCase } from "./use-cases";

const useCases = [LoginUseCase];

const services = [AuthService];

@Module({
    providers: [...useCases, ...services, JwtService],
    imports: [InfrastructureModule],
    exports: [...useCases, ...services],
})
export class DomainModule {}
