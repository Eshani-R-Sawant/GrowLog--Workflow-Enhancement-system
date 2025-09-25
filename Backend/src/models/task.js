import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of a string
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in-progress', 'completed'], // Ensures the status can only be one of these values
        default: 'pending'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now // Automatically sets the date to the current date and time
    },
    username: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps : true,
});

const Task = mongoose.model("Task",taskSchema);

export default Task;