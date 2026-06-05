import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/public.decorator';

@Controller({ path: 'health', version: ['1', '2'] })
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
