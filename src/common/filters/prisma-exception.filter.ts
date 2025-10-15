import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<Prisma.PrismaClientKnownRequestError> {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const requestId: string | undefined = request.headers['x-request-id'];

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Database error';

    switch (exception.code) {
      case 'P2002': // Unique constraint
        status = HttpStatus.CONFLICT;
        message = 'Resource already exists';
        break;
      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
        break;
      default:
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
    }

    this.logger.error(
      `status=${status} method=${request.method} path=${request.url} requestId=${requestId ?? '-'} prismaCode=${exception.code} message=${message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: requestId ?? undefined,
    });
  }
}
