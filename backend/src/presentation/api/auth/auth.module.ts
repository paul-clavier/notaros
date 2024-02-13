import { RepositoriesModule } from "@/infrastructure/repositories/repositories.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessJwtStrategy, RefreshJwtStrategy } from "./jwt.strategy";

/**
 * This wad made following this article: https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
 * - JwtModule en gros il est là pour chiffrer/déchiffrer les tokens
 * - Passport Module il fait la lecture du Authorization Header et enlève la string "Bearer" et il valide ou non le token
 * - Les strategies faut les voir comme des middleware qui te permettent d'extract et lire le jwtToken
 */
@Module({
    imports: [RepositoriesModule, PassportModule, JwtModule.register({})],
    providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
