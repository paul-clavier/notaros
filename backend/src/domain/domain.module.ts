import { InfrastructureModule } from "@/infrastructure/infrastructure.module";
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginUseCase } from "./use-cases";

const useCases = [LoginUseCase];

const services = [];

@Module({
    providers: [...useCases, ...services, JwtService],
    imports: [InfrastructureModule],
    exports: [...useCases, ...services],
})
export class DomainModule {}
