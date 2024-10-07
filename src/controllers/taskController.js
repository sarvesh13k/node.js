// src/controllers/taskController.js

const taskQueue = require('../queue/taskQueue');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Create a rate limiter for user tasks (20 tasks per minute)
const userRateLimiter = new RateLimiterMemory({
  points: 20, // 20 points
  duration: 60, // per minute
});

// Create a rate limiter for task processing (1 task per second)
const taskRateLimiter = new RateLimiterMemory({
  points: 1, // 1 task
  duration: 1, // per second
});

// Process task function
const processTask = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Consume points for both rate limiters
    await Promise.all([
      userRateLimiter.consume(user_id), // Limit 20 tasks per minute
      taskRateLimiter.consume(user_id),  // Limit 1 task per second
    ]);

    // Add task to the queue
    await taskQueue.addToQueue(user_id);

    return res.status(200).json({ message: 'Task queued' });
  } catch (err) {
    if (err instanceof RateLimiterMemory.RateLimiterRes) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { processTask };
