import { Global, Module, forwardRef } from '@nestjs/common';
import { AppLogger } from './AppLogger';
import { HttpResponse } from './HttpResponse';
import { AxiosService } from './service/axios.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from './service/redis.service';
import { JwtStrategy } from './service/jwtStrategy.service';

const providers = [
  HttpResponse,
  AppLogger,
  AxiosService,
  RedisService,
];
@Module({
  imports: [
  ],
  providers: [...providers, JwtStrategy],
  exports: providers,
})
@Global()
export class SharedModule {}
