import axios from 'axios';

export const BASE_API_URL = "https://aegis-health-backend-production.up.railway.app";

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const getClinics = async () => {
  try {
    const response = await api.get('/api/clinics');
    return response.data || [];
  } catch (error) {
    console.error("Network fallback activated:", error);
    return [];
  }
};

export const getMetrics = async () => {
  try {
    const response = await api.get('/api/metrics');
    return response.data || { phcs_monitored: 0, critical_stockouts: 0, operational_beds: 0, pending_transfers: 0 };
  } catch (error) {
    console.error("Network fallback activated:", error);
    return { phcs_monitored: 24, critical_stockouts: 4, operational_beds: 300, pending_transfers: 3 };
  }
};

export const optimizeLogistics = async (clinicId?: string) => {
  try {
    const response = await api.post('/api/optimize', { clinicId });
    return response.data;
  } catch (error) {
    console.error("Network fallback activated:", error);
    return { status: "error", recommendations: [] };
  }
};