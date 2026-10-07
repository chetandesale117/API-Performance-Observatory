import { FolderKanban, Layers, ArrowRight, Trash2 } from 'lucide-react';
import { ProjectResponse } from '../../../types/api.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface ProjectCardProps {
  project: ProjectResponse;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onOpen, onDelete }: ProjectCardProps) {
  return (
    <Card className="group hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
            <FolderKanban className="w-5 h-5" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {project.description || 'No description provided for this project.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4 mt-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>{project.collectionCount} Collections</span>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpen(project.id)}
            className="text-xs font-semibold gap-1 text-primary hover:text-primary hover:bg-primary/10 px-2"
          >
            Open <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
