import { NextRequest, NextResponse } from 'next/server';
import { AppError } from './errors';
import { logger } from './monitoring';

type ApiHandler = (req: NextRequest) => Promise<NextResponse | Response>;

export function withErrorHandler(handler: ApiHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const response = await handler(req);
      return response instanceof NextResponse ? response : NextResponse.json(response);
    } catch (error) {
      logger.error('API Error:', {
        path: req.nextUrl.pathname,
        method: req.method,
        error: error instanceof Error ? error.message : error,
      });

      if (error instanceof AppError) {
        const { statusCode, message } = error;
        return NextResponse.json({ error: message }, { status: statusCode });
      }

      // If it's an unknown error, return a 500
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}