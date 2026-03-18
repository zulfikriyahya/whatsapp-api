import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { WorkflowService } from "./workflow.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { UpdateWorkflowDto } from "./dto/update-workflow.dto";
import { ToggleWorkflowDto } from "./dto/toggle-workflow.dto";

@ApiTags("Workflow")
@UseGuards(JwtAuthGuard)
@Controller({ path: "workflows", version: "1" })
export class WorkflowController {
  constructor(private svc: WorkflowService) {}

  @Get()
  @ApiOperation({ summary: "Daftar workflow" })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: "Buat workflow baru" })
  async create(@CurrentUser() u: any, @Body() dto: CreateWorkflowDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }

  @Put(":id")
  @ApiOperation({ summary: "Update workflow" })
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateWorkflowDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }

  @Post(":id/toggle")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Aktifkan / nonaktifkan workflow" })
  async toggle(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: ToggleWorkflowDto,
  ) {
    return {
      status: true,
      data: await this.svc.toggle(u.id, id, dto.isActive),
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus workflow" })
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}
