import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CreatePostThrottler extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'random';
    const ip = req.ip;
    return `create-post-${email} - ${ip}`;
  }

  protected getLimit() {
    return Promise.resolve(5);
  }

  protected getTtl() {
    return Promise.resolve(60000);
  }

  protected throwThrottlingException(): Promise<void> {
      throw new ThrottlerException('Too many requests');
    }
}
