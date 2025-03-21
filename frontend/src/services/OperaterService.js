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
    },

    async updateAdminStatus(sifra, adminStatus) {
        try {
            const response = await HttpService.put(`/Operater/${sifra}/admin`, {
                admin: adminStatus
            });
            return {
                greska: false,
                poruka: response.data.poruka
            };
        } catch (error) {
            console.error('Error updating admin status:', error);
            return {
                greska: true,
                poruka: error.response?.data || 'Greška prilikom ažuriranja admin statusa'
            };
        }
    }
};

export default OperaterService;
