export async function signIn({ email, password, remember }) {
	await new Promise(r => setTimeout(r, 600));
    const isDemo = email === 'demo@company.com' && password === 'password123';
    if (isDemo || (email && password.length >= 6)) {
        const token = 'mock-token';
        if (remember) {
            localStorage.setItem('authToken', token);
        } else {
            sessionStorage.setItem('authToken', token);
        }
        // Back-compat for earlier check
        if (remember) localStorage.setItem('demoToken', token);
        return { ok: true };
    }
	throw new Error('Invalid credentials.');
}

export async function signUp({ name, email, password }) {
	await new Promise(r => setTimeout(r, 700));
	if (!name || !email || password.length < 8) {
		throw new Error('Please provide valid signup info.');
	}
	return { ok: true };
}

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken') ||
    localStorage.getItem('demoToken')
  );
}

// Optional: also export default for convenience
export default { signIn, signUp, isAuthenticated };

// Mock OTP flow
const otpStore = new Map();

export async function sendOtp(email) {
  await new Promise(r => setTimeout(r, 600));
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    throw new Error('Enter a valid company email.');
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
  // In a real app, send the code via email provider here.
  return { ok: true };
}

export async function verifyOtpAndReset({ email, otp, newPassword }) {
  await new Promise(r => setTimeout(r, 700));
  const entry = otpStore.get(email);
  if (!entry) throw new Error('No OTP requested for this email.');
  if (Date.now() > entry.expiresAt) throw new Error('OTP expired.');
  if (String(otp) !== String(entry.code)) throw new Error('Invalid OTP.');
  if (!newPassword || newPassword.length < 8) throw new Error('Password too short.');
  otpStore.delete(email);
  return { ok: true };
}

// also export in default
export const _otpApi = { sendOtp, verifyOtpAndReset };
