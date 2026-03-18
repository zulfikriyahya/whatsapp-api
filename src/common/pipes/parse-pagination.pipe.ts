import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class ParsePaginationPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata) {
    const page = parseInt(value?.page, 10) || 1;
    const limit = Math.min(parseInt(value?.limit, 10) || 10, 100);
    return { ...value, page, limit };
  }
}
