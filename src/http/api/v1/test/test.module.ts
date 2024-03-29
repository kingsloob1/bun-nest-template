import { Module } from '@nestjs/common';
import { TestController } from './controller/test.controller';
import { TestService } from './service/test.service';

const providers = [
  TestService
];

@Module({
  imports: [],
  providers,
  exports: providers,
  controllers: [TestController],
})
export class TestModule {}
