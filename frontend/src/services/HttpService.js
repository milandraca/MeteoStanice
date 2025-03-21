import axios from "axios";
import { PRODUKCIJA } from "../constants";

// Create axios instance with base configuration
export const HttpService = axios.create({
    baseURL: PRODUKCIJA + '/api/v1',
    headers: {
        'Content-Type':'application/json'
    }
});

// Add a request interceptor to include the token in requests if available
HttpService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle authentication errors
HttpService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
