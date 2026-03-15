const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId1: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId2: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Conversation;
