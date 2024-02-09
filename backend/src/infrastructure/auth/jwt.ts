import { JWT_SECRET } from "@/app.constants";
import { USER_REPOSITORY } from "@/domain/injection-tokens";
import { UserRepository } from "@/domain/users";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        });
    }

    async validate({ userId }: { userId: number }) {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            // TODO: Raise a custom exception
            throw new UnauthorizedException();
        }

        return user;
    }
}
