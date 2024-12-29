const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db_connect');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type:DataTypes.STRING,
    allowNull:false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  category: {
    type: DataTypes.ENUM('Album', 'Artist', 'Track'),
    allowNull:false

  },
  itemId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

module.exports = Favorite;
