import { Router } from "express";
// const Task = require('../models/task.js');
import { addTask , taskBystatus , taskByDate} from "../controller/taskController.js"

const router = Router();

//getting all the tasks with status
router.get("/status/:status",taskBystatus);

//getting all the tasks with date
router.get("/date",taskByDate);

//adding new task
router.post("/",addTask);

//updating task status
// router.patch("/",updateTask);

//deleting task
// router.patch("/",deleteTask);

export default router;