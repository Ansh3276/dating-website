const { Message, User, Conversation } = require('../models');
const { Op } = require('sequelize');

const { emitToUser, getIo, isUserOnline } = require('../socketHandler');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    const receiverOnline = isUserOnline(receiverId);
    
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      status: receiverOnline ? 'delivered' : 'sent'
    });

    // Fire socket event to the receiver
    if (receiverOnline) {
      emitToUser(receiverId, 'receive_message', message);
      // Immediately tell sender it was delivered
      emitToUser(senderId, 'message_delivered', message.id);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // 0. ENSURE SYNC: Check for matched records that don't have conversations yet
        const { Match } = require('../models');
        const mutualMatches = await Match.findAll({
            where: {
                [Op.or]: [{ userId: currentUserId }, { targetUserId: currentUserId }],
                status: 'matched'
            }
        });

        for (const m of mutualMatches) {
            const [u1, u2] = [m.userId, m.targetUserId].sort();
            await Conversation.findOrCreate({ where: { userId1: u1, userId2: u2 } });
        }

        // 1. Get all conversations involving the current user
        const conversations = await Conversation.findAll({
            where: {
                [Op.or]: [{ userId1: currentUserId }, { userId2: currentUserId }]
            },
            include: [
                { model: User, as: 'user1', attributes: ['id', 'name', 'photoUrl'] },
                { model: User, as: 'user2', attributes: ['id', 'name', 'photoUrl'] }
            ]
        });

        // 2. Formulate the response with last message logic
        const formattedConversations = await Promise.all(conversations.map(async (conv) => {
            const otherUser = conv.userId1 === currentUserId ? conv.user2 : conv.user1;
            
            // Get last message for this pair
            const lastMsg = await Message.findOne({
                where: {
                    [Op.or]: [
                        { senderId: currentUserId, receiverId: otherUser.id },
                        { senderId: otherUser.id, receiverId: currentUserId },
                    ],
                },
                order: [['createdAt', 'DESC']]
            });

            return {
                id: otherUser.id, // We use the other user's ID as the conversation key for simplicity in messaging
                conversationId: conv.id, // Keep the actual conv ID just in case
                name: otherUser.name,
                avatar: otherUser.photoUrl,
                lastMsg: lastMsg ? lastMsg.text : 'Start chatting...',
                time: lastMsg ? lastMsg.createdAt : conv.createdAt,
                online: false
            };
        }));

        res.json(formattedConversations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
