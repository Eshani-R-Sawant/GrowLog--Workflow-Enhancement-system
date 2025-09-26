import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['todo', 'inProgress', 'completed'],
        default: 'todo'
    },
    date: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;

