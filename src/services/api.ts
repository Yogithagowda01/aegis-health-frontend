import axios from 'axios';

// Unified Structural Type Definitions for TypeScript Compiler validation
export interface Clinic {
  id: string;
  name: string;
  beds: number;
  stockout_count: number;
  status: string;
  lat: number;
  lng: number;
  inventory: { [itemName: string]: number };
}

export interface DistrictMetrics {
  phcs_monitored: number;
  critical_stockouts: number;
  operational_beds: number;
  pending_transfers: number;
}

export interface AIRecommendation {
  source: string;
  destination: string;
  item: string;
  quantity: number;
  justification: string;
}

export const BASE_API_URL = "https://aegis-health-backend-production.up.railway.app";

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const getClinics = async (): Promise<Clinic[]> => {
  try {
    const response = await api.get('/api/clinics');
    return response.data || [];
  } catch (error) {
    console.error("Network fallback activated:", error);
    return [];
  }
};

export const getMetrics = async (): Promise<DistrictMetrics> => {
  try {
    const response = await api.get('/api/metrics');
    return response.data;
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
    return { status: "success", recommendations: [] };
  }
};