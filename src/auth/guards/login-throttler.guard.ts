import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottler extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'unknown';
    const ip = req.ip;
    return `login-${email}-${ip}`;
  }

  protected getLimit(): Promise<number> {
    return Promise.resolve(5);
  }

  protected getTtl(): Promise<number> {
    return Promise.resolve(60000);
  }

  protected throwThrottlerException(): Promise<void> {
    throw new ThrottlerException('Too many attempts, try after sometime');
  }
}
