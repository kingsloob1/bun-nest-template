// throttler-behind-proxy.guard.ts
import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    return String((req.ips && req.ips.length ? req.ips[0] : req.ip) || '0'); // individualize IP extraction to meet your own needs
  }
}
