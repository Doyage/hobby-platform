import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if ((exception as any).code === 'ER_DUP_ENTRY') {
      // 에러 메시지에서 중복된 필드 추출
      const message = (exception as any).message;
      const match = message.match(/Duplicate entry '.*' for key '(.*)'/);

      const field = match ? match[1] : 'unknown field';

      return response.status(409).json({
        statusCode: 409,
        message: `Duplicate entry: ${field} already exists.`,
        path: request.url,
      });
    }

    // 기타 에러 처리
    return response.status(500).json({
      statusCode: 500,
      message: exception.message,
      path: request.url,
    });
  }
}
