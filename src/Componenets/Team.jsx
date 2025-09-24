import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import '../styles/Team.css';

// Mock team data
const teamData = {
	manager: {
		id: 'manager-1',
		name: 'Sarah Johnson',
		role: 'Team Lead',
		avatar: null,
		tasks: {
			todo: [
				{ id: 1, title: 'Review Q4 reports' },
				{ id: 2, title: 'Plan team retreat' }
			],
			completed: [
				{ id: 3, title: 'Budget approval' },
				{ id: 4, title: 'Hiring decisions' }
			]
		}
	},
	members: [
		{
			id: 'user-1',
			name: 'You',
			role: 'Developer',
			avatar: null,
			tasks: {
				todo: [
					{ id: 5, title: 'Fix login bug' },
					{ id: 6, title: 'Update documentation' }
				],
				completed: [
					{ id: 7, title: 'Code review' },
					{ id: 8, title: 'Unit tests' }
				]
			}
		},
		{
			id: 'user-2',
			name: 'Alex Chen',
			role: 'Designer',
			avatar: null,
			tasks: {
				todo: [
					{ id: 9, title: 'UI mockups' },
					{ id: 10, title: 'User research' }
				],
				completed: [
					{ id: 11, title: 'Logo design' },
					{ id: 12, title: 'Style guide' }
				]
			}
		},
		{
			id: 'user-3',
			name: 'Maria Garcia',
			role: 'Developer',
			avatar: null,
			tasks: {
				todo: [
					{ id: 13, title: 'API integration' },
					{ id: 14, title: 'Database optimization' }
				],
				completed: [
					{ id: 15, title: 'Backend setup' },
					{ id: 16, title: 'Security audit' }
				]
			}
		},
		{
			id: 'user-4',
			name: 'David Kim',
			role: 'QA Engineer',
			avatar: null,
			tasks: {
				todo: [
					{ id: 17, title: 'Test automation' },
					{ id: 18, title: 'Bug tracking' }
				],
				completed: [
					{ id: 19, title: 'Test cases' },
					{ id: 20, title: 'Performance testing' }
				]
			}
		},
		{
			id: 'user-5',
			name: 'Lisa Wang',
			role: 'Product Manager',
			avatar: null,
			tasks: {
				todo: [
					{ id: 21, title: 'Feature planning' },
					{ id: 22, title: 'Stakeholder meeting' }
				],
				completed: [
					{ id: 23, title: 'User stories' },
					{ id: 24, title: 'Roadmap update' }
				]
			}
		},
		{
			id: 'user-6',
			name: 'Tom Wilson',
			role: 'DevOps',
			avatar: null,
			tasks: {
				todo: [
					{ id: 25, title: 'Server deployment' },
					{ id: 26, title: 'Monitoring setup' }
				],
				completed: [
					{ id: 27, title: 'CI/CD pipeline' },
					{ id: 28, title: 'Infrastructure audit' }
				]
			}
		},
		{
			id: 'user-7',
			name: 'Emma Brown',
			role: 'UX Researcher',
			avatar: null,
			tasks: {
				todo: [
					{ id: 29, title: 'User interviews' },
					{ id: 30, title: 'Usability testing' }
				],
				completed: [
					{ id: 31, title: 'Persona creation' },
					{ id: 32, title: 'Journey mapping' }
				]
			}
		}
	]
};

export default function Team() {
	const [selectedMember, setSelectedMember] = useState(null);
	const [showTaskModal, setShowTaskModal] = useState(false);

	const handleMemberClick = (member) => {
		// Don't allow viewing manager's tasks
		if (member.id === 'manager-1') return;
		
		setSelectedMember(member);
		setShowTaskModal(true);
	};

	const closeTaskModal = () => {
		setShowTaskModal(false);
		setSelectedMember(null);
	};

	return (
		<ProtectedRoute>
		<div className="dash__layout">
			<Sidebar />
			
			<main className="dash__main">
					<header className="team__header">
						<h1>👥 Team Delta</h1>
						<div className="team__info">
							<span className="team__count">{teamData.members.length} members</span>
						</div>
					</header>

					<section className="team__content">
						{/* Manager Section */}
						<div className="team__section">
							<h2 className="team__section-title">Manager</h2>
							<div className="team__manager">
								<div className="team__member-card team__member-card--manager">
									<div className="team__member-avatar team__member-avatar--manager">
										{teamData.manager.avatar ? (
											<img src={teamData.manager.avatar} alt={teamData.manager.name} />
										) : (
											<span>👑</span>
										)}
									</div>
									<div className="team__member-info">
										<h3 className="team__member-name">{teamData.manager.name}</h3>
										<p className="team__member-role">{teamData.manager.role}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Team Members Section */}
						<div className="team__section">
							<h2 className="team__section-title">Team Members</h2>
							<div className="team__members-grid">
								{teamData.members.map((member) => (
									<div 
										key={member.id}
										className="team__member-card team__member-card--clickable"
										onClick={() => handleMemberClick(member)}
									>
										<div className="team__member-avatar">
											{member.avatar ? (
												<img src={member.avatar} alt={member.name} />
											) : (
												<span>👤</span>
											)}
										</div>
										<div className="team__member-info">
											<h3 className="team__member-name">{member.name}</h3>
											<p className="team__member-role">{member.role}</p>
										</div>
										<div className="team__member-stats">
											<span className="team__stat">
												📝 {member.tasks.todo.length} To-Do
											</span>
											<span className="team__stat">
												✅ {member.tasks.completed.length} Done
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				</main>

				{/* Task Modal */}
				{showTaskModal && selectedMember && (
					<div className="team__modal-overlay" onClick={closeTaskModal}>
						<div className="team__modal" onClick={(e) => e.stopPropagation()}>
							<div className="team__modal-header">
								<h2>{selectedMember.name}'s Tasks</h2>
								<button className="team__close-btn" onClick={closeTaskModal}>×</button>
							</div>
							
							<div className="team__modal-content">
								<div className="team__task-column">
									<h3>📝 To-Do ({selectedMember.tasks.todo.length})</h3>
									<ul className="team__task-list">
										{selectedMember.tasks.todo.map((task) => (
											<li key={task.id} className="team__task-item">
												{task.title}
											</li>
										))}
									</ul>
								</div>
								
								<div className="team__task-column">
									<h3>✅ Completed ({selectedMember.tasks.completed.length})</h3>
									<ul className="team__task-list">
										{selectedMember.tasks.completed.map((task) => (
											<li key={task.id} className="team__task-item team__task-item--completed">
												{task.title}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</ProtectedRoute>
	);
}