const { User, Match, Message } = require('../models');
const { Op } = require('sequelize');

async function cleanupAjay() {
  try {
    console.log('--- Starting Cleanup for Ajay ---');

    // 1. Find Ajay
    const ajay = await User.findOne({ where: { name: 'Ajay' } });
    if (!ajay) {
      console.log('User Ajay not found. Skipping.');
      return;
    }
    const ajayId = ajay.id;
    console.log(`Found Ajay with ID: ${ajayId}`);

    // 2. Clear Swipe/Match records
    const deletedMatches = await Match.destroy({
      where: {
        [Op.or]: [
          { userId: ajayId },
          { targetUserId: ajayId }
        ]
      }
    });
    console.log(`Deleted ${deletedMatches} match/swipe records.`);

    // 3. Clear Messages (if table exists)
    try {
      const deletedMessages = await Message.destroy({
        where: {
          [Op.or]: [
            { senderId: ajayId },
            { receiverId: ajayId }
          ]
        }
      });
      console.log(`Deleted ${deletedMessages} message records.`);
    } catch (msgErr) {
      console.log('Message table cleanup skipped (might not exist or different schema).');
    }

    // 4. Reset Profile Photo
    ajay.photoUrl = null;
    await ajay.save();
    console.log('Ajay profile photo reset to NULL.');

    console.log('--- Cleanup for Ajay completed successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanupAjay();
