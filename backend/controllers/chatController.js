const { Message, User, Conversation } = require('../models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      senderId,
      receiverId,
      text,
    });

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
                id: otherUser.id,
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
