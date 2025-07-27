// src/services/huddleService.js

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function fetchHuddleList(prompt) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/huddle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error('Failed to fetch from backend');

  const data = await res.json();

  // ✅ Expecting structure like:
  // { categories: [ { name: 'Produce', items: [{ name: 'Apples', price: 40 }] } ] }
  return data;
}
