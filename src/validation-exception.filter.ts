
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(ValidationError)
export class ValidationExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(400).json({
      message: 'Validation failed',
      errors: exception.value,
    });
  }
}
