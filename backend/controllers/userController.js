const { User, Match } = require('../models');
const { Op } = require('sequelize');
const { emitToUser } = require('../socketHandler');

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

    const currentUser = await User.findByPk(currentUserId);
    const { gender, showMe } = currentUser;

    const whereClause = {
      id: {
        [Op.notIn]: excludeIds
      }
    };

    // Apply gender filtering based on "showMe" preference
    if (showMe === 'men') {
      whereClause.gender = 'male';
    } else if (showMe === 'women') {
      whereClause.gender = 'female';
    }
    // If 'everyone', we don't add a gender restriction

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: 20
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMatches = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find mutual matches where status is strictly 'matched'
        const mutualMatches = await Match.findAll({
            where: { 
                userId: currentUserId,
                status: 'matched'
            },
            include: [{
                model: User,
                as: 'targetUser',
                attributes: ['id', 'name', 'age', 'location', 'bio', 'photoUrl', 'tags']
            }]
        });

        const matchUsers = mutualMatches.map(m => m.targetUser);
        res.json(matchUsers.map(u => ({...u.toJSON(), pct: Math.floor(Math.random() * 20) + 80})));

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getPendingLikes = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        // Users I liked but not yet matched
        const pending = await Match.findAll({
            where: { userId: currentUserId, status: 'liked' },
            include: [{
                model: User,
                as: 'targetUser',
                attributes: ['id', 'name', 'age', 'location', 'bio', 'photoUrl', 'tags']
            }]
        });
        res.json(pending.map(p => p.targetUser));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getIncomingLikes = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        // People who liked me but I haven't swiped on them yet
        // OR I haven't liked them back (status would be 'liked' with them as userId)
        const incoming = await Match.findAll({
            where: { targetUserId: currentUserId, status: 'liked' },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'age', 'location', 'bio', 'photoUrl', 'tags']
            }]
        });
        res.json(incoming.map(i => i.user));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.actionUser = async (req, res) => {
    const { targetUserId, action } = req.body; // action: 'liked', 'passed'
    const userId = req.user.id;
    try {
        const existing = await Match.findOne({ where: { userId, targetUserId }});
        if (existing) {
            return res.status(400).json({ message: 'You have already swiped on this user' });
        }
        
        await Match.create({ userId, targetUserId, status: action });

        if (action === 'liked') {
            const targetUser = await User.findByPk(targetUserId, { attributes: ['name', 'photoUrl'] });
            
            // Check for reciprocal like
            const reciprocalLike = await Match.findOne({
                where: { userId: targetUserId, targetUserId: userId, status: 'liked' }
            });

            if (reciprocalLike) {
                 // Both liked each other! Upgrade status to 'matched'
                 reciprocalLike.status = 'matched';
                 await reciprocalLike.save();
                 await Match.update({ status: 'matched' }, { where: { userId, targetUserId } });
                 
                 // Notify BOTH users instantly
                 emitToUser(userId, 'newMatch', { id: targetUserId, name: targetUser.name, photoUrl: targetUser.photoUrl });
                 emitToUser(targetUserId, 'newMatch', { id: userId, name: req.user.name, photoUrl: req.user.photoUrl });
            } else {
                 // Standard notification to target user
                 emitToUser(targetUserId, 'receiveLike', { id: userId, name: req.user.name, photoUrl: req.user.photoUrl });
            }
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

        const { name, age, bio, photoUrl, location, tags, gender, showMe } = req.body;
        
        user.name = name || user.name;
        user.age = age || user.age;
        user.bio = bio || user.bio;
        user.location = location || user.location;
        user.tags = tags || user.tags;
        user.gender = gender || user.gender;
        user.showMe = showMe || user.showMe;

        // Handle File Upload or URL
        if (req.file) {
          // If a file was uploaded via multer, save the local path
          user.photoUrl = `/uploads/${req.file.filename}`;
        } else if (photoUrl !== undefined) {
          user.photoUrl = photoUrl;
        }

        await user.save();

        const updatedUser = user.toJSON();
        delete updatedUser.password;
        
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
