import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { WorkspaceService } from "./workspace.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Workspace")
@UseGuards(JwtAuthGuard)
@Controller({ path: "workspaces", version: "1" })
export class WorkspaceController {
  constructor(private svc: WorkspaceService) {}

  @Get()
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  async create(
    @CurrentUser() u: any,
    @Body() body: { name: string },
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.create(
        u.id,
        u.email,
        body.name,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Post(":id/invite")
  @HttpCode(HttpStatus.OK)
  async invite(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() body: { email: string },
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.invite(
        u.id,
        u.email,
        id,
        body.email,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Delete(":id/members/:memberId")
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Param("memberId") mid: string,
    @Req() req: Request,
  ) {
    await this.svc.removeMember(
      u.id,
      u.email,
      id,
      mid,
      req.ip,
      req.headers["user-agent"],
    );
    return { status: true };
  }
}
