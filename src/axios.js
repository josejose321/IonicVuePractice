import axios from 'axios';

const token = localStorage.getItem('token');
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true;

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


export default axios;