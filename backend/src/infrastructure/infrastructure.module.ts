import { Module } from "@nestjs/common";
import { AuthProviderModule } from "./auth/auth.module";
import { RepositoriesModule } from "./repositories/repositories.module";

@Module({
    imports: [RepositoriesModule, AuthProviderModule],
    exports: [RepositoriesModule],
})
export class InfrastructureModule {}
