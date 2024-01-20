import { Optional } from 'sequelize';
import {
  Table,
  BelongsTo,
  Model,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import User from './User';

export interface ITokenAttributes {
  id?: number;
  refreshToken: string;
  ip?: string;
  userAgent?: string;
  isValid?: boolean;
  userId: number;
}
interface ITokenCreationAttributes extends Optional<ITokenAttributes, 'id'> {}

@Table({ tableName: 'tokens' })
export default class Token extends Model<
  ITokenAttributes,
  ITokenCreationAttributes
> {
  @Column({
    allowNull: false,
    type: DataType.STRING,
    comment: "User's refresh token",
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  refreshToken!: string;

  @Column({
    type: DataType.STRING,
    comment: "User's ip address",
  })
  ip?: string;

  @Column({
    type: DataType.STRING,
    comment: "User's userAgent",
  })
  userAgent?: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    comment: 'Is token valid',
    defaultValue: true,
  })
  isValid!: boolean;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    comment: 'User id',
    validate: {
      isNumeric: true,
    },
  })
  @ForeignKey(() => User)
  userId!: number;

  @BelongsTo(() => User)
  user?: User;
}
