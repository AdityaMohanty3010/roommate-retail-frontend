// src/services/cartservice.js

// Use environment variable for API base URL (Vercel or local)
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 🔐 Reusable auth headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ✅ GET /api/cart – Fetch shared cart items
export const getCart = async () => {
  const res = await fetch(`${API_URL}/cart`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "🛒 Failed to fetch cart");
  }

  return await res.json(); // returns cart array
};

// ✅ POST /api/cart – Add item to shared cart with price
export const addItemToCart = async ({ item, category, quantity, username, price }) => {
  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ item, category, quantity, username, price }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "❌ Failed to add item to cart");
  return data; // { message: "...", cart: [...] }
};

// ✅ DELETE /api/cart/:item – Remove item by name
export const deleteItemFromCart = async (item) => {
  const res = await fetch(`${API_URL}/cart/${item}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "❌ Failed to delete item");
  return data; // { message: "...", cart: [...] }
};

// ✅ NEW: DELETE /api/cart – Clear all cart items
export const clearCart = async () => {
  const res = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "❌ Failed to clear cart");
  return data; // { message: "...", cart: [] }
};
