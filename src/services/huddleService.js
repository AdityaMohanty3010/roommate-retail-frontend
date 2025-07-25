// src/services/huddleService.js
export async function fetchHuddleList(prompt) {
  const token = localStorage.getItem("token");

  const res = await fetch('http://localhost:5000/api/huddle', {
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
