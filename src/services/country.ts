import {
  formatValidationError,
  logger,
  mapPaginatedData,
  validator,
} from '../lib/utils';
import NotFoundError from '../lib/errors/not_found';
import { IPagination } from '../interface';
import { Retry } from '../lib/utils/request';
import { Cache } from '../lib/utils/redis';
import { config } from '../config/config';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../lib/errors';
const cacheCountriesKey: string = 'country_list';

export class CountryService {
  private cache: Cache;
  private retry: Retry;

  constructor(cache: Cache, retry: Retry) {
    this.cache = cache;
    this.retry = retry;
  }

  async getCountries({
    pageSize,
    pageNumber,
  }: {
    pageSize: number;
    pageNumber: number;
  }): Promise<IPagination> {
    let countries: any;

    const { error } = validator.validateGetCountriesDto({
      pageSize,
      pageNumber,
    });
    if (error) {
      throw new BadRequestError(formatValidationError(error).toLocaleString());
    }

    countries = await this.cache.get(cacheCountriesKey);
    countries = JSON.parse(countries);

    if (countries && countries.length > 0) {
      logger.info(`countries data retrieved successfully from cache`);
    } else {
      const { url, headerConfig } = this.getConfig();
      const response = await this.retry.request(url, headerConfig);
      if (response.statusCode === StatusCodes.OK && response.body) {
        countries = response.body;
      }

      if (countries.length < 1) {
        logger.error(`${StatusCodes.NOT_FOUND} - No country found`);
        throw new NotFoundError('No country found.');
      }

      logger.info(
        `countries data retrieved successfully from external service`,
      );
      await this.cache.set(
        cacheCountriesKey,
        countries,
        config.minutes.fiftyFive,
      );
    }

    return mapPaginatedData(countries, pageSize, pageNumber);
  }

  async getCountry(countryCode: string): Promise<any> {
    const cacheCountryKey: string = `${countryCode}_`;

    let country = await this.cache.get(cacheCountryKey);
    if (!country) {
      let countries: any = await this.cache.get(cacheCountriesKey);
      countries = JSON.parse(countries);

      if (!countries) {
        const { url, headerConfig } = this.getConfig();
        const response = await this.retry.request(url, headerConfig);
        if (response.statusCode === StatusCodes.OK && response.body) {
          countries = response.body;
        }

        if (countries && countries.length > 0) {
          await this.cache.set(
            cacheCountriesKey,
            countries,
            config.minutes.fiftyFive,
          );
          logger.info(
            `countries data retrieved successfully from external service`,
          );
        }
      }

      country = countries.filter(
        (country: any) => country['Alpha-2_code'] === countryCode,
      )[0];
      if (country) {
        await this.cache.set(cacheCountryKey, country);
      }
    }

    return country;
  }

  async getCountryDetails({
    countryCode,
    publicHolidaysYear = '2024',
  }: {
    countryCode: string;
    publicHolidaysYear?: string;
  }): Promise<any> {
    const { error } = validator.validateGetCountryDto({
      countryCode,
      publicHolidaysYear,
    });
    if (error) {
      throw new BadRequestError(formatValidationError(error).toLocaleString());
    }
    const cacheCountryKey: string = `${countryCode}_`;

    let country = await this.cache.get(cacheCountryKey);
    country = JSON.parse(country);

    if (!country) {
      country = await this.getCountry(countryCode);
    }

    const countryHolidays = await this.getCountryHolidays(
      countryCode,
      publicHolidaysYear,
    );
    return this.mapCountryData(country, countryHolidays);
  }

