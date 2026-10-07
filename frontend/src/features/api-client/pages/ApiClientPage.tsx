import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../api/request-service';
import { projectsService } from '../../projects/api/projects-service';
import { CollectionSidebar } from '../components/CollectionSidebar';
import { RequestBuilder } from '../components/RequestBuilder';
import { ResponseViewer } from '../components/ResponseViewer';
import {
  ExecuteRequestDto,
  ExecutionResultDto,
  ApiRequestResponse,
  HttpMethod,
  BodyType,
  AuthType,
  HeaderDto,
  ParameterDto,
} from '../../../types/api.types';
import { toast } from 'sonner';

export function ApiClientPage() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const projectIdParam = searchParams.get('project');
  const collectionIdParam = searchParams.get('collection');

  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(collectionIdParam);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResultDto | null>(null);

  // Fetch user projects to get collections
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsService.getProjects,
  });

  const targetProjectId = projectIdParam || (projects.length > 0 ? projects[0].id : null);

  // Fetch collections for active project
  const { data: collections = [] } = useQuery({
    queryKey: ['collections', targetProjectId],
    queryFn: () => projectsService.getCollections(targetProjectId!),
    enabled: !!targetProjectId,
  });

  useEffect(() => {
    if (collections.length > 0 && !activeCollectionId) {
      setActiveCollectionId(collections[0].id);
    }
  }, [collections, activeCollectionId]);

  // Fetch collection tree
  const { data: collectionTree = null } = useQuery({
    queryKey: ['collectionTree', activeCollectionId],
    queryFn: () => requestService.getCollectionTree(activeCollectionId!),
    enabled: !!activeCollectionId,
  });

  // Fetch active request details if selected
  const { data: activeRequestDetails = null } = useQuery({
    queryKey: ['apiRequest', selectedRequestId],
    queryFn: () => requestService.getRequest(selectedRequestId!),
    enabled: !!selectedRequestId,
  });

  // Execute request mutation
  const executeMutation = useMutation({
    mutationFn: (dto: ExecuteRequestDto) => requestService.executeRequest(dto),
    onMutate: () => {
      setExecuting(true);
      setExecutionResult(null);
    },
    onSuccess: (result) => {
      setExecutionResult(result);
      toast.success(`Request finished with status ${result.statusCode}`);
    },
    onError: (err: any) => {
      toast.error('Execution error: ' + (err.message || 'Server error'));
    },
    onSettled: () => {
      setExecuting(false);
    },
  });

  // Save request mutation
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (selectedRequestId) {
        return requestService.updateRequest(selectedRequestId, payload);
      } else {
        return requestService.createRequest({ ...payload, collectionId: activeCollectionId });
      }
    },
    onSuccess: (saved) => {
      setSelectedRequestId(saved.id);
      queryClient.invalidateQueries({ queryKey: ['collectionTree', activeCollectionId] });
      toast.success('API Request saved!');
    },
  });

  const handleSave = (
    name: string,
    httpMethod: HttpMethod,
    url: string,
    body: string,
    bodyType: BodyType,
    authType: AuthType,
    authConfig: string,
    headers: HeaderDto[],
    parameters: ParameterDto[]
  ) => {
    if (!activeCollectionId) {
      toast.error('Please create or select a collection first');
      return;
    }
    saveMutation.mutate({
      name,
      httpMethod,
      url,
      body,
      bodyType,
      authType,
      authConfig,
      headers,
      parameters,
    });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Sidebar Navigation for Collection Tree */}
      <CollectionSidebar
        tree={collectionTree}
        onSelectRequest={(id) => {
          setSelectedRequestId(id);
          setExecutionResult(null);
        }}
        onNewRequest={() => {
          setSelectedRequestId(null);
          setExecutionResult(null);
        }}
        activeRequestId={selectedRequestId}
      />

      {/* Main Request & Response Workbench */}
      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto bg-background/50">
        <RequestBuilder
          key={selectedRequestId || 'new'}
          initialRequest={activeRequestDetails}
          onExecute={(dto) => executeMutation.mutate(dto)}
          onSave={handleSave}
          executing={executing}
        />

        <div className="flex-1 min-h-[300px]">
          <ResponseViewer result={executionResult} loading={executing} />
        </div>
      </div>
    </div>
  );
}
