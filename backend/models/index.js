const { sequelize } = require('../config/database');
const User = require('./User');
const Match = require('./Match');
const Message = require('./Message');
const Conversation = require('./Conversation');

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

// Conversation associations
User.hasMany(Conversation, { foreignKey: 'userId1', as: 'conversationsAsUser1' });
User.hasMany(Conversation, { foreignKey: 'userId2', as: 'conversationsAsUser2' });
Conversation.belongsTo(User, { foreignKey: 'userId1', as: 'user1' });
Conversation.belongsTo(User, { foreignKey: 'userId2', as: 'user2' });

module.exports = {
  sequelize,
  User,
  Match,
  Message,
  Conversation,
};
