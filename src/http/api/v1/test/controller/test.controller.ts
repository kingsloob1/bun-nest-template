import {
  All,
  Controller,
  Get,
  Next,
  Req,
} from '@nestjs/common';
import { BaseAppController } from 'src/http/api/base/BaseAppController';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TestService } from '../service/test.service';
import type { BunRequest, BunResponse, NextFunction } from '@kingsleyweb/bun-common';
import { Public } from 'src/utils/general';
import {get, set} from 'lodash-es';

@ApiTags('Test Controller')
@Controller('api/v1/test')
@Public()
export class TestController extends BaseAppController {
  constructor(private readonly testService: TestService) {
    super();
  }

  @ApiOperation({ summary: 'Get test endpoint with next' })
  @ApiResponse({ status: 201, description: 'Ok.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Get('/')
  async getTestWIthNextHandler(
    @Req() req: BunRequest,
    @Next() next: NextFunction
  ) {
    set(req, 'custom', 'Happy Guy');
    next();
  }

  @ApiOperation({ summary: 'Get test endpoint main handler' })
  @ApiResponse({ status: 201, description: 'Ok.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Get('/')
  async getTest(
    @Req() req: BunRequest
  ) {
    return {
      route: 'Test with main handler',
      customData: get(req, 'custom', ''),
    }
  }

  @ApiOperation({ summary: 'Test with params' })
  @ApiResponse({ status: 201, description: 'Ok.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Get('/:withParams')
  async nextMethodToBeCalledHere(
    @Req() req: BunRequest
  ) {
    return {
      route: 'Test with params',
      params: req.params,
    }
  }

  @ApiOperation({ summary: 'All method endpoint' })
  @ApiResponse({ status: 201, description: 'Ok.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @All('/all-route-methods')
  async nextMethodToBeCalled(
    @Req() req: BunRequest
  ) {
    return {
      route: 'All method endpoint',
      response: 'All route methods match this',
    }
  }
}
