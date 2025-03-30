import { storage } from './server/storage';
import { Goal, Task } from './shared/schema';

async function seedTestData() {
  try {
    console.log('Creating test user...');
    const user = await storage.createUser({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com'
    });
    console.log('Test user created:', user);

    console.log('\nCreating test goal...');
    const goal = await storage.createGoal({
      title: 'Learn piano',
      commitmentLevel: 'medium',
      outputFormat: 'calendar',
      userId: user.id
    });
    console.log('Test goal created:', goal);

    console.log('\nCreating test tasks...');
    const tasks = [
      {
        title: 'Research piano basics',
        description: 'Find online resources for learning piano fundamentals',
        week: 1,
        completed: false,
        goalId: goal.id
      },
      {
        title: 'Practice scales',
        description: 'Spend 30 minutes daily practicing basic scales',
        week: 1,
        completed: false,
        goalId: goal.id
      },
      {
        title: 'Learn first song',
        description: 'Practice a simple song for beginners',
        week: 2,
        completed: false,
        goalId: goal.id
      }
    ];

    // Create tasks
    for (const taskData of tasks) {
      const task = await storage.createTask(taskData);
      console.log('Task created:', task);
    }

    console.log('\nTest data seeded successfully.');
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
}

seedTestData();