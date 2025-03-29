import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGoalSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  // Goal Routes
  app.get('/api/goals', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const userId = req.user.id;
      const goals = await storage.getGoalsByUserId(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch goals' });
    }
  });

  app.get('/api/goals/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const goalId = parseInt(req.params.id);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: 'Invalid goal ID' });
      }

      const goal = await storage.getGoal(goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      
      // Ensure the user can only access their own goals
      if (goal.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch goal' });
    }
  });

  app.post('/api/goals', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Add userId to the request body
      const goalData = { ...req.body, userId: req.user.id };
      
      // Validate the goal data
      const validatedData = insertGoalSchema.parse(goalData);
      
      const newGoal = await storage.createGoal(validatedData);
      res.status(201).json(newGoal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid goal data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create goal' });
    }
  });

  // Task Routes
  app.get('/api/goals/:goalId/tasks', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const goalId = parseInt(req.params.goalId);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: 'Invalid goal ID' });
      }
      
      // First check if the goal belongs to the user
      const goal = await storage.getGoal(goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      
      if (goal.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const tasks = await storage.getTasksByGoalId(goalId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  });

  app.post('/api/goals/:goalId/tasks', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const goalId = parseInt(req.params.goalId);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: 'Invalid goal ID' });
      }
      
      // First check if the goal belongs to the user
      const goal = await storage.getGoal(goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      
      if (goal.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // Add goalId to the request body
      const taskData = { ...req.body, goalId };
      
      // Validate the task data
      const validatedData = insertTaskSchema.parse(taskData);
      
      const newTask = await storage.createTask(validatedData);
      res.status(201).json(newTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid task data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create task' });
    }
  });

  app.patch('/api/tasks/:id/complete', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: 'Invalid task ID' });
      }

      const { completed } = req.body;
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed status must be a boolean' });
      }
      
      // Get the task
      const task = await storage.getTask(taskId);
      if (!task || task.goalId === null) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      // Get the goal to check ownership
      // We already checked task.goalId is not null above
      const goal = await storage.getGoal(task.goalId!);
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      
      // Check if the goal belongs to the user
      if (goal.userId && goal.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const updatedTask = await storage.completeTask(taskId, completed);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update task' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
