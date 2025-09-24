import { useState } from 'react';
import { sendOtp, verifyOtpAndReset } from '../services/Auth';
import '../styles/Auth.css';

export default function ForgotPassword() {
	const [step, setStep] = useState('request'); // request | verify
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	async function handleRequest(e) {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);
		try {
			await sendOtp(email.trim());
			setSuccess('OTP sent to your company email.');
			setStep('verify');
		} catch (err) {
			setError(err?.message || 'Failed to send OTP.');
		} finally {
			setLoading(false);
		}
	}

	async function handleVerify(e) {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);
		try {
			await verifyOtpAndReset({ email: email.trim(), otp: otp.trim(), newPassword });
			setSuccess('Password reset successful. You can now sign in.');
		} catch (err) {
			setError(err?.message || 'OTP verification failed.');
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
						<h1 className="auth__title">Forgot password</h1>
						<p className="auth__subtitle">Receive an OTP on company email</p>
					</div>
				</div>

				{step === 'request' && (
					<form className="auth__form" onSubmit={handleRequest} noValidate>
						<label className="auth__label">
							Company email
							<input
								type="email"
								className="auth__input"
								placeholder="you@company.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</label>

						{error && <div className="auth__alert auth__alert--error">{error}</div>}
						{success && <div className="auth__alert auth__alert--success">{success}</div>}

						<button className="auth__button" disabled={loading || !email}>
							{loading ? 'Sending…' : 'Send OTP'}
						</button>
					</form>
				)}

				{step === 'verify' && (
					<form className="auth__form" onSubmit={handleVerify} noValidate>
						<label className="auth__label">
							Enter OTP
							<input
								type="text"
								className="auth__input"
								placeholder="6-digit code"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								required
								minLength={4}
							/>
						</label>

						<label className="auth__label">
							New password
							<div className="auth__input--with-button">
								<input
									type={showPassword ? 'text' : 'password'}
									className="auth__input"
									placeholder="Create a strong password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									required
									minLength={8}
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

						{error && <div className="auth__alert auth__alert--error">{error}</div>}
						{success && <div className="auth__alert auth__alert--success">{success}</div>}

						<button className="auth__button" disabled={loading || !otp || newPassword.length < 8}>
							{loading ? 'Verifying…' : 'Verify & reset'}
						</button>
					</form>
				)}
			</div>
		</div>
	);
}




