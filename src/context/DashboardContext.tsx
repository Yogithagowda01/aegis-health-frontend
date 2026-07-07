import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Clinic, AIRecommendation, DistrictMetrics } from '../services/api';
import { 
  getClinics, 
  getMetrics, 
  optimizeLogistics 
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
  const [selectedClinicId, setSelectedClinicId] = useState<string>('AP-GNT-PHC-01');
  const [metrics, setMetrics] = useState<DistrictMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStep, setOptimizationStep] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const selectedClinic = clinics.find(c => c.id === selectedClinicId) || null;

  const refreshData = async () => {
    try {
      const [fetchedMetrics, fetchedClinics] = await Promise.all([
        getMetrics(),
        getClinics()
      ]);
      setMetrics(fetchedMetrics);
      setClinics(fetchedClinics);
    } catch (error) {
      console.error('Error refreshing dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const triggerAIOptimization = async () => {
    setIsOptimizing(true);
    const steps = [
      'Establishing secure pipeline to BigQuery & GCS...',
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
      const result = await optimizeLogistics(selectedClinicId);
      if (result && result.recommendations) {
        setRecommendations(result.recommendations);
        const updatedMetrics = await getMetrics();
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
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecommendations(prev => prev.filter(rec => rec.source !== recId));
      await refreshData();
      return true;
    } catch (error) {
      console.error('Error executing transfer', error);
      return false;
    }
  };

  const performStockUpdate = async (clinicId: string, item: string, quantity: number) => {
    try {
      setClinics(prevClinics => 
        prevClinics.map(clinic => {
          if (clinic.id === clinicId) {
            return {
              ...clinic,
              inventory: {
                ...clinic.inventory,
                [item]: quantity
              }
            };
          }
          return clinic;
        })
      );
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