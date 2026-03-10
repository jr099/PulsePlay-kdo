export class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', 400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super('NOT_FOUND', 404, message);
  }
}

export class AccessError extends AppError {
  constructor(message: string) {
    super('ACCESS_DENIED', 403, message);
  }
}
