import { Module } from "@nestjs/common";
import { RepositoriesModule } from "./repositories/repositories.module";

@Module({
    imports: [RepositoriesModule],
    exports: [RepositoriesModule],
})
export class InfrastructureModule {}
