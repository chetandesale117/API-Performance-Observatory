import { apiClient } from '../../../lib/api-client';
import {
  ApiResponse,
  ApiRequestDto,
  ApiRequestResponse,
  ExecuteRequestDto,
  ExecutionResultDto,
  CollectionTreeResponse,
} from '../../../types/api.types';

export const requestService = {
  createRequest: async (dto: ApiRequestDto): Promise<ApiRequestResponse> => {
    const res = await apiClient.post<ApiResponse<ApiRequestResponse>>('/requests', dto);
    return res.data.data;
  },

  getRequest: async (id: string): Promise<ApiRequestResponse> => {
    const res = await apiClient.get<ApiResponse<ApiRequestResponse>>(`/requests/${id}`);
    return res.data.data;
  },

  updateRequest: async (id: string, dto: ApiRequestDto): Promise<ApiRequestResponse> => {
    const res = await apiClient.put<ApiResponse<ApiRequestResponse>>(`/requests/${id}`, dto);
    return res.data.data;
  },

  deleteRequest: async (id: string): Promise<void> => {
    await apiClient.delete(`/requests/${id}`);
  },

  duplicateRequest: async (id: string): Promise<ApiRequestResponse> => {
    const res = await apiClient.post<ApiResponse<ApiRequestResponse>>(`/requests/${id}/duplicate`);
    return res.data.data;
  },

  executeRequest: async (dto: ExecuteRequestDto): Promise<ExecutionResultDto> => {
    const res = await apiClient.post<ApiResponse<ExecutionResultDto>>('/requests/execute', dto);
    return res.data.data;
  },

  getCollectionTree: async (collectionId: string): Promise<CollectionTreeResponse> => {
    const res = await apiClient.get<ApiResponse<CollectionTreeResponse>>(`/collections/${collectionId}`);
    return res.data.data;
  },
};
