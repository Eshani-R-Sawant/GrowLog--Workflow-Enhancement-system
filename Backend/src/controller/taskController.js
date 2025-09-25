import Task from "../models/task.js";

export const addTask = async(req,res) =>{
    try {
        const { description, status , username } = req.headers;
        if(!description) return res.status(400).json({ message: 'Description is a required field.' });
        const task = new Task({
            description,
            status: status || 'pending',
            date: new Date(),
            username
        })
        const newTask = await task.save()
        res.status(201).json(newTask)
    } catch (error) {
        res.status(400).json({ message: 'Error creating task', error: error.message });
    }
}

export const taskBystatus =  async(req,res) => {
    try {
        const {username}  = req.headers;
        const { status } = req.params;
        // console.log(`${username} ${status}`);
        
        const task = await Task.find({status:status,username:username});
        if(task==null) return res.status(404).json({ message: 'Cannot find a task with that ID' });
        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ message: 'Error finding task', error: err.message });
    }
}
export const taskByDate =  async(req,res) => {
    try {
        const {username}  = req.headers;
        const today = new Date();

        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        // console.log(`${username} ${date}`);
        

        const task = await Task.find({date:{ $gte: startOfDay, $lte: endOfDay },username:username});
        if(task==null) return res.status(404).json({ message: 'Cannot find a task with that ID' });
        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ message: 'Error finding task', error: error.message });
    }
}




// async function getTaskByStatus(req, res, next) {
//     let task;
//     try {
//         // Find a task that has the given ID AND belongs to the logged-in user.
//         const { status } = req.query;
//         task = await Task.findOne({ _id: req.params.id, user: req.user.email });
//         if (task == null) {
//             // Return 404 Not Found if the task doesn't exist OR the user doesn't own it.
//             // This prevents leaking information about the existence of tasks.
//             return res.status(404).json({ message: 'Cannot find a task with that ID' });
//         }
//     } catch (err) {
//         // This could be a malformed ID, for example.
//         return res.status(500).json({ message: 'Error finding task', error: err.message });
//     }

//     // Attach the found task to the response object to be used in the route handler.
//     res.locals.task = task;
//     next();
// }
