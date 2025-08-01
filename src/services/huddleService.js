// src/services/huddleService.js

import { API_URL } from './config';  // ✅ Centralized API URL

export async function fetchHuddleList(prompt) {
  const token = localStorage.getItem("token");

  // ✅ Build headers conditionally
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/huddle`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error('Failed to fetch from backend');

  const data = await res.json();

  // ✅ Expecting structure like:
  // { categories: [ { name: 'Produce', items: [{ name: 'Apples', price: 40 }] } ] }
  return data;
}
