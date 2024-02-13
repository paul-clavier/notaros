import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "@/app.constants";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

export interface UserPayload {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_ACCESS_SECRET,
        });
    }

    validate(payload: UserPayload) {
        return payload;
    }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
    Strategy,
    "jwt-refresh",
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const refreshToken = req
            .get("Authorization")
            ?.replace("Bearer", "")
            .trim();
        return { ...payload, refreshToken };
    }
}
