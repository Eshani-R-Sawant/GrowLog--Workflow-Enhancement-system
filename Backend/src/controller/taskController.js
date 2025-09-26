import Task from "../models/task.js";

// Get all tasks for a specific date and user
export const getTasksByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const userId = req.user._id;

        const tasks = await Task.find({ 
            userId: userId, 
            date: date 
        }).sort({ createdAt: -1 });

        // Group tasks by status
        const groupedTasks = {
            todo: tasks.filter(task => task.status === 'todo'),
            inProgress: tasks.filter(task => task.status === 'inProgress'),
            completed: tasks.filter(task => task.status === 'completed')
        };

        res.status(200).json({
            success: true,
            data: groupedTasks
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, status = 'todo', date } = req.body;
        const userId = req.user._id;

        if (!title || !date) {
            return res.status(400).json({
                success: false,
                message: 'Title and date are required'
            });
        }

        const newTask = new Task({
            title: title.trim(),
            status,
            date,
            userId
        });

        const savedTask = await newTask.save();

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: savedTask
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating task',
            error: error.message
        });
    }
};

// Update task status (move between columns)
export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        console.log('Update task status request:', { taskId, status, userId });

        if (!['todo', 'inProgress', 'completed'].includes(status)) {
            console.log('Invalid status:', status);
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be todo, inProgress, or completed'
            });
        }

        console.log('Looking for task with:', { _id: taskId, userId });
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: userId },
            { status: status, updatedAt: new Date() },
            { new: true }
        );

        console.log('Found task:', task);

        if (!task) {
            console.log('Task not found');
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        console.log('Task updated successfully:', task);
        res.status(200).json({
            success: true,
            message: 'Task status updated successfully',
            data: task
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating task',
            error: error.message
        });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user._id;

        const task = await Task.findOneAndDelete({
            _id: taskId,
            userId: userId
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
};

// Get all tasks for a user (across all dates)
export const getAllUserTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 50, page = 1 } = req.query;

        const tasks = await Task.find({ userId: userId })
            .sort({ date: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Task.countDocuments({ userId: userId });

        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total: total
            }
        });
    } catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};
