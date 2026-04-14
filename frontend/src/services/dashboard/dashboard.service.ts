import { apiClient } from '@/services/api/client';
import type { DashboardResumo, PerformanceEntrega } from '@/types';

export const dashboardService = {
  async buscarResumo(): Promise<DashboardResumo> {
    const response = await apiClient.get('/dashboard/resumo');
    return response.data;
  },

  async buscarPerformanceEntregas(): Promise<PerformanceEntrega[]> {
    const response = await apiClient.get('/dashboard/performance-entregas');
    return Array.isArray(response.data) ? response.data : [];
  },
};
