
const Task = require('../models/Task');
const Joi = require('joi');

// @desc    Get all tasks for user
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
};

// @desc    Create a task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    priority: Joi.string().valid('High', 'Low'),
    status: Joi.string().valid('Pending', 'Completed'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    user: req.user.id,
  });

  res.status(201).json(task);
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the task user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTask);
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
