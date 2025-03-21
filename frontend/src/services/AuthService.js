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
    },

    // Decode JWT token
    decodeToken(token) {
        if (!token) return null;
        try {
            // Split the token into parts
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            
            // Decode the payload (middle part)
            const payload = JSON.parse(atob(parts[1]));
            return payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    // Check if the current user is an admin
    isAdmin() {
        const token = this.getToken();
        if (!token) return false;
        
        const decoded = this.decodeToken(token);
        if (!decoded) return false;
        
        // Check if the admin claim exists and is true
        // Case-insensitive comparison since C# boolean.ToString() returns "True"/"False"
        return decoded.admin?.toLowerCase() === 'true';
    },

    // Get current user's email
    getCurrentUserEmail() {
        const token = this.getToken();
        if (!token) return null;
        
        const decoded = this.decodeToken(token);
        if (!decoded) return null;
        
        return decoded.email;
    }
};
