import { apiClient } from '../../../lib/api-client';
import { ApiResponse, ProjectResponse, CollectionResponse } from '../../../types/api.types';

export const projectsService = {
  getProjects: async (): Promise<ProjectResponse[]> => {
    const res = await apiClient.get<ApiResponse<ProjectResponse[]>>('/projects');
    return res.data.data;
  },

  getProject: async (id: string): Promise<ProjectResponse> => {
    const res = await apiClient.get<ApiResponse<ProjectResponse>>(`/projects/${id}`);
    return res.data.data;
  },

  createProject: async (name: string, description?: string): Promise<ProjectResponse> => {
    const res = await apiClient.post<ApiResponse<ProjectResponse>>('/projects', { name, description });
    return res.data.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  getCollections: async (projectId: string): Promise<CollectionResponse[]> => {
    const res = await apiClient.get<ApiResponse<CollectionResponse[]>>(`/projects/${projectId}/collections`);
    return res.data.data;
  },

  createCollection: async (projectId: string, name: string, description?: string): Promise<CollectionResponse> => {
    const res = await apiClient.post<ApiResponse<CollectionResponse>>(`/projects/${projectId}/collections`, {
      name,
      description,
    });
    return res.data.data;
  },
};
