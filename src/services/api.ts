export interface InventoryItem {
  name: string;
  currentStock: number;
  safetyThreshold: number;
  unit: string;
  status: 'stable' | 'warning' | 'critical';
}

export interface Clinic {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'Area Hospital';
  x: number;
  y: number;
  doctorsCount: number;
  requiredDoctors: number;
  bedCapacity: number;
  bedOccupancy: number;
  contactNumber: string;
  status: 'stable' | 'warning' | 'critical';
  criticalStockouts: string[];
  inventory: InventoryItem[];
}

export interface AIRecommendation {
  id: string;
  sourceFacilityId: string;
  sourceFacilityName: string;
  destFacilityId: string;
  destFacilityName: string;
  item: string;
  quantity: number;
  unit: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  justification: string;
}

export interface DistrictMetrics {
  totalPHCs: number;
  criticalStockouts: number;
  operationalBedsAvailable: number;
  pendingTransfers: number;
}

// Global local server connection target
const BASE_API_URL = "https://aegis-health-backend-production.up.railway.app";

export async function fetchDistrictMetrics(): Promise<DistrictMetrics> {
  try {
    const response = await fetch(`${BASE_API_URL}/api/metrics`);
    return await response.json();
  } catch (e) {
    return { totalPHCs: 0, criticalStockouts: 0, operationalBedsAvailable: 0, pendingTransfers: 0 };
  }
}

export async function fetchClinics(): Promise<Clinic[]> {
  try {
    const response = await fetch(`${BASE_API_URL}/api/clinics`);
    return await response.json();
  } catch (e) {
    return [];
  }
}

export async function fetchClinicDetails(id: string): Promise<Clinic | null> {
  try {
    const response = await fetch(`${BASE_API_URL}/api/clinics`);
    const clinics: Clinic[] = await response.json();
    return clinics.find(c => c.id === id) || null;
  } catch (e) {
    return null;
  }
}

export async function fetchRecommendations(): Promise<AIRecommendation[]> {
  return [];
}

export async function runAIOptimization(): Promise<{ success: boolean; recommendations: AIRecommendation[] }> {
  try {
    const response = await fetch(`${BASE_API_URL}/api/optimize`, { method: 'POST' });
    return await response.json();
  } catch (e) {
    return { success: false, recommendations: [] };
  }
}

export async function updateClinicInventory(clinicId: string, itemName: string, newStockCount: number): Promise<Clinic | null> {
  return null;
}

export async function executeRedistribution(recId: string): Promise<boolean> {
  return true;
}