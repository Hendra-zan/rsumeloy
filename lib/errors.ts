// HTTP Status codes as const
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// Base error class
export class AppError extends Error {
  constructor(
    public statusCode: HttpStatus,
    message: string,
    public isOperational = true,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string) {
    super(HTTP_STATUS.BAD_REQUEST, message, true, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Not authenticated') {
    super(HTTP_STATUS.UNAUTHORIZED, message, true, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(HTTP_STATUS.FORBIDDEN, message, true, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(HTTP_STATUS.NOT_FOUND, `${resource} not found`, true, 'NOT_FOUND');
  }
}

// Error handler
export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
        code: error.code,
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  console.error('Unexpected error:', error);
  
  return new Response(
    JSON.stringify({
      success: false,
      message: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
    }),
    {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};