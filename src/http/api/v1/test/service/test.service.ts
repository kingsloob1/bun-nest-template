import { Injectable } from '@nestjs/common';
import { AppLogger } from 'src/shared/AppLogger';

@Injectable()
export class TestService {
  constructor(
    private readonly appLogger: AppLogger,
  ) {}
}
