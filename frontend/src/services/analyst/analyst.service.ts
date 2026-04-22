import { apiClient } from '@/services/api/client';
import type { AnalystQueryResponse } from '@/types';

export const analystService = {
  async perguntar(question: string): Promise<AnalystQueryResponse> {
    const response = await apiClient.post('/analyst/query', { question });
    return response.data;
  },
};
