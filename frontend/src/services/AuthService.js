import { HttpService } from "./HttpService";

export const AuthService = {
    async login(email, password) {
        try {
            const response = await HttpService.post('/Autorizacija/token', {
                email,
                password
            });
            
            // Store the token in localStorage
            localStorage.setItem('token', response.data);
            
            // Update the HttpService headers with the token
            HttpService.defaults.headers.common['Authorization'] = 'Bearer ' + response.data;
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    async register(email, password) {
        try {
            // This assumes you have a registration endpoint in your backend
            // If not, you'll need to create one
            const response = await HttpService.post('/Autorizacija/register', {
                email,
                password
            });
            
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    },

    logout() {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        
        // Remove the Authorization header
        delete HttpService.defaults.headers.common['Authorization'];
        
        return true;
    },

    isAuthenticated() {
        // Check if the token exists in localStorage
        return localStorage.getItem('token') !== null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    // Initialize the auth state (call this when the app starts)
    initAuth() {
        const token = this.getToken();
        if (token) {
            // Set the Authorization header
            HttpService.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }
    }
};
