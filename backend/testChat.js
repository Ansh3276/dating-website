require('dotenv').config();
const { Conversation, Match, User, Message } = require('./models');
const { sequelize } = require('./config/database');
const chatController = require('./controllers/chatController');

async function testController() {
    try {
        await sequelize.authenticate();
        
        // Find a user ID that has a match
        const matches = await Match.findAll({ where: { status: 'matched' } });
        if (matches.length === 0) {
            console.log("No matches found");
            return;
        }
        
        const testUserId = matches[0].userId;
        console.log("Testing with User ID:", testUserId);
        
        const req = { user: { id: testUserId } };
        const res = {
            json: (data) => console.log(JSON.stringify(data, null, 2)),
            status: (s) => ({ json: (err) => console.error("Error", s, err) })
        };
        
        await chatController.getConversations(req, res);
        
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

testController();
