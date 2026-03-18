import { PartialType } from "@nestjs/swagger";
import { CreateDripDto } from "./create-drip.dto";
export class UpdateDripDto extends PartialType(CreateDripDto) {}
