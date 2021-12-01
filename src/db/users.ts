import { DataTypes, Model, Optional } from 'sequelize';
import { UserRegion, UserStatus } from '../../types/user';

interface UserAttributes {
  id: string;
  domain: string;
  username: string;
  access: UserStatus | null;
  region: UserRegion | null;
  extrastation: string | null;
}

export interface UserTable extends UserAttributes {
  createdAt: Date;
  updatedAt: Date;
}

class User
  extends Model<UserAttributes, Optional<UserAttributes, 'access' | 'region' | 'extrastation'>>
  implements UserAttributes
{
  public id!: string;
  public domain!: string;
  public username!: string;
  public access!: UserStatus;
  public region!: UserRegion;
  public extrastation!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const users = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
    isIn: [['hamburg', 'berlin', 'nord', 'süd', 'ost', 'west', 'mitte']],
  },
  extrastation: {
    type: DataTypes.STRING,
  },
};

export default User;
