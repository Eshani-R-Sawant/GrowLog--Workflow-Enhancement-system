// src/services/TaskService.js
import { getToken } from './Auth.js';

class TaskService {
    constructor() {
        this.baseURL = 'http://localhost:7001/api/tasks';
  }

  // Get authorization headers
  getHeaders() {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get all tasks for a specific date
  async getTasksByDate(date) {
    try {
      const response = await fetch(`${this.baseURL}/date/${date}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : { todo: [], inProgress: [], completed: [] };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { todo: [], inProgress: [], completed: [] };
    }
  }

  // Add a new task
  async addTask(date, title, status = 'todo') {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          status: status,
          date: date
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Move task between statuses
  async moveTask(date, taskId, fromStatus, toStatus) {
    console.log('TaskService moveTask called:', { date, taskId, fromStatus, toStatus });
    try {
      const response = await fetch(`${this.baseURL}/${taskId}/status`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          status: toStatus
        })
      });

      console.log('Move task response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Move task error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Move task response data:', data);
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error moving task:', error);
      throw error;
    }
  }

  // Delete task
  async deleteTask(date, taskId, status) {
    try {
      const response = await fetch(`${this.baseURL}/${taskId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Get task history for a date range
  async getTaskHistory(startDate, endDate) {
    try {
      const response = await fetch(`${this.baseURL}?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        return [];
      }

      // Group tasks by date
      const groupedTasks = {};
      data.data.forEach(task => {
        if (!groupedTasks[task.date]) {
          groupedTasks[task.date] = {
            date: task.date,
            dayName: new Date(task.date).toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: new Date(task.date).getDate(),
            month: new Date(task.date).toLocaleDateString('en-US', { month: 'short' }),
            todo: [],
            inProgress: [],
            completed: []
          };
        }
        groupedTasks[task.date][task.status].push(task);
      });

      // Convert to array and calculate stats
      const history = Object.values(groupedTasks).map(dayTasks => ({
        ...dayTasks,
        totalTasks: (dayTasks.todo?.length || 0) + (dayTasks.inProgress?.length || 0) + (dayTasks.completed?.length || 0),
        completedCount: dayTasks.completed?.length || 0,
        productivity: this.calculateProductivity(dayTasks)
      }));

      return history.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Error fetching task history:', error);
      return [];
    }
  }

  // Calculate productivity percentage
  calculateProductivity(tasks) {
    const total = (tasks.todo?.length || 0) + (tasks.inProgress?.length || 0) + (tasks.completed?.length || 0);
    if (total === 0) return 0;
    return Math.round(((tasks.completed?.length || 0) / total) * 100);
  }

  // Get tasks for the last N days
  async getRecentTaskHistory(days = 10) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return await this.getTaskHistory(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  }

  // Get all user tasks (with pagination)
  async getAllUserTasks(page = 1, limit = 50) {
    try {
      const response = await fetch(`${this.baseURL}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data : { data: [], pagination: { current: 1, pages: 0, total: 0 } };
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      return { data: [], pagination: { current: 1, pages: 0, total: 0 } };
    }
  }

  // Clear old localStorage data
  clearOldData() {
    try {
      localStorage.removeItem('workflow_tasks');
      console.log('Old localStorage data cleared');
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }
}

// Create singleton instance
const taskService = new TaskService();

export default taskService;