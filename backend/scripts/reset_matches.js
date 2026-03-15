const { Match } = require('../models');

async function resetMatches() {
  try {
    console.log('Clearing all matches and swipes...');
    await Match.destroy({ where: {}, truncate: true });
    console.log('Successfully cleared Match table.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to clear matches:', error);
    process.exit(1);
  }
}

resetMatches();
