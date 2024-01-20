import { ITokenUser, IUser } from '../interface';
import { UserService } from './user';
import {
  BadRequestError,
  CustomAPIError,
  UnauthenticatedError,
} from '../lib/errors';
import {
  formatValidationError,
  generateToken,
  sendVerificationEmail,
  useCallback,
  validator,
} from '../lib/utils';
import { config } from '../config/config';
import { pushToQueue } from '../lib/utils/amqplib';
import { TokenService } from './token';
import Role from '../models/Role';

export class AuthService {
  private userService: UserService;
  private tokenService: TokenService;

  constructor(userService: UserService, tokenService: TokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }
  async register(body: IUser, ip: string, headers: any): Promise<any> {
    const { email, firstname, lastname, password, roleId }: IUser = body;
    const { error } = validator.validateCreateUserDto(body);
    if (error) {
      throw new BadRequestError(formatValidationError(error).toLocaleString());
    }

    const isEmailExist = await this.userService.findOne({ where: { email } });
    if (isEmailExist) {
      throw new CustomAPIError('This email address is already in use');
    }

    const verificationToken: string = generateToken();
    const user: any = await this.userService.create({
      email: email!,
      firstname: firstname!,
      lastname: lastname!,
      password: password!,
      roleId: roleId!,
      verificationToken,
    });

    const accessToken: string = await this.userService.createJWT(user);

    // send account verification email via queue
    const queueErrorMsg: string =
      'Unable to queue verify email, please try again';
    const queueName: string = config.amqp.verifyEmailQueue;
    const verificationEmailPayload = {
      name: user.firstname,
      email: user.email,
      verificationToken: user.verificationToken,
    };
    await pushToQueue(queueName, queueErrorMsg, verificationEmailPayload).catch(
      (_: Error) =>
        useCallback(sendVerificationEmail, verificationEmailPayload),
    );
    user.password = undefined;
    user.verificationToken = undefined;

    const tokenInfo = await this.tokenService.saveInfo(user, ip, headers);
    const refreshToken: string = await this.userService.createRefreshJWT(
      user,
      tokenInfo.refreshToken,
    );

    return { accessToken, refreshToken, user };
  }

  async logout(user: ITokenUser): Promise<void> {
    await this.tokenService.destroy({ where: { userId: user.id } });
  }

  async login(
    body: { email: string; password: string },
    ip: string,
    headers: any,
  ): Promise<any> {
    const { email, password } = body;
    let verificationMsg: string = '';

    const { error } = validator.validateLoginDto(body);
    if (error) {
      throw new BadRequestError(formatValidationError(error).toLocaleString());
    }

    const user: any = await this.userService.findOne({
      where: { email },
      include: [{ model: Role, attributes: ['id', 'name'] }],
    });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isMatch: boolean = await this.userService.comparePassword(
      password,
      user,
    );

    if (!isMatch) {
      throw new BadRequestError('Invalid email or password.');
    }

    if (!user.isVerified) {
      verificationMsg =
        'Please verify your email to get full access to your account capabilities.';
    } else verificationMsg = 'Verified';

    const accessToken: string = await this.userService.createJWT(user);
    const tokenInfo = await this.tokenService.saveInfo(user, ip, headers);
    const refreshToken: string = await this.userService.createRefreshJWT(
      user,
      tokenInfo.refreshToken,
    );

    user.password = undefined;
    user.deletedAt = undefined;
    user.verificationToken = undefined;

    return {
      user,
      accessToken,
      refreshToken,
      verificationMsg,
    };
  }

  async verifyEmail({
    email,
    token,
  }: {
    email: string;
    token: string;
  }): Promise<any> {
    const { error } = validator.validateVerifyUserDto({ email, token });
    if (error) {
      throw new BadRequestError(formatValidationError(error).toLocaleString());
    }

    const user = await this.userService.findOne({ where: { email } });
    if (!user) {
      throw new UnauthenticatedError(
        'Account verification failed, account not found',
      );
    }

    if (user.verificationToken !== token) {
      throw new UnauthenticatedError(
        'Account verification failed, invalid token',
      );
    }

    if (user.isVerified) return true;

    user.isVerified = true;
    user.verificationToken = '';
    await user.save();
  }

  async getUsers({
    pageSize,
    pageNumber,
    offset,
  }: {
    pageSize: number;
    pageNumber: number;
    offset: number;
  }): Promise<any> {
    return this.userService.getUsers({ pageSize, pageNumber, offset });
  }

  async findById(user: ITokenUser, userId: number): Promise<any> {
    return this.userService.findById(user, userId);
  }

  async getUserRoles(): Promise<any> {
    return this.userService.getUserRoles();
  }
}

const userService: UserService = new UserService();
const tokenService: TokenService = new TokenService();
export const authService: AuthService = new AuthService(
  userService,
  tokenService,
);
