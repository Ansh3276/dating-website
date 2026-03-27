// Script to clear all database tables
const { sequelize } = require('./config/database');

async function clearAllData() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');
    
    // Disable foreign key checks to allow truncation
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const tables = ['Messages', 'Conversations', 'Matches', 'Users'];
    
    for (const table of tables) {
      try {
        await sequelize.query(`TRUNCATE TABLE ${table}`);
        console.log(`✓ Cleared table: ${table}`);
      } catch (err) {
        console.log(`⚠ Table ${table} might not exist: ${err.message}`);
      }
    }
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('\n✅ All data cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
}

clearAllData();
