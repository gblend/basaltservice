import { CountryService, countryService } from '../services/country';
import { Request, Response } from '../types/index';
import { IResponse } from '../interface';
import { adaptRequest } from '../lib/utils';
import { StatusCodes } from 'http-status-codes';

class CountryController {
  private readonly countryService: CountryService;

  constructor(countryService: CountryService) {
    this.countryService = countryService;
  }

  getCountries = async (
    req: Request,
    res: Response,
  ): Promise<Response<IResponse>> => {
    const {
      queryParams: { pageSize = 20, pageNumber = 1 },
    } = adaptRequest(req);

    const countriesData: any = await this.countryService.getCountries({
      pageSize,
      pageNumber,
    });
    return res.status(StatusCodes.OK).json({
      message: 'Countries fetched successfully',
      data: { ...countriesData },
    });
  };

  getCountryDetails = async (
    req: Request,
    res: Response,
  ): Promise<Response<IResponse>> => {
    const {
      pathParams: { countryCode },
      queryParams: { publicHolidaysYear },
    } = adaptRequest(req);

    const options: { countryCode: string; publicHolidaysYear?: string } = {
      countryCode: countryCode.toUpperCase(),
    };
    if (publicHolidaysYear) {
      options.publicHolidaysYear = publicHolidaysYear;
    }

    const countryDetails: any =
      await this.countryService.getCountryDetails(options);
    return res.status(StatusCodes.OK).json({
      message: 'Country details fetched successfully',
      data: { ...countryDetails },
    });
  };
}

export const countryController: CountryController = new CountryController(
  countryService,
);
