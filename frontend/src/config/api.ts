// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// API endpoints
export const API_ENDPOINTS = {
  ARTICLES: `${API_URL}/articles`,
  AUTH: `${API_URL}/auth`,
  USERS: `${API_URL}/users`,
  RATINGS: `${API_URL}/ratings`,
  MODERATION: `${API_URL}/moderation`,
  PRACTICES: `${API_URL}/practices`,
  ADMIN: `${API_URL}/admin`
} as const;
