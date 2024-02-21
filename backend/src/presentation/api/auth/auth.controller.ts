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
        if (await response.isOk()) {
            const tokens = await response.get();
            res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
            res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        }
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

    @Post("signOut")
    @UseGuards(AccessTokenGuard)
    async signout(
        @Request() request: AuthedRequest,
        @Res({ passthrough: true }) res,
    ) {
        await this.authService.signOut(request.user.id);
        res.cookie("accessToken", null, { httpOnly: true });
        res.cookie("refreshToken", null, { httpOnly: true });
    }

    @Post("refreshTokens")
    @UseGuards(RefreshTokenGuard)
    async refreshTokens(
        @Request() request: AuthedRequestWithRefreshToken,
        @Res({ passthrough: true }) res,
    ) {
        const result = this.authService.refreshTokens(
            request.user.id,
            request.user.refreshToken,
        );
        const response = new RefreshTokensResponse(result);
        if (await response.isOk()) {
            const tokens = await response.get();
            res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
            res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        }
    }

    @Post("toto")
    @UseGuards(AccessTokenGuard)
    async postToto() {
        return "toto";
    }

    @Get("toto")
    @UseGuards(AccessTokenGuard)
    async getToto() {
        return { message: "toto" };
    }
}
