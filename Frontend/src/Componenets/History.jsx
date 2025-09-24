import { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import taskService from '../services/TaskService.js';
import '../styles/History.css';

// Generate last 10 working days (Mon-Fri)
const generateWorkDays = () => {
	const days = [];
	const today = new Date();
	
	for (let i = 0; i < 10; i++) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		
		// Skip weekends
		if (date.getDay() === 0 || date.getDay() === 6) {
			continue;
		}
		
		days.push({
			date: date.toISOString().split('T')[0],
			dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
			dayNumber: date.getDate(),
			month: date.toLocaleDateString('en-US', { month: 'short' })
		});
	}
	
	return days.slice(0, 10);
};

// Mock history data
const generateHistoryData = () => {
	const workDays = generateWorkDays();
	
	return workDays.map((day, index) => {
		const completedCount = Math.floor(Math.random() * 8) + 2; // 2-9 tasks
		const leftoverCount = Math.floor(Math.random() * 4) + 1; // 1-4 tasks
		const productivity = Math.floor((completedCount / (completedCount + leftoverCount)) * 100);
		
		return {
			...day,
			completed: Array.from({ length: completedCount }, (_, i) => ({
				id: `completed-${day.date}-${i}`,
				title: `Task ${i + 1} completed`,
				time: `${Math.floor(Math.random() * 4) + 1}h ago`
			})),
			leftover: Array.from({ length: leftoverCount }, (_, i) => ({
				id: `leftover-${day.date}-${i}`,
				title: `Pending task ${i + 1}`,
				priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
			})),
			productivity,
			motivation: getMotivationMessage(productivity),
			//streak: index < 3 ? '🔥' : index < 6 ? '⚡' : '💪'
		};
	});
};

const getMotivationMessage = (productivity) => {
	if (productivity >= 90) return "🎉 Outstanding! You're a productivity superstar!";
	if (productivity >= 80) return "🚀 Excellent work! You're on fire today!";
	if (productivity >= 70) return "💪 Great job! Keep up the momentum!";
	if (productivity >= 60) return "🌟 Good progress! You're building great habits!";
	if (productivity >= 50) return "✨ Every step counts! You're doing great!";
	return "🌱 Keep going! Progress takes time and you're on the right track!";
};

