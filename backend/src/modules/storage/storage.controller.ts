import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ConfigService } from "@nestjs/config";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime-types";

@ApiTags("Storage")
@UseGuards(JwtAuthGuard)
@Controller({ path: "storage", version: "1" })
export class StorageController {
  constructor(private cfg: ConfigService) {}

  /**
   * GET /storage/uploads/:filename
   * Serve file media yang sebelumnya didownload via
   * POST /messages/:sessionId/messages/:messageId/download
   *
   * Keamanan:
   * - User hanya bisa akses file di folder miliknya sendiri (userId dari JWT)
   * - Path traversal dicegah dengan path.basename()
   */
  @Get("uploads/:filename")
  @ApiOperation({ summary: "Akses file media yang telah didownload" })
  async serveFile(
    @CurrentUser() u: any,
    @Param("filename") filename: string,
    @Res() res: Response,
  ) {
    // Sanitasi: cegah path traversal
    const safeFilename = path.basename(filename);
    const storagePath = this.cfg.get<string>("app.storagePath");
    const filePath = path.join(storagePath, "uploads", u.id, safeFilename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    }

    // Pastikan file berada di dalam folder user
    const resolvedPath = path.resolve(filePath);
    const userDir = path.resolve(path.join(storagePath, "uploads", u.id));
    if (!resolvedPath.startsWith(userDir)) {
      throw new ForbiddenException({ code: ErrorCodes.FORBIDDEN });
    }

    const mimeType = mime.lookup(safeFilename) || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${safeFilename}"`);
    fs.createReadStream(filePath).pipe(res);
  }
}
