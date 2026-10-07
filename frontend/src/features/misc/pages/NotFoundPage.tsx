import { AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="p-4 mb-4 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        The route you are trying to access does not exist in the API Performance Observatory.
      </p>
      <Button onClick={() => navigate('/dashboard')} variant="gradient">
        Back to Safety
      </Button>
    </div>
  );
}
