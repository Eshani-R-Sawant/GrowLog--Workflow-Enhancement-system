// src/services/Auth.js
export async function signIn({ email, password, remember }) {
    try {
            const response = await fetch("http://localhost:7001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            if (!data.token) {
                throw new Error('Authentication failed: No token received');
            }

            // Store JWT and user data
            if (remember) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    username: data.username,
                    email: data.email
                }));
                // Back-compat
                localStorage.setItem('authToken', data.token);
            } else {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify({
                    username: data.username,
                    email: data.email
                }));
                sessionStorage.setItem('authToken', data.token);
            }

            return { 
                ok: true, 
                user: { username: data.username, email: data.email },
                token: data.token 
            };
        } else {
            throw new Error(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('SignIn error:', error);
        throw error;
    }
}

export async function signUp({ name, email, password }) {
    try {
            const response = await fetch("http://localhost:7001/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                username: name, 
                email, 
                password 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return { 
                ok: true, 
                message: data.message || "User registered successfully"
            };
        } else {
            throw new Error(data.error || data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('SignUp error:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Unable to connect to server. Please check your internet connection.');
        } else {
            throw error;
        }
    }
}

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken')
  );
}

export function getToken() {
  return localStorage.getItem('token') || 
         sessionStorage.getItem('token') ||
         localStorage.getItem('authToken') ||
         sessionStorage.getItem('authToken');
}

export function getUser() {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('authToken');
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