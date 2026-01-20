import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class FetchPostThrottler extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return `fetch-posts-${req.ip}`;
  }

  protected getLimit() {
    return Promise.resolve(3);
  }

  protected getTtl() {
    return Promise.resolve(60000);
  }

  protected throwThrottlingException(): Promise<void> {
    throw new ThrottlerException('Too many requests');
  }
}
