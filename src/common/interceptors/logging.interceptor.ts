import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const requestId: string | undefined = req.headers['x-request-id'];
    const started = Date.now();

    this.logger.log(`--> ${method} ${url} requestId=${requestId ?? '-'}`);

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - started;
        this.logger.log(`<-- ${method} ${url} ${ms}ms requestId=${requestId ?? '-'}`);
      }),
      catchError((err) => {
        const ms = Date.now() - started;
        const errorMessage = err?.message ?? String(err);
        this.logger.error(
          `xxx ${method} ${url} ${ms}ms requestId=${requestId ?? '-'} error=${errorMessage}`,
        );
        throw err;
      }),
    );
  }
}
