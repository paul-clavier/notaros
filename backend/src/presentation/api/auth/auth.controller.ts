import { User } from "@/domain/users";
import { Mutable } from "@/utils/types";
import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthedRequest, AuthedRequestWithRefreshToken, toPort } from "../dto";
import {
    RefreshTokensResponse,
    SignInRequestDto,
    SignInResponse,
    SignInResponseDto,
    SignUpRequestDto,
    SignUpResponse,
    SignUpResponseDto,
} from "./auth.dto";
import { AccessTokenGuard, RefreshTokenGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signIn")
    @ApiOkResponse({ type: SignInResponseDto })
    async login(
        @Body() { email, password }: SignInRequestDto,
        @Res({ passthrough: true }) res,
    ): Promise<SignInResponseDto> {
        const result = this.authService.signIn(email, password);
        const response = new SignInResponse(result);
        const tokens = await response.get();
        res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        return response.send();
    }

    @Post("signUp")
    @ApiOkResponse({ type: SignUpResponseDto })
    async signup(
        @Body() { email, password, firstName, lastName }: SignUpRequestDto,
        @Res({ passthrough: true }) res,
    ): Promise<SignUpResponseDto> {
        const port = toPort<
            Omit<Mutable<User>, "refreshToken">,
            SignUpRequestDto
        >({
            email,
            password,
            firstName,
            lastName,
        });
        const result = this.authService.signUp(port);
        const response = new SignUpResponse(result);
        if (await response.isOk()) {
            const tokens = await response.get();
            res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
            res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        }
        return response.send();
    }

    @Get("signOut")
    @UseGuards(AccessTokenGuard)
    async signout(
        @Request() request: AuthedRequest,
        @Res({ passthrough: true }) res,
    ) {
        await this.authService.signOut(request.user.id);
        res.cookie("accessToken", null, { httpOnly: true });
        res.cookie("refreshToken", null, { httpOnly: true });
    }

    @Get("refreshToken")
    @UseGuards(RefreshTokenGuard)
    refreshTokens(@Request() request: AuthedRequestWithRefreshToken) {
        const result = this.authService.refreshTokens(
            request.user.id,
            request.user.refreshToken,
        );
        const response = new RefreshTokensResponse(result);
        return response.send();
    }

    @Get("toto")
    @UseGuards(AccessTokenGuard)
    async toto() {
        return "toto";
    }
}
