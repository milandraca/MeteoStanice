import { HttpService } from "./HttpService";

const OperaterService = {
    async get() {
        try {
            const response = await HttpService.get('/Operater');
            return response.data;
        } catch (error) {
            console.error('Error fetching operaters:', error);
            return [];
        }
    }
};

export default OperaterService;
