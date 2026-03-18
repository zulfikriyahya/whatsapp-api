import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Response } from "express";
import { ErrorCodes } from "../constants/error-codes.constant";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private logger = new Logger("PrismaException");

  constructor(private nodeEnv: string) {}

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    this.logger.error(exception.message);

    const map: Record<string, [number, string]> = {
      P2002: [HttpStatus.CONFLICT, ErrorCodes.DUPLICATE_SESSION_NAME],
      P2025: [HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND],
    };
    const [status, code] = map[exception.code] ?? [
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INTERNAL,
    ];
    res.status(status).json({ status: false, error: exception.message, code });
  }
}
