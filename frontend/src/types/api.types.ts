export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER' | 'VIEWER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDto;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  collectionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionResponse {
  id: string;
  name: string;
  description: string;
  projectId: string;
  requestCount: number;
  folderCount: number;
  createdAt: string;
}

export interface FolderResponse {
  id: string;
  name: string;
  collectionId: string;
  parentFolderId?: string;
  childFolders: FolderResponse[];
  requestCount: number;
  createdAt: string;
}

export interface ApiRequestSummary {
  id: string;
  name: string;
  httpMethod: string;
  url: string;
}

export interface FolderTreeNode {
  id: string;
  name: string;
  childFolders: FolderTreeNode[];
  requests: ApiRequestSummary[];
}

export interface CollectionTreeResponse {
  id: string;
  name: string;
  description: string;
  folders: FolderTreeNode[];
  requests: ApiRequestSummary[];
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type BodyType = 'NONE' | 'JSON' | 'RAW' | 'FORM_DATA';
export type AuthType = 'NONE' | 'BEARER' | 'BASIC' | 'API_KEY';

export interface HeaderDto {
  id?: string;
  key: string;
  value: string;
  isActive: boolean;
}

export interface ParameterDto {
  id?: string;
  key: string;
  value: string;
  isActive: boolean;
}

export interface ApiRequestDto {
  name: string;
  httpMethod: HttpMethod;
  url: string;
  body?: string;
  bodyType?: BodyType;
  authType?: AuthType;
  authConfig?: string;
  collectionId: string;
  folderId?: string;
  headers?: HeaderDto[];
  parameters?: ParameterDto[];
}

export interface ApiRequestResponse {
  id: string;
  name: string;
  httpMethod: HttpMethod;
  url: string;
  body?: string;
  bodyType: BodyType;
  authType: AuthType;
  authConfig?: string;
  collectionId: string;
  folderId?: string;
  headers: HeaderDto[];
  parameters: ParameterDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecuteRequestDto {
  requestId?: string;
  httpMethod: HttpMethod;
  url: string;
  body?: string;
  bodyType?: BodyType;
  authType?: AuthType;
  authConfig?: string;
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
}

export interface ExecutionResultDto {
  statusCode: number;
  statusText: string;
  responseBody: string;
  responseHeaders: Record<string, string[]>;
  responseTimeMs: number;
  responseSizeBytes: number;
}

export interface RequestHistoryDto {
  id: string;
  requestId?: string;
  userId: string;
  httpMethod: string;
  url: string;
  requestBody?: string;
  requestHeaders?: string;
  responseStatus: number;
  responseBody?: string;
  responseHeaders?: string;
  responseTimeMs: number;
  responseSizeBytes: number;
  executedAt: string;
}
