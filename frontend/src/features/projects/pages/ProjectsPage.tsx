import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderKanban, Search } from 'lucide-react';
import { projectsService } from '../api/projects-service';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCreateDialog } from '../components/ProjectCreateDialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { Skeleton } from '../../../components/ui/skeleton';
import { toast } from 'sonner';
import { useProjectStore } from '../../../stores/useProjectStore';

export function ProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setActiveProject = useProjectStore((state) => state.setActiveProject);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsService.getProjects,
  });

  const createMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description: string }) =>
      projectsService.createProject(name, description),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`Project "${newProject.name}" created!`);
    },
    onError: () => {
      toast.error('Failed to create project.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectsService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully.');
    },
  });

  const handleOpenProject = (id: string) => {
    setActiveProject(id);
    navigate(`/api-client?project=${id}`);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects Workspace</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Organize APIs, test suites, and load profiles by application boundary
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)} variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={search ? 'No projects match your search' : 'No projects yet'}
          description="Create your first project to start grouping collections, running load tests, and monitoring backends."
          actionLabel="Create Project"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={handleOpenProject}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <ProjectCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={(name, description) => createMutation.mutate({ name, description })}
      />
    </div>
  );
}
