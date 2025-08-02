const path = require('path');
const fs = require('fs');
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require('../models/taskModel');

const handleCreateTask = async (req, res) => {
    try {
        const files = req.files?.map(f => f.filename) || [];
        if (files.length > 3) return res.status(400).json({ message: 'Max 3 files allowed' });

        const task = {
            ...req.body,
            files,
            assigned_to: req.body.assigned_to || req.user.id
        };
        const newTask = await createTask(task);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Task creation error', error: err.message });
    }
};

const handleGetTasks = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const tasks = await getTasks(req.query, req.user.id, isAdmin);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get tasks', error: err.message });
    }
};

const handleGetTask = async (req, res) => {
    try {
        const task = await getTaskById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error getting task', error: err.message });
    }
};

const handleUpdateTask = async (req, res) => {
    try {
        const files = req.files?.map(f => f.filename) || [];
        if (files.length > 3) return res.status(400).json({ message: 'Max 3 files allowed' });

        const updates = {
            ...req.body,
            files
        };
        const updatedTask = await updateTask(req.params.id, updates);
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update task', error: err.message });
    }
};

const handleDeleteTask = async (req, res) => {
    try {
        await deleteTask(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
};

const handleDownloadFile = (req, res) => {
    const filePath = path.join(__dirname, '../uploads/', req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    res.download(filePath);
};

module.exports = {
    handleCreateTask,
    handleGetTasks,
    handleGetTask,
    handleUpdateTask,
    handleDeleteTask,
    handleDownloadFile
};