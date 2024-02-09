import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserRepositoryProvider } from "../repositories/repositories.provider";

@Module({
    imports: [PassportModule.register({ defaultStrategy: "jwt" })],
    providers: [UserRepositoryProvider],
    exports: [PassportModule],
})
export class AuthProviderModule {}
