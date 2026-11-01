require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding');

  // Seed user
  const email = 'fenilpatel@gmail.com';
  let user = await User.findOne({ email });
  if (!user) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({ email, password: hashedPassword });
    console.log('Created user:', email);
  } else {
    console.log('User already exists:', email);
  }

  // Seed sample tasks
  const count = await Task.countDocuments();
  if (count < 5) {
    const sampleTasks = [
      {
        title: 'Implement In-Memory Caching (node-cache)',
        description: 'Cache GET /tasks response with 60s TTL and invalidate on write operations.',
        priority: 'high',
        completed: true
      },
      {
        title: 'Route-Based Code Splitting Optimization',
        description: 'Deconstruct bundle into lazy-loaded chunks using React.lazy and Suspense.',
        priority: 'high',
        completed: true
      },
      {
        title: 'Benchmark API Response Times',
        description: 'Compare cached vs uncached response times using Postman with 3 sample runs.',
        priority: 'medium',
        completed: false
      },
      {
        title: 'Single Task Cache Invalidation',
        description: 'Implement individual key invalidation for task_:id on PUT and DELETE.',
        priority: 'medium',
        completed: false
      },
      {
        title: 'Expose Cache Hit/Miss Metrics Endpoint',
        description: 'Create /cache/stats endpoint to monitor hit-ratio and memory keys count.',
        priority: 'low',
        completed: false
      }
    ];

    await Task.insertMany(sampleTasks);
    console.log('Seeded sample tasks');
  }

  console.log('Total tasks in DB:', await Task.countDocuments());
  await mongoose.disconnect();
}

seed().catch(console.error);
