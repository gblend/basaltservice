import { adaptPaginateParams, adaptRequest } from '../lib/utils';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '../types/index';
import { IPagination, IResponse, ITokenUser } from '../interface';
import { AuthService, authService } from '../services/auth';

class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = async (
    req: Request,
    res: Response,
  ): Promise<Response<IResponse>> => {
    const { body, ip, headers } = adaptRequest(req);
    const { accessToken, refreshToken, user } = await this.authService.register(
      body,
      ip,
      headers,
    );

    return res.status(StatusCodes.OK).json({
      message: 'Please check your email for a link to verify your account',
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        user,
      },
    });
  };

  login = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const { body, headers, ip } = adaptRequest(req);
    const { accessToken, refreshToken, verificationMsg, user } =
      await this.authService.login(body, ip, headers);

    return res.json({
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        verificationMsg,
        user,
      },
      message: 'Login successful',
    });
  };

  logout = async (req: Request, res: Response): Promise<any> => {
    const { user }: { user: ITokenUser } = adaptRequest(req);

    await this.authService.logout(user);
    res.status(StatusCodes.NO_CONTENT).json({});
  };

  verifyEmail = async (req: Request, res: Response): Promise<any> => {
    const { body } = adaptRequest(req);

    await this.authService.verifyEmail(body);
    res
      .status(StatusCodes.OK)
      .json({ message: 'Account successfully verified' });
  };

  getAllUsers = async (
    req: Request,
    res: Response,
  ): Promise<Response<IResponse>> => {
    const {
      queryParams: { pageSize, pageNumber },
    } = adaptRequest(req);

    const { result, total, pages, previous, next }: IPagination =
      await this.authService.getUsers(
        adaptPaginateParams(pageSize, pageNumber),
      );
    return res.status(StatusCodes.OK).json({
      message: 'Users fetched successfully',
      data: { users: result, pagination: { total, pages, previous, next } },
    });
  };

  getUser = async (
    req: Request,
    res: Response,
  ): Promise<Response<IResponse>> => {
    const {
      pathParams: { id: userId },
      user: reqUser,
    } = adaptRequest(req);

    const user = await this.authService.findById(reqUser, userId);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'User details fetched successfully', data: { user } });
  };

  getRoles = async (
    req: Request,
    res: Response,
  ): Promise<Response<IResponse>> => {
    const roles = await this.authService.getUserRoles();

    return res.status(StatusCodes.OK).json({
      message: 'Roles fetched successfully',
      data: {
        roles,
      },
    });
  };
}

export const authController: AuthController = new AuthController(authService);
