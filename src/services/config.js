// services/config.js

// Choose API URL from environment variable or fallback to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
