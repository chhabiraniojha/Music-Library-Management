const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db_connect');

const Artist = sequelize.define('Artist', {
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
  organisationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Organisations',
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

module.exports = Artist;
