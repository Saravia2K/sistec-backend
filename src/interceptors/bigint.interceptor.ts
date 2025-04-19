import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.sanitizeBigInt(data)));
  }

  private sanitizeBigInt(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (data instanceof Date) return data.toISOString();

    if (typeof data === 'bigint') {
      return data.toString();
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeBigInt(item));
    }

    if (typeof data === 'object') {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          this.sanitizeBigInt(value),
        ]),
      );
    }

    return data;
  }
}
