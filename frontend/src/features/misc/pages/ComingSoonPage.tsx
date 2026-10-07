import { LucideIcon, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ComingSoonPage({ title, description, icon: Icon }: ComingSoonPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="relative mb-6">
        <div className="p-6 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-2xl">
          <Icon className="w-12 h-12" />
        </div>
        <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">{description}</p>

      <div className="flex items-center gap-3">
        <Button onClick={() => navigate('/dashboard')} variant="gradient">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
