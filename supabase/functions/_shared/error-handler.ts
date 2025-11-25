import { corsHeaders } from './security-headers.ts';

export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
    timestamp: string;
  };
}

const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.BAD_REQUEST]: 'Invalid request',
  [ErrorCode.UNAUTHORIZED]: 'Authentication required',
  [ErrorCode.FORBIDDEN]: 'Access denied',
  [ErrorCode.NOT_FOUND]: 'Resource not found',
  [ErrorCode.RATE_LIMIT]: 'Rate limit exceeded',
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCode.INTERNAL_ERROR]: 'Internal server error',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable'
};

const statusCodes: Record<ErrorCode, number> = {
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.RATE_LIMIT]: 429,
  [ErrorCode.VALIDATION_ERROR]: 422,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503
};

export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    message?: string,
    public details?: any
  ) {
    super(message || errorMessages[code]);
    this.name = 'ApiError';
  }
}

export const createErrorResponse = (
  error: ApiError | Error,
  includeDetails = true
): Response => {
  const isApiError = error instanceof ApiError;
  const code = isApiError ? error.code : ErrorCode.INTERNAL_ERROR;
  const status = statusCodes[code];

  const errorResponse: ErrorResponse = {
    error: {
      code,
      message: error.message,
      timestamp: new Date().toISOString()
    }
  };

  if (includeDetails && isApiError && error.details) {
    errorResponse.error.details = error.details;
  }

  // Log error with context
  console.error('[Edge Function Error]', {
    code,
    message: error.message,
    details: isApiError ? error.details : undefined,
    stack: error.stack
  });

  return new Response(
    JSON.stringify(errorResponse),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
};

export const handleEdgeFunctionError = (error: any): Response => {
  if (error instanceof ApiError) {
    return createErrorResponse(error);
  }

  // Network/fetch errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return createErrorResponse(
      new ApiError(ErrorCode.SERVICE_UNAVAILABLE, 'External service unavailable')
    );
  }

  // Generic errors
  return createErrorResponse(
    new ApiError(ErrorCode.INTERNAL_ERROR, 'An unexpected error occurred'),
    false
  );
};

export const withErrorHandling = async <T>(
  fn: () => Promise<T>
): Promise<T | Response> => {
  try {
    return await fn();
  } catch (error) {
    return handleEdgeFunctionError(error);
  }
};
