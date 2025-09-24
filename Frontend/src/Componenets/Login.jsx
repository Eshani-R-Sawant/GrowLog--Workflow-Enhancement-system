import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signIn } from "../services/Auth";
import '../styles/Auth.css';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setSuccess('');
		if (!email || !password) {
			setError('Please enter both email and password.');
			return;
		}
		setLoading(true);
		try {
			await signIn({ email, password, remember });
			setSuccess('Welcome back! Redirecting...');
			setTimeout(() => {
				window.location.href = '/dashboard';
			}, 800);
		} catch (err) {
			setError(err.message || 'Login failed. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="auth__container">
			<div className="auth__card">
				<div className="auth__brand">
					<div className="auth__logo">GL</div>
					<div>
						<h1 className="auth__title">GrowLog</h1>
						<p className="auth__subtitle">Sign in to continue</p>
					</div>
				</div>

				<form className="auth__form" onSubmit={handleSubmit} noValidate>
					<label className="auth__label">
						Email
						<input
							type="email"
							className="auth__input"
							placeholder="you@company.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
						/>
					</label>

					<label className="auth__label">
						Password
						<div className="auth__input--with-button">
							<input
								type={showPassword ? 'text' : 'password'}
								className="auth__input"
								placeholder="Your secure password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
							/>
							<button
								type="button"
								className="auth__ghost-button"
								onClick={() => setShowPassword((v) => !v)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</label>

					<div className="auth__row">
						<label className="auth__checkbox">
							<input
								type="checkbox"
								checked={remember}
								onChange={(e) => setRemember(e.target.checked)}
							/>
							<span>Remember me</span>
						</label>
					<button
						type="button"
						className="auth__link-button"
						onClick={() => (window.location.href = '/forgot')}
					>
						Forgot password?
					</button>
					</div>

					{error && <div className="auth__alert auth__alert--error">{error}</div>}
					{success && <div className="auth__alert auth__alert--success">{success}</div>}

					<button className="auth__button" disabled={loading}>
						{loading ? 'Signing in…' : 'Sign in'}
					</button>
				</form>

				<p className="auth__footnote">
					New to the platform?{' '}
					<Link className="auth__link" to="/signup">
						Create an account
					</Link>
				</p>
			</div>

			<div className="auth__side">
				<h2>Track work with ease</h2>
				<ul>
					<li>Define tasks with a Kanban-style flow</li>
					<li>Publish your daily focus in one click</li>
					<li>Revisit history to celebrate wins</li>
				</ul>
			</div>
		</div>
	);
}