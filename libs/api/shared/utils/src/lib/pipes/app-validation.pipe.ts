import {
  HttpException,
  HttpStatus,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const error = {};
        for (const e of errors) {
          error[e.property] = e.constraints;
        }
        return new HttpException(
          {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            error,
            message: 'Invalid Input',
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      },
    });
  }
}
