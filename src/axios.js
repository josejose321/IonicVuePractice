// import axios from 'axios';

// const token = localStorage.getItem('token');
// axios.defaults.baseURL = 'http://localhost:8000'
// axios.defaults.withCredentials = true;

// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


// export default axios;


import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://192.168.0.106:8000', // Change this for production
//   baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// Request Interceptor: Dynamically set Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Unauthorized) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Redirecting to login...');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect user to login page
    }
    return Promise.reject(error);
  }
);

export default api;
