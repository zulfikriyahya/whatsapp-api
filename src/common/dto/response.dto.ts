export class SuccessResponseDto<T = any> {
  status = true;
  data?: T;
  message?: string;
  meta?: any;
}

export class ErrorResponseDto {
  status = false;
  error: string;
  code?: string;
  details?: any;
}
