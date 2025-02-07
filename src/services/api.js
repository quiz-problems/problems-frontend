import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const topicsApi = {
  getAll: () => api.get('/api/v1/topics'),
  create: (data) => api.post('/api/v1/topics', data),
  update: (id, data) => api.put(`/api/v1/topics/${id}`, data),
  delete: (id) => api.delete(`/api/v1/topics/${id}`),
};

const quizzesApi = {
  getAll: (params) => api.get('/api/v1/quizzes', { params }),
  getById: (id) => api.get(`/api/v1/quizzes/${id}`),
  submit: (id, answers) => api.post(`/api/v1/quizzes/${id}/submit`, answers),
  export: (id) => api.post(`/api/v1/quizzes/${id}/export`, {}, { responseType: 'blob' }),
  getCooldownStatus: (quizId) => api.get(`/api/v1/quizzes/${quizId}/cooldown`),
};

const adminApi = {
  createQuiz: async (quizData) => {
    return api.post('/api/v1/admin/quizzes', quizData);
  },
  updateQuiz: async (id, quizData) => {
    return api.put(`/api/v1/admin/quizzes/${id}`, quizData);
  },
  deleteQuiz: (id) => api.delete(`/api/v1/admin/quizzes/${id}`),
};

const leaderboardApi = {
  getGlobalLeaderboard: () => api.get('/api/v1/leaderboard/global'),
  getQuizLeaderboard: (quizId) => api.get(`/api/v1/leaderboard/quiz/${quizId}`),
  getTopicLeaderboard: (topicId) => api.get(`/api/v1/leaderboard/topic/${topicId}`),
  getWeeklyLeaderboard: () => api.get('/api/v1/leaderboard/weekly')
};

const userApi = {
  getProfile: () => api.get('/api/v1/user/profile'),
  getStats: () => api.get('/api/v1/user/profile/stats'),
  getActivity: () => api.get('/api/v1/user/profile/activity'),
  updateProfile: (data) => api.put('/api/v1/user/profile', data)
};

export {
  api as default,
  adminApi,
  quizzesApi,
  topicsApi,
  leaderboardApi,
  userApi
}; 