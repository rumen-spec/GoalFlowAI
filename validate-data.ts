import { storage } from './server/storage';

async function validateData() {
  try {
    // First, check if our test user exists
    const user = await storage.getUserByUsername('testuser');
    console.log('Test user found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User ID:', user.id);
    }

    // Get all goals for our test user
    const goals = user ? await storage.getGoalsByUserId(user.id) : [];
    console.log('Goals in database:', goals.length);
    console.log(JSON.stringify(goals, null, 2));

    // For each goal, get its tasks
    for (const goal of goals) {
      if (!goal.id) continue;
      
      const tasks = await storage.getTasksByGoalId(goal.id);
      console.log(`\nTasks for goal ID ${goal.id} (${goal.title}): ${tasks.length}`);
      console.log(JSON.stringify(tasks, null, 2));
    }
  } catch (error) {
    console.error('Error validating data:', error);
  }
}

validateData();