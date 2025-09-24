import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import Sidebar from './Sidebar.jsx';
import taskService from '../services/TaskService.js';
import '../styles/Dashboard.css';

function Board() {
	const [todo, setTodo] = useState([]);
	const [inProgress, setInProgress] = useState([]);
	const [completed, setCompleted] = useState([]);
	const [newTitle, setNewTitle] = useState('');
	const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

	// Load tasks for the current date
	useEffect(() => {
		loadTasksForDate(selectedDate);
	}, []);

	function loadTasksForDate(date) {
		const tasks = taskService.getTasksByDate(date);
		setTodo(tasks.todo || []);
		setInProgress(tasks.inProgress || []);
		setCompleted(tasks.completed || []);
	}

	function addTask(e) {
		e.preventDefault();
		if (!newTitle.trim()) return;
		
		const newTask = taskService.addTask(selectedDate, newTitle.trim(), 'todo');
		setTodo([newTask, ...todo]);
		setNewTitle('');
	}

	function moveTask(id, from, to) {
		const lists = { todo, inProgress, completed };
		const setters = { todo: setTodo, inProgress: setInProgress, completed: setCompleted };
		const item = lists[from].find(t => t.id === id);
		if (!item) return;
		
		// Update in backend
		taskService.moveTask(selectedDate, id, from, to);
		
		// Update local state
		setters[from](lists[from].filter(t => t.id !== id));
		setters[to]([item, ...lists[to]]);
	}

	function removeTask(id, from) {
		const setters = { todo: setTodo, inProgress: setInProgress, completed: setCompleted };
		const lists = { todo, inProgress, completed };
		
		// Update in backend
		taskService.deleteTask(selectedDate, id, from);
		
		// Update local state
		setters[from](lists[from].filter(t => t.id !== id));
	}

	// Calculate progress percentage
	const progressPercentage = useMemo(() => {
		const total = todo.length + inProgress.length + completed.length;
		if (total === 0) return 0;
		return Math.round((completed.length / total) * 100);
	}, [todo.length, inProgress.length, completed.length]);

	return (
		<div className="dash__layout">
			<Sidebar />

			<main className="dash__main">
				<header className="dash__header">
					<h1>GrowLog Dashboard</h1>
					
					<div className="dash__progress-road">
						<div className="dash__progress-header">
							<div className="dash__progress-title-section">
								<h3>🎯 Goal Achievement</h3>
								<div className="dash__current-date">
									📅 {new Date(selectedDate).toLocaleDateString('en-US', { 
										weekday: 'long', 
										year: 'numeric', 
										month: 'long', 
										day: 'numeric' 
									})}
								</div>
							</div>
							<div className="dash__circular-progress">
								<div className="dash__circle">
									<svg className="dash__circle-svg" viewBox="0 0 100 100">
										<defs>
											<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
												<stop offset="0%" stopColor="#0f8a3d" />
												<stop offset="100%" stopColor="#16a34a" />
											</linearGradient>
										</defs>
										<circle className="dash__circle-bg" cx="50" cy="50" r="45" />
										<circle 
											className="dash__circle-fill" 
											cx="50" 
											cy="50" 
											r="45" 
											style={{ strokeDasharray: `${2 * Math.PI * 45}`, strokeDashoffset: `${2 * Math.PI * 45 * (1 - progressPercentage / 100)}` }}
										/>
									</svg>
									<div className="dash__circle-text">{progressPercentage}%</div>
								</div>
							</div>
						</div>
						<div className="dash__motivation">
							{progressPercentage === 100 ? (
								<p className="dash__motivation-text">🎉 Amazing! You've completed all your goals! Keep up the fantastic work!</p>
							) : progressPercentage >= 75 ? (
								<p className="dash__motivation-text">🚀 You're almost there! Just a few more tasks to reach your goal!</p>
							) : progressPercentage >= 50 ? (
								<p className="dash__motivation-text">💪 Great progress! You're halfway to your goal!</p>
							) : progressPercentage >= 25 ? (
								<p className="dash__motivation-text">🌟 Good start! Keep building momentum!</p>
							) : (
								<p className="dash__motivation-text">✨ Every journey begins with a single step. You've got this!</p>
							)}
						</div>
					</div>
				</header>

				<section className="dash__board">
					<div className="dash__column">
						<h2>📝 To‑Do</h2>
						<form className="dash__add" onSubmit={addTask}>
							<input
								className="dash__input"
								placeholder="Add a new task"
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
							/>
							<button className="dash__btn dash__btn--green">Add</button>
						</form>
						<ul className="dash__list">
							{todo.map(t => (
								<li key={t.id} className="dash__card">
									<div className="dash__title">{t.title}</div>
									<div className="dash__actions">
										<button className="dash__btn dash__btn--green" onClick={() => moveTask(t.id, 'todo', 'inProgress')}>Start</button>
										<button className="dash__btn" onClick={() => moveTask(t.id, 'todo', 'completed')}>Done</button>
										<button className="dash__btn dash__btn--ghost" onClick={() => removeTask(t.id, 'todo')}>Delete</button>
									</div>
								</li>
							))}
						</ul>
					</div>

					<div className="dash__column">
						<h2>⚡ In‑Progress</h2>
						<ul className="dash__list">
							{inProgress.map(t => (
								<li key={t.id} className="dash__card">
									<div className="dash__title">{t.title}</div>
									<div className="dash__actions">
										<button className="dash__btn dash__btn--green" onClick={() => moveTask(t.id, 'inProgress', 'completed')}>Complete</button>
										<button className="dash__btn" onClick={() => moveTask(t.id, 'inProgress', 'todo')}>Back</button>
										<button className="dash__btn dash__btn--ghost" onClick={() => removeTask(t.id, 'inProgress')}>Delete</button>
									</div>
								</li>
							))}
						</ul>
					</div>

					<div className="dash__column">
						<h2>✅ Completed</h2>
						<ul className="dash__list">
							{completed.map(t => (
								<li key={t.id} className="dash__card">
									<div className="dash__title">{t.title}</div>
									<div className="dash__actions">
										<button className="dash__btn" onClick={() => moveTask(t.id, 'completed', 'inProgress')}>Reopen</button>
										<button className="dash__btn dash__btn--ghost" onClick={() => removeTask(t.id, 'completed')}>Delete</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</section>
			</main>
		</div>
	);
}

export default function Dashboard() {
	return (
		<ProtectedRoute>
			<Board />
		</ProtectedRoute>
	);
}


