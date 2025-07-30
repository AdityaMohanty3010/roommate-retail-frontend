import { API_URL } from './config';  // ✅ Use centralized API_URL

/**
 * Sign up a new user with email, password, and username.
 */
export async function signup(email, password, username) {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }), // ✅ include username
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

/**
 * Login an existing user with email and password.
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
