import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'regions', timestamps: false })
class Region extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare name: string;
}

export default Region;
