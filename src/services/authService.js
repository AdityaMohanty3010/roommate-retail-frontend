// Use the Vercel environment variable if available, otherwise fall back to local dev.
const API_URL = "https://roommate-retail-backend.onrender.com/api" || 'http://localhost:5000/api';

/**
 * Sign up a new user with email and password.
 */
export async function signup(email, password) {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

/**
 * Login an existing user with email and password...
 * Stores the received token in localStorage.
 */
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');

  localStorage.setItem('token', data.token);
  return data;
}
