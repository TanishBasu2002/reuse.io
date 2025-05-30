import { HTTPSTATUS, type HttpStatusCode } from "../../config/http.config";
import type { ErrorCode } from "../enums/error.enum";

export class AppError extends Error {
  public statusCode: HttpStatusCode;
  public errorCode?: ErrorCode;

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCode,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
