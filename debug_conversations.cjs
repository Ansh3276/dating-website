const { Conversation, Match, User } = require('./backend/models');
const { sequelize } = require('./backend/config/database');

async function debugConversations() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const conversations = await Conversation.findAll({
            include: [
                { model: User, as: 'user1', attributes: ['name'] },
                { model: User, as: 'user2', attributes: ['name'] }
            ]
        });

        console.log(`Found ${conversations.length} conversations:`);
        conversations.forEach(c => {
            console.log(`- ID: ${c.id}, Users: ${c.user1.name} & ${c.user2.name}`);
        });

        const matches = await Match.findAll({ where: { status: 'matched' } });
        console.log(`Found ${matches.length} matches with status 'matched'.`);

    } catch (err) {
        console.error('Debug failed:', err);
    } finally {
        await sequelize.close();
    }
}

debugConversations();
