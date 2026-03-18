import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger("HttpException");

  constructor(private nodeEnv: string) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const body = exception.getResponse() as any;

    if (status >= 500)
      this.logger.error(`${req.method} ${req.url}`, exception.stack);

    res.status(status).json({
      status: false,
      error:
        typeof body === "string"
          ? body
          : body.message || body.error || "An error occurred",
      code: body?.code,
      details: this.nodeEnv !== "production" ? body?.details : undefined,
    });
  }
}
