import joi, { ValidationResult } from 'joi';
import { IUser } from '../../interface';

class Validator {
  validateCreateUserDto(userDto: IUser): ValidationResult {
    const user = joi.object({
      firstname: joi.string().min(3).required(),
      lastname: joi.string().min(3).required(),
      email: joi.string().email().required(),
      roleId: joi.number().required(),
      password: joi.string().min(8).required(),
      passwordConfirmation: joi.string().valid(joi.ref('password')).required(),
    });

    return user.validate(userDto);
  }

  validateLoginDto(loginDto: IUser): ValidationResult {
    const login = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });

    return login.validate(loginDto);
  }

  validateVerifyUserDto(verifyEmailDto: {
    email: string;
    token: string;
  }): ValidationResult {
    const verifyDto = joi.object({
      email: joi.string().email().required(),
      token: joi.string().required(),
    });

    return verifyDto.validate(verifyEmailDto);
  }

  validateGetCountryDto(getCountryDto: {
    countryCode: string;
    publicHolidaysYear: string;
  }): ValidationResult {
    const countryDto = joi.object({
      countryCode: joi.string().length(2).required(),
      publicHolidaysYear: joi.string().length(4),
    });

    return countryDto.validate(getCountryDto);
  }

  validateGetCountriesDto(getCountriesDto: {
    pageSize: number;
    pageNumber: number;
  }): ValidationResult {
    const countriesDto = joi.object({
      pageSize: joi.number().max(100),
      pageNumber: joi.number().max(100),
    });

    return countriesDto.validate(getCountriesDto);
  }
}

export const validator: Validator = new Validator();
