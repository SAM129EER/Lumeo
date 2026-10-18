export class AppError extends Error {
  public readonly isOperational = true;

  constructor(
    public statusCode: number,
    public message: string,
    public code: string = "APP_ERROR",
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace?.(this, this.constructor);
  }
}
