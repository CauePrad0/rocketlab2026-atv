import { useEffect, useState } from 'react';

import { dashboardService } from '@/services/dashboard/dashboard.service';
import type { DashboardResumo, PerformanceEntrega } from '@/types';

const resumoInicial: DashboardResumo = {
  total_produtos: 0,
  receita_total: 0,
  media_geral_lojas: 0,
};

export function useDashboard() {
  const [resumo, setResumo] = useState<DashboardResumo>(resumoInicial);
  const [performance, setPerformance] = useState<PerformanceEntrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [resumoData, performanceData] = await Promise.all([
        dashboardService.buscarResumo(),
        dashboardService.buscarPerformanceEntregas(),
      ]);

      setResumo(resumoData);
      setPerformance(performanceData);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError('Nao foi possivel carregar os indicadores do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void carregarDashboard();
  }, []);

  return {
    resumo,
    performance,
    loading,
    error,
    carregarDashboard,
  };
}
