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
            jwtFromRequest: ExtractJwt.fromExtractors([
                AccessJwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: JWT_ACCESS_SECRET,
        });
    }

    validate(payload: UserPayload) {
        return payload;
    }

    private static extractJWT(req: Request): string | null {
        if (req.cookies && "accessToken" in req.cookies) {
            return req.cookies.accessToken;
        }
        return null;
    }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
    Strategy,
    "jwt-refresh",
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RefreshJwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.cookies.refreshToken;
        return { ...payload, refreshToken };
    }

    private static extractJWT(req: Request): string | null {
        if (req.cookies && "refreshToken" in req.cookies) {
            return req.cookies.refreshToken;
        }
        return null;
    }
}
