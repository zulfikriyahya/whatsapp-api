import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import { Verify2faDto } from "./dto/verify-2fa.dto";
import { VerifyCodeDto } from "./dto/verify-code.dto";

@ApiTags("Auth")
@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private svc: AuthService,
    private cfg: ConfigService,
  ) {}

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Redirect ke Google OAuth" })
  googleLogin() {}

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Google OAuth callback" })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const profile = req.user as any;
    const ip = req.ip;
    const ua = req.headers["user-agent"];
    const clientUrl = this.cfg.get<string>("app.clientUrl");
    const cookieSecure = this.cfg.get<boolean>("app.cookieSecure");

    const user = await this.svc.validateGoogleUser(profile, ip, ua);

    if (user.twoFaEnabled) {
      const tempToken = await this.svc.createTempToken(user.id);
      return res.redirect(`${clientUrl}/auth/2fa?token=${tempToken}`);
    }

    const token = this.svc.signJwt(user);
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: cookieSecure,
      maxAge: 7 * 24 * 3600 * 1000,
    });
    return res.redirect(`${clientUrl}/dashboard`);
  }

  @Public()
  @Post("2fa/verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verifikasi kode 2FA setelah Google login" })
  async verify2fa(
    @Body() dto: Verify2faDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieSecure = this.cfg.get<boolean>("app.cookieSecure");
    const user = await this.svc.verify2fa(
      dto.tempToken,
      dto.code,
      req.ip,
      req.headers["user-agent"],
    );
    const token = this.svc.signJwt(user);
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: cookieSecure,
      maxAge: 7 * 24 * 3600 * 1000,
    });
    return {
      status: true,
      data: { user: { id: user.id, email: user.email, role: user.role } },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiOperation({ summary: "Data user yang sedang login" })
  me(@CurrentUser() u: any) {
    return {
      status: true,
      data: {
        id: u.id,
        email: u.email,
        name: u.name,
        picture: u.picture,
        role: u.role,
        twoFaEnabled: u.twoFaEnabled,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/setup")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Setup 2FA - generate QR code" })
  async setup2fa(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.setup2fa(u.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/enable")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Aktifkan 2FA setelah scan QR" })
  async enable2fa(
    @CurrentUser() u: any,
    @Body() dto: VerifyCodeDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.enable2fa(
        u.id,
        dto.code,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/disable")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Nonaktifkan 2FA" })
  async disable2fa(
    @CurrentUser() u: any,
    @Body() dto: VerifyCodeDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.disable2fa(
        u.id,
        dto.code,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/backup-codes/regenerate")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Regenerate backup codes 2FA" })
  async regenerateBackupCodes(
    @CurrentUser() u: any,
    @Body() dto: VerifyCodeDto,
  ) {
    return {
      status: true,
      data: await this.svc.regenerateBackupCodes(u.id, dto.code),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout" })
  async logout(
    @CurrentUser() u: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.svc.logout(u.id, u.email, req.ip, req.headers["user-agent"]);
    res.clearCookie("auth_token");
    return { status: true };
  }
}
