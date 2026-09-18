export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(
    statusCode: number,
    message: string,
    code: string,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
