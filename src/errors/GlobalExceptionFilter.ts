import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Catches and processes all exceptions thrown within the application.
   * Transforms various types of exceptions into OneRoster-compliant error responses.
   *
   * @param {unknown} exception - The caught exception
   * @param {ArgumentsHost} host - The arguments host containing the HTTP context
   * @returns {void}
   *
   * @throws {Error} If there's a critical error in the error handling process itself
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    // Get the HTTP adapter from the host
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();
    let statusCode: number;
    let responseBody: any;

    // Log the exception with context
    console.log(`Request: ${request}`);
    console.log(`Error: ${exception}`);

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      responseBody = exception.getResponse();
    } else {
      statusCode = 500;
      responseBody = {
        message: 'Some error occurred',
      };
    }
    // Send the response
    httpAdapter.reply(response, responseBody, statusCode);
  }
}
