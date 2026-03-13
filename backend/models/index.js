const { sequelize } = require('../config/database');
const User = require('./User');
const Match = require('./Match');
const Message = require('./Message');

// User <-> Match associations
User.hasMany(Match, { foreignKey: 'userId', as: 'matchesInit' });
User.hasMany(Match, { foreignKey: 'targetUserId', as: 'matchesRecv' });
Match.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Match.belongsTo(User, { foreignKey: 'targetUserId', as: 'targetUser' });

// User <-> Message associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

module.exports = {
  sequelize,
  User,
  Match,
  Message,
};
