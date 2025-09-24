import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/Auth";
import "../styles/Signup.css";

export default function Signup() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const isNameValid = name.trim().length >= 2;
	const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
	const isPasswordValid = password.length >= 8; // matches service requirement
	const isConfirmValid = confirm === password && confirm.length > 0;
	const canSubmit = isNameValid && isEmailValid && isPasswordValid && isConfirmValid && !loading;

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			const res = await signUp({ name: name.trim(), email: email.trim(), password });
			if (res?.ok) {
				setSuccess("Account created! Redirecting to login…");
				setTimeout(() => navigate("/login"), 900);
			} else {
				setError("Signup failed");
			}
		} catch (err) {
			setError(err?.message || "Signup failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-root">
			<form className="auth-card" onSubmit={onSubmit} noValidate>
				<div className="brand">
					<div className="logo">GL</div>
					<div>
						<h2 className="title">Create your GrowLog account</h2>
						<p className="subtitle">Join your team and start tracking</p>
					</div>
				</div>

				{error && <div className="banner error">{error}</div>}
				{success && <div className="banner success">{success}</div>}

				<div className={`field ${name && !isNameValid ? "invalid" : ""}`}>
					<label htmlFor="name">Full name</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Jane Cooper"
						autoComplete="name"
						required
					/>
					<p className="hint">{name && !isNameValid ? "At least 2 characters" : "This will be shown to your team"}</p>
				</div>

				<div className={`field ${email && !isEmailValid ? "invalid" : ""}`}>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@company.com"
						autoComplete="email"
						required
					/>
					<p className="hint">{email && !isEmailValid ? "Enter a valid email" : "Use your work email"}</p>
				</div>

				<div className={`field ${password && !isPasswordValid ? "invalid" : ""}`}>
					<label htmlFor="password">Password</label>
					<div className="password-wrap">
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Create a strong password"
							autoComplete="new-password"
							required
							minLength={8}
						/>
						<button
							type="button"
							className="ghost"
							onClick={() => setShowPassword((s) => !s)}
							aria-label="Toggle password visibility"
						>
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					<p className="hint">{password && !isPasswordValid ? "At least 8 characters" : "Use a unique passphrase"}</p>
				</div>

				<div className={`field ${confirm && !isConfirmValid ? "invalid" : ""}`}>
					<label htmlFor="confirm">Confirm password</label>
					<input
						id="confirm"
						type={showPassword ? "text" : "password"}
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						placeholder="Retype your password"
						autoComplete="new-password"
						required
					/>
					<p className="hint">{confirm && !isConfirmValid ? "Passwords do not match" : "Retype to confirm"}</p>
				</div>

				<button className="primary" type="submit" disabled={!canSubmit}>
					{loading ? "Creating…" : "Create account"}
				</button>

				<p className="switch">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</form>
		</div>
	);
}