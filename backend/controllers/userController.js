const { User, Match } = require('../models');
const { Op } = require('sequelize');

exports.getDiscoverUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Find users the current user has already interacted with
    const existingInteractions = await Match.findAll({
      where: { userId: currentUserId },
      attributes: ['targetUserId']
    });

    const excludeIds = existingInteractions.map(interaction => interaction.targetUserId);
    excludeIds.push(currentUserId); // Exclude self

    const users = await User.findAll({
      where: {
        id: {
          [Op.notIn]: excludeIds
        }
      },
      attributes: { exclude: ['password'] },
      limit: 20 // Return a batch of users
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMatches = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find matches (where status is 'liked' or 'matched' - simplifying for now)
        // In a real app, 'matched' implies mutual like. Here we return users who liked us or we liked.
        // Let's return mutual matches.
        const myLikes = await Match.findAll({
            where: { userId: currentUserId, status: 'liked' },
            attributes: ['targetUserId']
        });

        const myLikeIds = myLikes.map(m => m.targetUserId);

        const mutualMatches = await Match.findAll({
            where: { 
                userId: { [Op.in]: myLikeIds },
                targetUserId: currentUserId,
                status: 'liked'
            },
            include: [{
                model: User,
                as: 'user', // We are looking at them liking us back
                attributes: ['id', 'name', 'age', 'location', 'bio', 'photoUrl', 'tags']
            }]
        });

        // For demo purposes, if there are no mutual matches, let's just return users we liked
        if (mutualMatches.length === 0 && myLikeIds.length > 0) {
            const likedUsers = await User.findAll({
                where: { id: { [Op.in]: myLikeIds } },
                attributes: ['id', 'name', 'age', 'location', 'bio', 'photoUrl', 'tags']
            });
            return res.json(likedUsers.map(u => ({...u.toJSON(), pct: Math.floor(Math.random() * 20) + 80})));
        }

        const matchUsers = mutualMatches.map(m => m.user);
        res.json(matchUsers.map(u => ({...u.toJSON(), pct: Math.floor(Math.random() * 20) + 80})));

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.actionUser = async (req, res) => {
    const { targetUserId, action } = req.body; // action: 'liked', 'passed'
    const userId = req.user.id;
    try {
        const existing = await Match.findOne({ where: { userId, targetUserId }});
        if (existing) {
            existing.status = action;
            await existing.save();
        } else {
            await Match.create({ userId, targetUserId, status: action });
        }
        res.json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, age, bio, photoUrl, location, tags } = req.body;
        
        user.name = name || user.name;
        user.age = age || user.age;
        user.bio = bio || user.bio;
        user.photoUrl = photoUrl !== undefined ? photoUrl : user.photoUrl;
        user.location = location || user.location;
        user.tags = tags || user.tags;

        await user.save();

        const updatedUser = user.toJSON();
        delete updatedUser.password;
        
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
