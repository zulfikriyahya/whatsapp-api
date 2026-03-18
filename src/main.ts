import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { IoAdapter } from "@nestjs/platform-socket.io";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });

  const config = app.get(ConfigService);
  const port = config.get<number>("app.port");
  const clientUrl = config.get<string>("app.clientUrl");
  const cookieSecret = config.get<string>("app.cookieSecret");
  const nodeEnv = config.get<string>("app.nodeEnv");

  // ── Security ──────────────────────────────────────────────
  app.use(helmet());
  app.use(cookieParser(cookieSecret));

  // ── CORS ──────────────────────────────────────────────────
  app.enableCors({
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // ── API Prefix & Versioning ───────────────────────────────
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  // ── Global Pipes ──────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global Filters ────────────────────────────────────────
  app.useGlobalFilters(
    new HttpExceptionFilter(nodeEnv),
    new PrismaExceptionFilter(nodeEnv),
  );

  // ── Global Interceptors ───────────────────────────────────
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(),
    new ResponseInterceptor(),
  );

  // ── Socket.IO ─────────────────────────────────────────────
  app.useWebSocketAdapter(new IoAdapter(app));

  // ── Swagger ───────────────────────────────────────────────
  if (nodeEnv !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("WhatsApp Gateway SaaS API")
      .setDescription("REST API untuk WhatsApp Gateway SaaS Platform")
      .setVersion("1.0")
      .addCookieAuth("auth_token")
      .addApiKey({ type: "apiKey", in: "header", name: "X-API-Key" }, "api-key")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // ── Graceful Shutdown ─────────────────────────────────────
  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api/v1`);
  if (nodeEnv !== "production") {
    console.log(`📖 Swagger docs: http://localhost:${port}/docs`);
  }
}

bootstrap();
