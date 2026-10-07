import { useParams, useNavigate } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FolderKanban, Plus, Layers, Send } from 'lucide-react';
import { projectsService } from '../api/projects-service';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { EmptyState } from '../../../components/feedback/EmptyState';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsService.getProject(id!),
    enabled: !!id,
  });

  const { data: collections = [], isLoading: loadingCollections } = useQuery({
    queryKey: ['collections', id],
    queryFn: () => projectsService.getCollections(id!),
    enabled: !!id,
  });

  if (loadingProject || loadingCollections) {
    return <PageLoader />;
  }

  if (!project) {
    return <div className="p-6 text-center text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/projects')} className="gap-2 text-xs">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          </div>
          <p className="text-xs text-muted-foreground">{project.description || 'No description'}</p>
        </div>

        <Button onClick={() => navigate(`/api-client?project=${project.id}`)} variant="gradient" className="gap-2">
          <Send className="w-4 h-4" /> Open in API Client
        </Button>
      </div>

      {/* Collections Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> API Collections ({collections.length})
          </h2>
        </div>

        {collections.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No collections in this project"
            description="Create your first API collection inside the API Client interface."
            actionLabel="Open API Client"
            onAction={() => navigate(`/api-client?project=${project.id}`)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((col) => (
              <Card key={col.id} className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate(`/api-client?collection=${col.id}`)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">{col.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{col.requestCount} Requests</span>
                    <span>{col.folderCount} Folders</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
