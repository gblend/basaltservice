import { Optional } from 'sequelize';
import {
  Table,
  BelongsTo,
  Model,
  Column,
  DataType,
  ForeignKey,
  BeforeCreate,
} from 'sequelize-typescript';
import Role from './Role';
import bcrypt, { hash, genSalt } from 'bcryptjs';
import joi from 'joi';
import { ITokenUser } from '../interface';
import { createJWT } from '../lib/utils';

export interface IUserAttributes {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roleId: number;
  verificationToken: string;
  isVerified?: boolean;
  passwordToken?: string;
  passwordTokenExpirationDate?: Date;
}
interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> {}

@Table({ tableName: 'users', paranoid: true })
export default class User extends Model<
  IUserAttributes,
  IUserCreationAttributes
> {
  @Column({
    allowNull: false,
    type: DataType.STRING,
    comment: "User's firstname",
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  firstname!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    comment: "User's lastname",
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  lastname!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    comment: "User's email address",
    unique: true,
    validate: {
      validateEmail(email: string) {
        const emailValidator: any = joi.object({
          email: joi.string().email().required(),
        });

        emailValidator.validate(email);
      },
    },
  })
  email!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    comment: "User's password",
    validate: {
      notEmpty: true,
    },
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    comment: "User's verification token",
  })
  verificationToken!: string;

  @Column({
    type: DataType.STRING,
    comment: "User's password token",
    validate: {
      notEmpty: true,
    },
  })
  passwordToken!: string;

  @Column({
    type: DataType.DATE,
    comment: "User's password token expiration date",
    validate: {
      isDate: true,
    },
  })
  passwordTokenExpirationDate!: Date;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    comment: "User's verification status",
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    comment: "User's role e.g user, admin",
    validate: {
      isNumeric: true,
    },
  })
  @ForeignKey(() => Role)
  roleId!: number;

  @BelongsTo(() => Role)
  role?: Role;

  @BeforeCreate
  static async hashPassword(user: User): Promise<void> {
    const salt: string = await genSalt(12);
    user.password = await hash(user.password, salt);
  }

  static async comparePassword(
    enteredPassword: string,
    user: User,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, user.password);
  }

  static async createRefreshJWT(
    user: ITokenUser,
    refreshToken: string,
  ): Promise<string> {
    const userPayload: { name: string; id: number; role: string } = {
      name: `${user.firstname} ${user.lastname}`,
      id: user.id!,
      role: user.role,
    };
    return createJWT({ user: userPayload, refreshToken });
  }

  static async createJWT(user: User): Promise<string> {
    const payload: { name: string; id: number; role: string } = {
      name: `${user.firstname} ${user.lastname}`,
      id: user.id,
      role: user.role?.name || '',
    };
    return createJWT(payload);
  }
}
