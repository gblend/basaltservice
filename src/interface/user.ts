interface ITokenUser {
  name?: string;
  role: string;
  id?: number;
  firstname?: string;
  lastname?: string;
}

interface IRefreshTokenUser {
  user?: ITokenUser;
  refreshToken: string;
}

interface IUser {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  role?: string;
  roleId?: number;
  verificationToken?: string;
  isVerified?: boolean | any;
  verified?: Date;
  passwordToken?: string;
  passwordTokenExpirationDate?: Date;
  id?: number;
}

export { IUser, IRefreshTokenUser, ITokenUser };
