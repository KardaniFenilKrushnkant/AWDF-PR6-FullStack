require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');
const Task = require('./models/Task');
const cacheService = require('./cache');

// Practical 10: Event-Driven Architecture with EventEmitter
const taskEvents = require('./events');
require('./listeners'); // Register listeners at startup

const app = express();

app.use(cors());
app.use(express.json());

// High-resolution response time tracking middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const cacheHeader = res.getHeader('X-Cache') || 'N/A';
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${durationMs} ms) [Cache: ${cacheHeader}]`);
  });
  next();
});

// Authentication routes
app.use('/auth', authRoutes);

app.get('/test-auth', (req, res) => {
  res.json({ message: 'Auth route is working!' });
});

// ==========================================================================
// Practical 9: In-Memory Caching & Debug Stats
// ==========================================================================
app.get('/cache/stats', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    ...cacheService.getStats()
  });
});

app.post('/cache/flush', (req, res) => {
  cacheService.flush();
  cacheService.resetStats();
  res.json({ message: 'Cache flushed successfully and counters reset' });
});

// ==========================================================================
// Task Management API Routes with Caching & Asynchronous Events
// ==========================================================================

// 1. GET /tasks - Cached with TTL = 60s
app.get('/tasks', async (req, res, next) => {
  try {
    const cachedTasks = cacheService.get('all_tasks');

    if (cachedTasks) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedTasks);
    }

    const tasks = await Task.find();
    cacheService.set('all_tasks', tasks, 60);

    res.setHeader('X-Cache', 'MISS');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// 2. GET /tasks/:id - Single task caching
app.get('/tasks/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const cacheKey = `task_${req.params.id}`;
    const cachedTask = cacheService.get(cacheKey);

    if (cachedTask) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedTask);
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    cacheService.set(cacheKey, task, 60);

    res.setHeader('X-Cache', 'MISS');
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// 3. POST /tasks - Create task & Asynchronously Emit 'task-created' Event
app.post('/tasks', auth, async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    // Invalidate collection cache
    cacheService.del('all_tasks');

    // Immediate API response logging
    const apiResponseTimestamp = new Date().toISOString();
    console.log(`[API] Response 201 sent to client at ${apiResponseTimestamp}`);

    // Return response immediately to client
    res.status(201).json(task);

    // Practical 10: Asynchronously emit background event (Non-blocking)
    taskEvents.emit('task-created', task);

  } catch (err) {
    next(err);
  }
});

// 4. PUT /tasks/:id - Update task & Invalidate cache
app.put('/tasks/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const allowed = ['title', 'description', 'completed', 'priority'];

    for (const field of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        task.set(field, req.body[field]);
      }
    }

    await task.save();

    cacheService.del('all_tasks');
    cacheService.del(`task_${req.params.id}`);

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// 5. DELETE /tasks/:id - Delete task & Emit 'task-deleted' Event (Supplementary 1)
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    cacheService.del('all_tasks');
    cacheService.del(`task_${req.params.id}`);

    const apiResponseTimestamp = new Date().toISOString();
    console.log(`[API] Delete response sent at ${apiResponseTimestamp}`);

    res.json({ message: 'Task deleted successfully', task });

    // Practical 10 Supplementary 1: Emit task-deleted event
    taskEvents.emit('task-deleted', task);

  } catch (err) {
    next(err);
  }
});

// Supplementary 2: Trigger error event demonstration
app.post('/test-event-error', auth, (req, res) => {
  res.json({ message: 'Triggered error event simulation' });
  taskEvents.emit('task-created', { title: 'Corrupted Task', simulateError: true });
});

// Structured error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid value provided' });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// Database connection & Server initialization
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with EventEmitter & Caching enabled`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (Offline DB mode)`);
    });
  });

module.exports = app;
