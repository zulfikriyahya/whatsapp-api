import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { isIpAllowed } from "../utils/ip-validator.util";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const whitelist = process.env.GLOBAL_IP_WHITELIST;
    if (whitelist) {
      const clientIp = req.ip ?? req.socket.remoteAddress ?? "";
      if (!isIpAllowed(clientIp, whitelist)) {
        throw new ForbiddenException({ code: ErrorCodes.IP_NOT_WHITELISTED });
      }
    }
    next();
  }
}
