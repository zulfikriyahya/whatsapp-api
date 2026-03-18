import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(cfg: ConfigService) {
    super({
      clientID: cfg.get("google.clientId"),
      clientSecret: cfg.get("google.clientSecret"),
      callbackURL: cfg.get("google.callbackUrl"),
      scope: ["email", "profile"],
    });
  }

  validate(_at: string, _rt: string, profile: any, done: VerifyCallback) {
    const { emails, displayName, photos } = profile;
    done(null, {
      email: emails[0].value,
      name: displayName,
      picture: photos?.[0]?.value,
    });
  }
}
