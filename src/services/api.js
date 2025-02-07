import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const topicsApi = {
  getAll: () => api.get('/topics'),
  create: (data) => api.post('/topics', data),
  update: (id, data) => api.put(`/topics/${id}`, data),
  delete: (id) => api.delete(`/topics/${id}`),
};

const quizzesApi = {
  getAll: (params) => api.get('/quizzes', { params }),
  getById: (id) => api.get(`/quizzes/${id}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, answers),
  export: (id) => api.post(`/quizzes/${id}/export`, {}, { responseType: 'blob' }),
  getCooldownStatus: (quizId) => api.get(`/quizzes/${quizId}/cooldown`),
};

const adminApi = {
  createQuiz: async (quizData) => {
    return api.post('/admin/quizzes', quizData);
  },
  updateQuiz: async (id, quizData) => {
    return api.put(`/admin/quizzes/${id}`, quizData);
  },
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
};

const leaderboardApi = {
  getGlobalLeaderboard: () => api.get('/leaderboard/global'),
  getQuizLeaderboard: (quizId) => api.get(`/leaderboard/quiz/${quizId}`),
  getTopicLeaderboard: (topicId) => api.get(`/leaderboard/topic/${topicId}`),
  getWeeklyLeaderboard: () => api.get('/leaderboard/weekly')
};

const userApi = {
  getProfile: () => api.get('/user/profile'),
  getStats: () => api.get('/user/profile/stats'),
  getActivity: () => api.get('/user/profile/activity'),
  updateProfile: (data) => api.put('/user/profile', data)
};

export {
  api as default,
  adminApi,
  quizzesApi,
  topicsApi,
  leaderboardApi,
  userApi
}; 