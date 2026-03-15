const { User, Match, Conversation, sequelize } = require('./backend/models');

async function syncConversations() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Find all users who are 'matched'
        const mutualMatches = await Match.findAll({
            where: { status: 'matched' }
        });

        console.log(`Checking ${mutualMatches.length} match records...`);

        for (const match of mutualMatches) {
            const userId = match.userId;
            const targetUserId = match.targetUserId;
            
            const [u1, u2] = [userId, targetUserId].sort();
            
            const [conv, created] = await Conversation.findOrCreate({
                where: { userId1: u1, userId2: u2 }
            });

            if (created) {
                console.log(`Created conversation for ${u1} and ${u2}`);
            }
        }

        console.log('Sync complete.');
    } catch (err) {
        console.error('Sync failed:', err);
    } finally {
        await sequelize.close();
    }
}

syncConversations();
