import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUser } from 'src/lib/types';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as TUser;
});
