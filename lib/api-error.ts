import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import type { NextApiResponse } from 'next';

type ApiErrorOptions = {
  status?: number;
  code: string;
  userMessage: string;
  developerMessage?: string;
  error?: unknown;
  context?: string;
};

type ApiErrorPayload = {
  success: false;
  error: string;
  message: string;
  code: string;
  requestId: string;
  debug?: string;
};

function getDebugMessage(error: unknown) {
  if (error instanceof Error) {
    return error.stack || error.message;
  }

  try {
    return typeof error === 'string' ? error : JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}

function createErrorPayload(options: ApiErrorOptions): ApiErrorPayload {
  const requestId = randomUUID();
  const payload: ApiErrorPayload = {
    success: false,
    error: options.userMessage,
    message: options.userMessage,
    code: options.code,
    requestId,
  };

  if (process.env.NODE_ENV !== 'production' && options.developerMessage) {
    payload.debug = options.developerMessage;
  }

  const logMessage = options.developerMessage || options.userMessage;
  const log = (options.status ?? 500) >= 500 ? console.error : console.warn;
  log(`[${requestId}] ${options.context || options.code}: ${logMessage}`);

  if (options.error) {
    log(`[${requestId}] cause:`, options.error);
    if (process.env.NODE_ENV !== 'production' && options.error instanceof Error) {
      log(`[${requestId}] stack:`, getDebugMessage(options.error));
    }
  }

  return payload;
}

export function apiErrorResponse(options: ApiErrorOptions) {
  const { status = 500, ...payloadOptions } = options;
  return NextResponse.json(createErrorPayload({ ...payloadOptions, status }), { status });
}

export function sendApiError(res: NextApiResponse, options: ApiErrorOptions) {
  const { status = 500, ...payloadOptions } = options;
  return res.status(status).json(createErrorPayload({ ...payloadOptions, status }));
}