  async getCountryHolidays(
    countryCode: string,
    publicHolidaysYear: string = '2024',
  ): Promise<any> {
    const holidaysCacheKey: string = `${countryCode}_holidays`;
    let holidaysData: any = [];

    holidaysData = await this.cache.get(holidaysCacheKey);
    holidaysData = JSON.parse(holidaysData);

    if (!holidaysData) {
      const key: string = 'holiday';
      const queryParams: string = `start_date=${publicHolidaysYear}-01-01&end_date=${publicHolidaysYear}-12-31&country_code=${countryCode}`;

      const { url, headerConfig } = this.getConfig(key, key, queryParams);
      if (this.isHolidayDataExist(countryCode)) {
        const result = await this.retry.request(url, headerConfig);
        if (result.statusCode === StatusCodes.OK && result.body) {
          holidaysData = result.body?.public_holidays?.list;
        }
      }
      if (holidaysData && holidaysData.length > 0) {
        logger.info(
          `country public holidays retrieved successfully from external service`,
        );
        await this.cache.set(
          holidaysCacheKey,
          holidaysData,
          config.minutes.fiftyFive,
        );
      }
    }

    return holidaysData;
  }

  async mapCountryData(
    countryDetails: any,
    countryPublicHolidays: any,
  ): Promise<any> {
    if (!countryDetails && !countryPublicHolidays) {
      logger.info(`${StatusCodes.NOT_FOUND} - Country details not found`);
      throw new NotFoundError('Country details not found.');
    }

    logger.info(`${countryDetails.Country} data retrieved successfully`);
    return {
      name: countryDetails.Country,
      isoCode: countryDetails['Alpha-2_code'],
      publicHolidays: countryPublicHolidays,
    };
  }

  getConfig(
    hostKey: string = 'country',
    urlKey: string = 'country',
    queryParams: string = 'start_date=2024-01-01&end_date=2024-12-31&country_code=GB',
  ): {
    url: string;
    headerConfig: { [key: string]: string };
  } {
    const urlOptions: { [key: string]: string } = {
      country: `${config.api.xRapidApiCountriesUrl}`,
      holiday: `${config.api.xRapidApiHolidaysUrl}?${queryParams}`,
    };

    const hostOptions: { [key: string]: string } = {
      country: `${config.api.xRapidApiCountriesHost}`,
      holiday: `${config.api.xRapidApiHolidaysHost}`,
    };

    const headers: { [key: string]: string } = {
      'X-RapidAPI-Key': config.api.xRapidApiKey,
      'X-RapidAPI-Host': hostOptions[hostKey],
    };

    return {
      url: urlOptions[urlKey],
      headerConfig: headers,
    };
  }

  isHolidayDataExist(countryCode: string): boolean {
    const holidayCountries: { [key: string]: string } = {
      AR: 'Argentina',
      AU: 'Australia',
      AT: 'Austria',
      BE: 'Belgium',
      BR: 'Brasil',
      BG: 'Bulgaria',
      CA: 'Canada',
      CL: 'Chile',
      CN: 'China',
      CO: 'Colombia',
      CZ: 'Czech Republic',
      DK: 'Denmark',
      DE: 'Deutschland',
      ES: 'España',
      FI: 'Finland',
      FR: 'France',
      GR: 'Greece',
      HK: 'Hong-Kong',
      HU: 'Hungary',
      IN: 'India',
      IL: 'Israel',
      IT: 'Italia',
      JP: 'Japan',
      MX: 'México',
      NL: 'Netherlands',
      NZ: 'New Zealand',
      NO: 'Norway',
      PE: 'Perú',
      PL: 'Poland',
      PT: 'Portugal',
      DO: 'República Dominicana',
      RO: 'Romania',
      RU: 'Russia',
      SG: 'Singapore',
      SK: 'Slovakia',
      ZA: 'South Africa',
      KR: 'South Korea',
      SE: 'Sweden',
      TR: 'Turkey',
      US: 'USA',
      UA: 'Ukraine',
      GB: 'United Kingdom & Ireland',
      VE: 'Venezuela',
    };

    return (
      holidayCountries[countryCode] !== null &&
      holidayCountries[countryCode] !== undefined
    );
  }
}

const cache: Cache = new Cache();
const retry: Retry = new Retry();
export const countryService: CountryService = new CountryService(cache, retry);
