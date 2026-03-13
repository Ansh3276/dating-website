const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabaseIfNotExists = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root123',
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'dating_app_db'}\`;`);
        console.log(`Database '${process.env.DB_NAME || 'dating_app_db'}' ensured.`);
        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
    }
};

module.exports = { createDatabaseIfNotExists };
