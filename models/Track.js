const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db_connect');

const Track = sequelize.define('Track', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  artistId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Artists',
      key: 'id',
    },
  },
  albumId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Albums',
      key: 'id',
    },
  },
  hidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

module.exports = Track;
