import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { sha256 } from "../../common/utils/hash.util";
import { generateApiToken } from "../../common/utils/token-generator.util";
import { validateIpWhitelist } from "../../common/utils/ip-validator.util";
import { AuditAction } from "@prisma/client";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";

@Injectable()
export class ApiKeysService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        keyPreview: true,
        ipWhitelist: true,
        isSandbox: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    userId: string,
    email: string,
    dto: CreateApiKeyDto,
    ip: string,
    ua: string,
  ) {
    if (dto.ipWhitelist) validateIpWhitelist(dto.ipWhitelist);

    const plaintext = generateApiToken();
    const keyHash = sha256(plaintext);
    const keyPreview = plaintext.slice(0, 8);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        name: dto.name,
        keyHash,
        keyPreview,
        ipWhitelist: dto.ipWhitelist ?? "",
        isSandbox: dto.isSandbox ?? false,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.CREATE_API_KEY,
      details: { keyId: apiKey.id, isSandbox: apiKey.isSandbox },
      ip,
      userAgent: ua,
    });

    return {
      id: apiKey.id,
      key: plaintext,
      name: apiKey.name,
      keyPreview,
      isSandbox: apiKey.isSandbox,
      expiresAt: apiKey.expiresAt,
    };
  }

  async remove(
    userId: string,
    email: string,
    id: string,
    ip: string,
    ua: string,
  ) {
    const key = await this.prisma.apiKey.findFirst({ where: { id, userId } });
    if (!key) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await this.prisma.apiKey.delete({ where: { id } });
    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.DELETE_API_KEY,
      details: { keyId: id },
      ip,
      userAgent: ua,
    });
  }
}
