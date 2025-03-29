import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGoalSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Goal Routes
  app.get('/api/goals', async (req, res) => {
    try {
      // In a real application, this would use authentication
      // For now, we'll use a mock user ID
      const userId = 1;
      const goals = await storage.getGoalsByUserId(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch goals' });
    }
  });

  app.get('/api/goals/:id', async (req, res) => {
    try {
      const goalId = parseInt(req.params.id);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: 'Invalid goal ID' });
      }

      const goal = await storage.getGoal(goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch goal' });
    }
  });

  app.post('/api/goals', async (req, res) => {
    try {
      // In a real application, this would use authentication
      const userId = 1;

      // Add userId to the request body
      const goalData = { ...req.body, userId };
      
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
      const goalId = parseInt(req.params.goalId);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: 'Invalid goal ID' });
      }

      const tasks = await storage.getTasksByGoalId(goalId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  });

  app.post('/api/goals/:goalId/tasks', async (req, res) => {
    try {
      const goalId = parseInt(req.params.goalId);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: 'Invalid goal ID' });
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
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: 'Invalid task ID' });
      }

      const { completed } = req.body;
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed status must be a boolean' });
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
