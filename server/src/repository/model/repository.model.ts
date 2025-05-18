import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/model/user.model';

interface RepositoryCreationAttrs {
  owner: string;
  name: string;
  full_name: string;
  url: string;
  stars: number;
  forks: number;
  open_issues: number;
  created_at: number;
  user_id: number;
}

@Table({ tableName: 'repositories', underscored: true, timestamps: true })
export class Repository extends Model<Repository, RepositoryCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stars: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  forks: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  open_issues: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    get() {
      const time = this.getDataValue('created_at');
      return time ? Math.floor(new Date(time).getTime() / 1000) : null;
    },
    set(value: number) {
      this.setDataValue('created_at', new Date(value * 1000));
    },
  })
  created_at: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
