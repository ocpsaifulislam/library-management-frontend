export const API_ENDPOINTS = {

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  BOOKS: {
    BASE: '/books',
  },

  MEMBERS: {
    BASE: '/members',
  },

  ISSUES: {
    BASE: '/issues',
  }

} as const;