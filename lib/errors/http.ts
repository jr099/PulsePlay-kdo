import { NextResponse } from 'next/server';
import { AppError } from './app-error';

export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.status });
  }

  return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error' } }, { status: 500 });
}