export default function History() {
	const [selectedDay, setSelectedDay] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const [historyData, setHistoryData] = useState([]);
	const [loading, setLoading] = useState(true);
	
	// Reminders - Simple sticky notes with no impact on tasks
	const [reminders, setReminders] = useState([]);
	const [newReminder, setNewReminder] = useState('');
	
	
	// Load task history from backend
	useEffect(() => {
		loadTaskHistory();
	}, []);

	function loadTaskHistory() {
		setLoading(true);
		try {
			const recentHistory = taskService.getRecentTaskHistory(10);
			setHistoryData(recentHistory);
		} catch (error) {
			console.error('Error loading task history:', error);
			// Fallback to mock data if backend fails
			setHistoryData(generateHistoryData());
		} finally {
			setLoading(false);
		}
	}
	
	const totalCompleted = historyData.reduce((sum, day) => sum + day.completedCount, 0);
	const totalLeftover = historyData.reduce((sum, day) => sum + (day.todo?.length || 0) + (day.inProgress?.length || 0), 0);
	const avgProductivity = historyData.length > 0 ? Math.round(historyData.reduce((sum, day) => sum + day.productivity, 0) / historyData.length) : 0;

	const handleDayClick = (day) => {
		setSelectedDay(day);
		setShowDetails(true);
	};

	const closeDetails = () => {
		setShowDetails(false);
		setSelectedDay(null);
	};

	// Reminder functions - Simple add and delete
	const addReminder = () => {
		if (newReminder.trim()) {
			setReminders([...reminders, {
				id: Date.now(),
				text: newReminder.trim()
			}]);
			setNewReminder('');
		}
	};

	const deleteReminder = (id) => {
		setReminders(reminders.filter(reminder => reminder.id !== id));
	};


	return (
		<ProtectedRoute>
		<div className="dash__layout">
			<Sidebar />
			
			<main className="dash__main">
					<header className="history__header">
						<h1>📊 Your Work History</h1>
						<p className="history__data-source">📡 Data from backend - Last 10 days</p>
						{loading ? (
							<div className="history__loading">Loading your task history...</div>
						) : (
							<div className="history__stats">
								<div className="history__stat">
									<span className="history__stat-number">{totalCompleted}</span>
									<span className="history__stat-label">Tasks Completed</span>
								</div>
								<div className="history__stat">
									<span className="history__stat-number">{avgProductivity}%</span>
									<span className="history__stat-label">Avg Productivity</span>
								</div>
								<div className="history__stat">
									<span className="history__stat-number">{totalLeftover}</span>
									<span className="history__stat-label">Pending Tasks</span>
								</div>
							</div>
						)}
					</header>

					<section className="history__content">
						{/* Motivational Banner */}
						<div className="history__motivation">
							<h2>🌟 Your Progress Journey</h2>
							<p>You've completed <strong>{totalCompleted} tasks</strong> in the last 10 days! 
							That's an average of <strong>{Math.round(totalCompleted / 10)} tasks per day</strong>. 
							Keep up the amazing work! 🚀</p>
						</div>

						{/* History Grid */}
						<div className="history__section">
							<h2 className="history__section-title">📅 Daily Work History</h2>
							{loading ? (
								<div className="history__loading">Loading task history...</div>
							) : historyData.length === 0 ? (
								<div className="history__empty">
									<p>No task history found. Start adding tasks in the Dashboard to see your progress here!</p>
								</div>
							) : (
								<div className="history__grid">
									{historyData.map((day, index) => (
										<div 
											key={day.date}
											className="history__day-card"
											onClick={() => handleDayClick(day)}
										>
											<div className="history__day-header">
												<div className="history__day-date">
													<span className="history__day-name">{day.dayName}</span>
													<span className="history__day-number">{day.dayNumber}</span>
													<span className="history__day-month">{day.month}</span>
												</div>
												<div className="history__day-streak">
													{day.completedCount > 0 ? '🔥' : '📝'}
												</div>
											</div>
											
											<div className="history__day-stats">
												<div className="history__day-stat history__day-stat--completed">
													<span className="history__stat-icon">✅</span>
													<span className="history__stat-count">{day.completedCount}</span>
													<span className="history__stat-label">Done</span>
												</div>
												<div className="history__day-stat history__day-stat--leftover">
													<span className="history__stat-icon">📝</span>
													<span className="history__stat-count">{(day.todo?.length || 0) + (day.inProgress?.length || 0)}</span>
													<span className="history__stat-label">Pending</span>
												</div>
											</div>
											
											<div className="history__productivity">
												<div className="history__productivity-bar">
													<div 
														className="history__productivity-fill"
														style={{ width: `${day.productivity}%` }}
													></div>
												</div>
												<span className="history__productivity-text">{day.productivity}% productive</span>
											</div>
											
											<div className="history__day-motivation">
												{getMotivationMessage(day.productivity)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Simple Reminder Section */}
						<div className="history__section history__section--reminders">
							<h2 className="history__section-title">📝 Personal Reminders</h2>
							<p className="history__section-subtitle">Quick notes for yourself - completely separate from your work tasks</p>
							
							<div className="history__reminders">
								<div className="history__reminder-input">
									<input
										type="text"
										placeholder="Add a reminder..."
										value={newReminder}
										onChange={(e) => setNewReminder(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && addReminder()}
									/>
									<button onClick={addReminder} className="history__add-btn">+</button>
								</div>
								
								<div className="history__reminder-list">
									{reminders.map((reminder) => (
										<div 
											key={reminder.id}
											className="history__reminder-item"
											onClick={() => deleteReminder(reminder.id)}
										>
											<span className="history__reminder-text">{reminder.text}</span>
											<span className="history__reminder-delete">×</span>
										</div>
									))}
									{reminders.length === 0 && (
										<div className="history__reminder-empty">
											No reminders yet. Add one above!
										</div>
									)}
								</div>
							</div>
						</div>

					</section>
				</main>

				{/* Day Details Modal */}
				{showDetails && selectedDay && (
					<div className="history__modal-overlay" onClick={closeDetails}>
						<div className="history__modal" onClick={(e) => e.stopPropagation()}>
							<div className="history__modal-header">
								<h2>{selectedDay.dayName}, {selectedDay.dayNumber} {selectedDay.month}</h2>
								<button className="history__close-btn" onClick={closeDetails}>×</button>
							</div>
							
							<div className="history__modal-content">
								<div className="history__modal-stats">
									<div className="history__modal-stat">
										<span className="history__modal-stat-number">{selectedDay.completedCount}</span>
										<span className="history__modal-stat-label">Completed Tasks</span>
									</div>
									<div className="history__modal-stat">
										<span className="history__modal-stat-number">{(selectedDay.todo?.length || 0) + (selectedDay.inProgress?.length || 0)}</span>
										<span className="history__modal-stat-label">Pending Tasks</span>
									</div>
									<div className="history__modal-stat">
										<span className="history__modal-stat-number">{selectedDay.productivity}%</span>
										<span className="history__modal-stat-label">Productivity</span>
									</div>
								</div>
								
								<div className="history__modal-tasks">
									<div className="history__modal-column">
										<h3>✅ Completed Tasks</h3>
										<ul className="history__task-list">
											{(selectedDay.completed || []).map((task) => (
												<li key={task.id} className="history__task-item history__task-item--completed">
													<span className="history__task-title">{task.title}</span>
												</li>
											))}
											{(selectedDay.completed || []).length === 0 && (
												<li className="history__task-item history__task-item--empty">
													No completed tasks for this day
												</li>
											)}
										</ul>
									</div>
									
									<div className="history__modal-column">
										<h3>📝 Pending Tasks</h3>
										<ul className="history__task-list">
											{(selectedDay.todo || []).map((task) => (
												<li key={task.id} className="history__task-item history__task-item--pending">
													<span className="history__task-title">{task.title}</span>
												</li>
											))}
											{(selectedDay.inProgress || []).map((task) => (
												<li key={task.id} className="history__task-item history__task-item--pending">
													<span className="history__task-title">{task.title}</span>
												</li>
											))}
											{((selectedDay.todo?.length || 0) + (selectedDay.inProgress?.length || 0)) === 0 && (
												<li className="history__task-item history__task-item--empty">
													No pending tasks for this day
												</li>
											)}
										</ul>
									</div>
								</div>
								
								<div className="history__modal-motivation">
									<p>{getMotivationMessage(selectedDay.productivity)}</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</ProtectedRoute>
	);
}