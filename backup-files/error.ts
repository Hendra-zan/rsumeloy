export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
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
      message: 'Terjadi kesalahan internal server',
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};