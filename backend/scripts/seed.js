const { sequelize } = require('../config/database');
const { User, Match, Message } = require('../models');
const bcrypt = require('bcryptjs');

const DEMO_USERS = [
  {
    name: 'Aisha',
    email: 'aisha@demo.com',
    password: 'password123',
    age: 22,
    location: 'Mumbai, IN',
    bio: 'Coffee lover ☕ | Travel addict ✈️',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    tags: JSON.stringify(['Music', 'Fitness', 'Photography'])
  },
  {
    name: 'Rahul',
    email: 'rahul@demo.com',
    password: 'password123',
    age: 26,
    location: 'Delhi, IN',
    bio: 'Software engineer who loves weekend treks and trying new cafes.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    tags: JSON.stringify(['Tech', 'Hiking', 'Coffee'])
  },
  {
    name: 'Priya',
    email: 'priya@demo.com',
    password: 'password123',
    age: 24,
    location: 'Bangalore, IN',
    bio: 'Startup founder building cool things. Looking for someone driven.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    tags: JSON.stringify(['Startups', 'Reading', 'Yoga'])
  },
  {
    name: 'Kabir',
    email: 'kabir@demo.com',
    password: 'password123',
    age: 28,
    location: 'Pune, IN',
    bio: 'Musician and dog dad. Swipe right if you love golden retrievers.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    tags: JSON.stringify(['Music', 'Dogs', 'Foodie'])
  },
  {
    name: 'Neha',
    email: 'neha@demo.com',
    password: 'password123',
    age: 25,
    location: 'Chennai, IN',
    bio: 'Classical dancer and amateur chef. Let me cook for you!',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    tags: JSON.stringify(['Dance', 'Cooking', 'Art'])
  },
  {
    name: 'Rohan',
    email: 'rohan@demo.com',
    password: 'password123',
    age: 27,
    location: 'Hyderabad, IN',
    bio: 'Film buff and occasional writer. Tell me your top 3 movies.',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
    tags: JSON.stringify(['Cinema', 'Writing', 'Travel'])
  },
  {
    name: 'Sneha',
    email: 'sneha@demo.com',
    password: 'password123',
    age: 23,
    location: 'Kolkata, IN',
    bio: 'Art history student. I love museums, old books, and chai.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    tags: JSON.stringify(['Art', 'History', 'Chai'])
  },
  {
    name: 'Vikram',
    email: 'vikram@demo.com',
    password: 'password123',
    age: 29,
    location: 'Jaipur, IN',
    bio: 'Photographer capturing the essence of the city. Let\'s go on a photo walk.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    tags: JSON.stringify(['Photography', 'Explore', 'Nature'])
  },
  {
    name: 'Ananya',
    email: 'ananya@demo.com',
    password: 'password123',
    age: 26,
    location: 'Ahmedabad, IN',
    bio: 'Architect who loves minimalist design and strong coffee.',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    tags: JSON.stringify(['Design', 'Architecture', 'Coffee'])
  },
  {
    name: 'Aditya',
    email: 'aditya@demo.com',
    password: 'password123',
    age: 25,
    location: 'Chandigarh, IN',
    bio: 'Fitness coach and sports enthusiast. Gym buddies?',
    photoUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80',
    tags: JSON.stringify(['Fitness', 'Sports', 'Health'])
  },
  {
    name: 'Diya',
    email: 'diya@demo.com',
    password: 'password123',
    age: 24,
    location: 'Lucknow, IN',
    bio: 'Fashion designer with a passion for sustainable clothing.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    tags: JSON.stringify(['Fashion', 'Sustainability', 'Design'])
  },
  {
    name: 'Karan',
    email: 'karan@demo.com',
    password: 'password123',
    age: 28,
    location: 'Goa, IN',
    bio: 'Digital nomad and surfer. Catch me at the beach.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    tags: JSON.stringify(['Surfing', 'Travel', 'Beach'])
  },
  {
    name: 'Meera',
    email: 'meera@demo.com',
    password: 'password123',
    age: 27,
    location: 'Cochin, IN',
    bio: 'Marine biologist. I prefer the ocean over the city.',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80',
    tags: JSON.stringify(['Ocean', 'Science', 'Nature'])
  },
  {
    name: 'Ravi',
    email: 'ravi@demo.com',
    password: 'password123',
    age: 26,
    location: 'Indore, IN',
    bio: 'Food blogger exploring the best street food in town.',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80',
    tags: JSON.stringify(['Foodie', 'Blogging', 'Explore'])
  },
  {
    name: 'Tara',
    email: 'tara@demo.com',
    password: 'password123',
    age: 25,
    location: 'Bhopal, IN',
    bio: 'Yoga instructor and mindfulness coach. Let\'s find some peace.',
    photoUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=800&q=80',
    tags: JSON.stringify(['Yoga', 'Mindfulness', 'Wellness'])
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seed...');
    
    // Force sync will drop all tables and recreate them. 
    // WARNING: This deletes all existing data!
    await sequelize.sync({ force: true });
    console.log('Database synced and cleared.');

    const salt = await bcrypt.genSalt(10);
    
    // Hash passwords before creation
    const usersToCreate = await Promise.all(DEMO_USERS.map(async (u) => {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    }));

    await User.bulkCreate(usersToCreate);
    console.log(`Successfully seeded ${usersToCreate.length} demo users!`);
    
    console.log('\n--- Test Accounts ---');
    console.log('Email: aisha@demo.com | Password: password123');
    console.log('Email: rahul@demo.com | Password: password123');
    console.log('---------------------\n');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

seedDatabase();
