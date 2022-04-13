import { DataTypes, Model, Optional } from 'sequelize';
import { UserAccess, UserRegion } from '../../types/user';

interface UserAttributes {
  id: number;
  domain: string;
  username: string;
  access: UserAccess | null;
  region: UserRegion | null;
  stations: string | null;
}

export interface DBUser extends UserAttributes {
  createdAt: Date;
  updatedAt: Date;
}

class User
  extends Model<
    UserAttributes,
    Optional<UserAttributes, 'id' | 'access' | 'region' | 'stations'>
  >
  implements UserAttributes
{
  public id!: number;
  public domain!: string;
  public username!: string;
  public access!: UserAccess;
  public region!: UserRegion;
  public stations!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const users = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  access: {
    type: DataTypes.STRING,
    isIn: [['idl', 'sl', 'rl', 'admin']],
  },
  region: {
    type: DataTypes.STRING,
    isIn: [
      ['alle', 'hamburg', 'berlin', 'nord', 'süd', 'ost', 'west', 'mitte'],
    ],
  },
  stations: {
    type: DataTypes.STRING,
  },
};

export default User;
