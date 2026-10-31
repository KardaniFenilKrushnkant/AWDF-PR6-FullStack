
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(process.env.PORT || 3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });

// Create task
app.post('/tasks', async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// Get all tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// Get task by ID
app.get('/tasks/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// Update task
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
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task });
  } catch (err) {
    next(err);
  }
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
