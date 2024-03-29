// jwt.strategy.ts
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BunRequest } from '@kingsleyweb/bun-common';
import appConfiguration from '~/config/envs/app.config';
import { type ConfigType } from '@nestjs/config';
import { In } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(appConfiguration.KEY)
    protected appConfig: ConfigType<typeof appConfiguration>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, jwtPayload: any) {
    const user = undefined;

    if (!user) {
      return null;
    }

    // const stores = await this.userService.getStoreIdFromWhoAmI(user.whoAmI);
    // check that atleast one of the stores subscriber's  storeSubscriptionStatus is active
    // if not, return null
    // const subscriber = await this.subscriberService.find({
    //   where: {
    //     store_id: In(stores),
    //     storeSubscriptionStatus: StoreSubscriptionStatus.ACTIVE,
    //   },
    // });

    // if (subscriber.length === 0) {
    //   return null;
    // }

    return user;
  }
}
