import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any;

    switch (exception.constructor) {
      case HttpException: // for HttpException
        console.log('exception type http');
        break;

      case TypeORMError:
        console.log('firsexception typeorm error t');
        break;

      case EntityNotFoundError:
      case QueryFailedError: // for TypeOrm error
        status = HttpStatus.BAD_REQUEST;
        message = (exception as TypeORMError).message;
        break;
      case TypeError:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = (exception as TypeORMError).message;
      default:
        try {
          status = (exception as HttpException).getStatus();
          message = (exception as HttpException).getResponse();
        } catch (error) {}
      // default
    }
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: Date.now(),
      path: request.url,
    });
  }
}
