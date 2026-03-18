import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthService } from "./health.service";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("Health")
@Controller({ path: "health", version: "1" })
export class HealthController {
  constructor(private svc: HealthService) {}

  @Public()
  @Get()
  check() {
    return this.svc.check();
  }
}
