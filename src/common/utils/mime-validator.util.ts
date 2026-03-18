import { BadRequestException } from '@nestjs/common';
import { AllAllowedMimeTypes } from '../constants/mime-types.constant';
import { ErrorCodes } from '../constants/error-codes.constant';

export async function validateMimeType(buffer: Buffer): Promise<string> {
  const { fileTypeFromBuffer } = await import('file-type');
  const type = await fileTypeFromBuffer(buffer);
  if (
    !type ||
    !(AllAllowedMimeTypes as readonly string[]).includes(type.mime)
  ) {
    throw new BadRequestException({ code: ErrorCodes.FILE_TYPE_NOT_ALLOWED });
  }
  return type.mime;
}
