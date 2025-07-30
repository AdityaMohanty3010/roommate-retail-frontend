// src/services/groupservice.js

import { API_URL } from './config';  // ✅ Centralized API URL

// ✅ Create a new group
export const createGroup = async (groupName) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/create-group`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ groupName })
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create group');
  }

  return await res.json();
};

// ✅ Join an existing group
export const joinGroup = async (groupName) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/join-group`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ groupName })
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to join group');
  }

  return await res.json();
};

// ✅ Get info about current user's group
export const getGroupInfo = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/group-info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to fetch group info');
  }

  return await res.json();
};

// ✅ NEW: Get structured shopping list from AI
export const getAISuggestions = async (preferences = [], budget = "medium") => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/huddle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    credentials: "include",
    body: JSON.stringify({ preferences, budget })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch AI suggestions");
  }

  return data.shoppingList; // ✅ Returns list with categories and items
};
