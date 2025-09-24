// src/services/TaskService.js
class TaskService {
  constructor() {
    this.storageKey = 'workflow_tasks';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({}));
    }
  }

  // Get all tasks for a specific date
  getTasksByDate(date) {
    const allTasks = this.getAllTasks();
    return allTasks[date] || { todo: [], inProgress: [], completed: [] };
  }

  // Get all tasks
  getAllTasks() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    } catch (error) {
      console.error('Error parsing tasks from storage:', error);
      return {};
    }
  }

  // Save tasks for a specific date
  saveTasksForDate(date, tasks) {
    const allTasks = this.getAllTasks();
    allTasks[date] = tasks;
    localStorage.setItem(this.storageKey, JSON.stringify(allTasks));
  }

  // Add a new task
  addTask(date, title, status = 'todo') {
    const tasks = this.getTasksByDate(date);
    const newTask = {
      id: Date.now() + Math.random(),
      title: title.trim(),
      status: status,
      createdAt: new Date().toISOString(),
      date: date
    };
    
    tasks[status].push(newTask);
    this.saveTasksForDate(date, tasks);
    return newTask;
  }

  // Move task between statuses
  moveTask(date, taskId, fromStatus, toStatus) {
    const tasks = this.getTasksByDate(date);
    const taskIndex = tasks[fromStatus].findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return null;
    
    const task = tasks[fromStatus][taskIndex];
    task.status = toStatus;
    task.updatedAt = new Date().toISOString();
    
    // Remove from old status
    tasks[fromStatus].splice(taskIndex, 1);
    // Add to new status
    tasks[toStatus].unshift(task);
    
    this.saveTasksForDate(date, tasks);
    return task;
  }

  // Delete task
  deleteTask(date, taskId, status) {
    const tasks = this.getTasksByDate(date);
    tasks[status] = tasks[status].filter(task => task.id !== taskId);
    this.saveTasksForDate(date, tasks);
  }

  // Get task history for a date range
  getTaskHistory(startDate, endDate) {
    const allTasks = this.getAllTasks();
    const history = [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayTasks = allTasks[dateStr];
      
      if (dayTasks) {
        history.push({
          date: dateStr,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          todo: dayTasks.todo || [],
          inProgress: dayTasks.inProgress || [],
          completed: dayTasks.completed || [],
          totalTasks: (dayTasks.todo?.length || 0) + (dayTasks.inProgress?.length || 0) + (dayTasks.completed?.length || 0),
          completedCount: dayTasks.completed?.length || 0,
          productivity: this.calculateProductivity(dayTasks)
        });
      }
    }
    
    return history;
  }

  // Calculate productivity percentage
  calculateProductivity(tasks) {
    const total = (tasks.todo?.length || 0) + (tasks.inProgress?.length || 0) + (tasks.completed?.length || 0);
    if (total === 0) return 0;
    return Math.round(((tasks.completed?.length || 0) / total) * 100);
  }

  // Get tasks for the last N days
  getRecentTaskHistory(days = 10) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.getTaskHistory(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  }

  // Clear all tasks (for testing)
  clearAllTasks() {
    localStorage.removeItem(this.storageKey);
    this.initializeStorage();
  }
}

// Create singleton instance
const taskService = new TaskService();

export default taskService;
