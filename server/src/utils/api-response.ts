import type { Response } from "express";

export class ApiResponse<T = unknown> {
  public readonly success: boolean;

  constructor(
    public statusCode: number,
    public message: string = "Success",
    public data?: T
  ) {
    this.success = statusCode < 400;
  }

  public send(res: Response): Response {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      ...(this.data !== undefined ? { data: this.data } : {}),
    });
  }

  public static success<T>(
    res: Response,
    message: string = "Success",
    data?: T,
    statusCode: number = 200
  ): Response {
    return new ApiResponse(statusCode, message, data).send(res);
  }

  public static created<T>(
    res: Response,
    message: string = "Created successfully",
    data?: T
  ): Response {
    return new ApiResponse(201, message, data).send(res);
  }
}
