import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const message = status >= HttpStatus.INTERNAL_SERVER_ERROR
      ? 'Internal server error'
      : typeof exceptionResponse === 'object'
        && exceptionResponse !== null
        && 'message' in exceptionResponse
        ? exceptionResponse.message
        : exception instanceof Error
          ? exception.message
          : 'Request failed';

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Unhandled API exception', exception);
    }

    response.status(status).json({
      statusCode: status,
      error: status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'Internal Server Error' : 'Request Error',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
