import { BadRequestException } from '@nestjs/common';
import { validateMimeType } from '../../../src/common/utils/mime-validator.util';

jest.mock('file-type', () => ({
  fileTypeFromBuffer: jest.fn(),
}));

describe('mime-validator.util', () => {
  let fileTypeFromBuffer: jest.Mock;

  beforeEach(async () => {
    jest.resetModules();
    const ft = await import('file-type');
    fileTypeFromBuffer = ft.fileTypeFromBuffer as jest.Mock;
    jest.clearAllMocks();
  });

  it('returns mime type for valid image/jpeg', async () => {
    fileTypeFromBuffer.mockResolvedValue({ mime: 'image/jpeg' });
    const result = await validateMimeType(Buffer.from('fake'));
    expect(result).toBe('image/jpeg');
  });

  it('returns mime type for valid application/pdf', async () => {
    fileTypeFromBuffer.mockResolvedValue({ mime: 'application/pdf' });
    const result = await validateMimeType(Buffer.from('fake'));
    expect(result).toBe('application/pdf');
  });

  it('throws BadRequestException for disallowed mime type', async () => {
    fileTypeFromBuffer.mockResolvedValue({ mime: 'application/x-msdownload' });
    await expect(validateMimeType(Buffer.from('fake'))).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws BadRequestException when file type cannot be determined', async () => {
    fileTypeFromBuffer.mockResolvedValue(null);
    await expect(validateMimeType(Buffer.from('fake'))).rejects.toThrow(
      BadRequestException,
    );
  });
});
