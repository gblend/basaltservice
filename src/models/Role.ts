import { Optional } from 'sequelize';
import { Table, Model, Column, DataType } from 'sequelize-typescript';

interface IRoleAttributes {
  id: number;
  name: string;
}
interface IRoleCreationAttributes extends Optional<IRoleAttributes, 'id'> {}

@Table({ tableName: 'roles' })
export default class Role extends Model<
  IRoleAttributes,
  IRoleCreationAttributes
> {
  @Column({
    allowNull: false,
    type: DataType.STRING,
    comment: 'Role title',
    values: ['user', 'admin'],
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  name!: string;
}
