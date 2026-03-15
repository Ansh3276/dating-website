require('dotenv').config();
const { Conversation, Match, User } = require('./models');
const { sequelize } = require('./config/database');
const { Op } = require('sequelize');

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');
        
        await sequelize.sync(); // ensure tables are there
        console.log('Tables synced');

        const convs = await Conversation.findAll({
            include: [
                { model: User, as: 'user1', attributes: ['name'] },
                { model: User, as: 'user2', attributes: ['name'] }
            ]
        });
        console.log('Conversations count:', convs.length);
        convs.forEach(c => console.log(c.toJSON()));

        const matches = await Match.findAll({ where: { status: 'matched' } });
        console.log('Matches count:', matches.length);
        
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

checkData();
