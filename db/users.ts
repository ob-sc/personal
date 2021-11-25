import { DataTypes } from 'sequelize';

// const users = (sequelize: Sequelize) =>
//   sequelize.define<Model<User>>(
//     'User',
//     {
//       id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
//       domain: { type: DataTypes.STRING },
//       username: { type: DataTypes.STRING },
//     },
//     {
//       tableName: 'users',
//   hooks: {
//     beforeCreate: function (post, options) {
//       // Do stuff
//       post.slug = post.title
//         .toLowerCase()
//         .replace(/[^A-Za-z0-9 -]/g, '') // remove invalid chars
//         .replace(/\s+/g, '-') // collapse whitespace and replace by -
//         .replace(/-+/g, '-');
//     },
//   },
// }
// )
// .sync();

// users.associate = (models) => {
//   users.belongsTo(models.foo, { as: 'bar' });
// };

export interface UserAttributes {
  id: string; // jacando id
  domain: string; // e.g. starcar
  username: string; // e.g. ole.bergen
}

const users = {
  id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
  domain: { type: DataTypes.STRING },
  username: { type: DataTypes.STRING },
};

export default users;
