/**
 * API Service Layer Foundation
 * Placeholder interface for Phase 0. Will be connected with Axios in Phase 1+.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = {
  get: async (endpoint) => {
    console.warn(`[Phase 0 API Mock GET] ${API_BASE_URL}${endpoint}`);
    return { data: null, message: 'Phase 0 Mock Response' };
  },
  post: async (endpoint, payload) => {
    console.warn(`[Phase 0 API Mock POST] ${API_BASE_URL}${endpoint}`, payload);
    return { data: payload, message: 'Phase 0 Mock Response' };
  },
  put: async (endpoint, payload) => {
    console.warn(`[Phase 0 API Mock PUT] ${API_BASE_URL}${endpoint}`, payload);
    return { data: payload, message: 'Phase 0 Mock Response' };
  },
  delete: async (endpoint) => {
    console.warn(`[Phase 0 API Mock DELETE] ${API_BASE_URL}${endpoint}`);
    return { data: null, message: 'Phase 0 Mock Response' };
  },
};
