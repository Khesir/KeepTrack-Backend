import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CrmGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const secret = req.headers['x-crm-secret'];
    if (!secret || secret !== process.env.CRM_SECRET) {
      throw new UnauthorizedException('Invalid CRM secret.');
    }
    return true;
  }
}
