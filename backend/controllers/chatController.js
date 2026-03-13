const { Message, User } = require('../models');
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

        // Find all unique users the current user has chatted with
        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ senderId: currentUserId }, { receiverId: currentUserId }]
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'photoUrl'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'photoUrl'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        const conversationsMap = new Map();

        messages.forEach(msg => {
            const otherUser = msg.senderId === currentUserId ? msg.receiver : msg.sender;
            if (!conversationsMap.has(otherUser.id)) {
                conversationsMap.set(otherUser.id, {
                    id: otherUser.id,
                    name: otherUser.name,
                    avatar: otherUser.photoUrl,
                    lastMsg: msg.text,
                    time: msg.createdAt,
                    online: false // Static for now
                });
            }
        });

        res.json(Array.from(conversationsMap.values()));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
