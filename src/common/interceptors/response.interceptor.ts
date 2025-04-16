import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
  } from '@nestjs/common';
  import { Observable, catchError, map, throwError } from 'rxjs';
  
  interface Response<T> {
    status: boolean;
    data: T | null;
    message: string;
    statusCode?: number;
  }
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
      const ctx = context.switchToHttp();
      const res = ctx.getResponse();
  
      return next.handle().pipe(
        map((data) => ({
          status: true,
          data,
          message: 'Operación exitosa',
          statusCode: res.statusCode,
        })),
        catchError((error) => {
          const response: Response<null> = {
            status: false,
            data: null,
            message: error.response?.message || error.message || 'Error interno del servidor',
            statusCode: error.status || 500,
          };
  
          return throwError(() => new HttpException(response, response.statusCode || 500));

        })
      );
    }
  }
  