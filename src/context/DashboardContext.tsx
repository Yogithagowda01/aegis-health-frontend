import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Clinic, AIRecommendation, DistrictMetrics } from '../services/api';
import {
  fetchClinics,
  fetchDistrictMetrics,
  fetchRecommendations,
  runAIOptimization,
  executeRedistribution,
  updateClinicInventory
} from '../services/api';

export type ViewType = 'command-center' | 'supply-hub' | 'clinic-details';

interface DashboardContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  clinics: Clinic[];
  selectedClinicId: string;
  setSelectedClinicId: (id: string) => void;
  selectedClinic: Clinic | null;
  metrics: DistrictMetrics | null;
  recommendations: AIRecommendation[];
  isOptimizing: boolean;
  optimizationStep: string;
  isLoading: boolean;
  triggerAIOptimization: () => Promise<void>;
  performTransfer: (recId: string) => Promise<boolean>;
  performStockUpdate: (clinicId: string, item: string, quantity: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState<ViewType>('command-center');
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('guntur-town');
  const [metrics, setMetrics] = useState<DistrictMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStep, setOptimizationStep] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Derive selected clinic
  const selectedClinic = clinics.find(c => c.id === selectedClinicId) || null;

  const refreshData = async () => {
    try {
      const [fetchedMetrics, fetchedClinics, fetchedRecs] = await Promise.all([
        fetchDistrictMetrics(),
        fetchClinics(),
        fetchRecommendations()
      ]);
      setMetrics(fetchedMetrics);
      setClinics(fetchedClinics);
      setRecommendations(fetchedRecs);
    } catch (error) {
      console.error('Error refreshing dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshData();
  }, []);

  const triggerAIOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate steps in loading timeline over 2 seconds
    const steps = [
      'Establishing secure secure pipeline to BigQuery & GCS...',
      'Gemini is analyzing regional asset velocities & demand rates...',
      'Running predictive regression on seasonal epidemiology...',
      'Simulating transit network latency & routing constraints...',
      'Synthesizing clinical justifications for redistribution...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setOptimizationStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    try {
      const result = await runAIOptimization();
      if (result.success) {
        setRecommendations(result.recommendations);
        // Refresh metrics as redistribution numbers might have shifted
        const updatedMetrics = await fetchDistrictMetrics();
        setMetrics(updatedMetrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
      setOptimizationStep('');
    }
  };

  const performTransfer = async (recId: string): Promise<boolean> => {
    try {
      const success = await executeRedistribution(recId);
      if (success) {
        // Refresh everything to reflect changed inventories
        await refreshData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error executing transfer', error);
      return false;
    }
  };

  const performStockUpdate = async (clinicId: string, item: string, quantity: number) => {
    try {
      const updatedClinic = await updateClinicInventory(clinicId, item, quantity);
      if (updatedClinic) {
        await refreshData();
      }
    } catch (error) {
      console.error('Error updating stock count', error);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        activeView,
        setActiveView,
        clinics,
        selectedClinicId,
        setSelectedClinicId,
        selectedClinic,
        metrics,
        recommendations,
        isOptimizing,
        optimizationStep,
        isLoading,
        triggerAIOptimization,
        performTransfer,
        performStockUpdate,
        refreshData
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
