import { ResponseStatusCodeConst } from 'src/constant/ResponseStatusCodeConst';
import { BaseAppException } from './BaseAppException';
import { HttpStatus } from '@nestjs/common';

type BaseAppExceptionConstructorParams = ConstructorParameters<
  typeof BaseAppException
>;
export class UnprocessableAppException extends BaseAppException {
  constructor(
    message: BaseAppExceptionConstructorParams[0],
    devMessage: BaseAppExceptionConstructorParams[4] = undefined,
    translateMessage = true,
  ) {
    super(
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      ResponseStatusCodeConst.UNPROCESSABLE_ENTITY,
      translateMessage,
      devMessage,
    );
  }
}
