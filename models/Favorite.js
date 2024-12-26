const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db_connect');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  albumId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Albums',
      key: 'id',
    },
  },
  trackId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Tracks',
      key: 'id',
    },
  },
  artistId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Artists',
      key: 'id',
    },
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
}, {
  timestamps: true,
});

module.exports = Favorite;
