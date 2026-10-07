import { useLocation } from 'react-router-dom';
import { Bell, Moon, Sun, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../ui/button';
import { usePreferencesStore } from '../../stores/usePreferencesStore';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function AppHeader() {
  const location = useLocation();
  const { theme, setTheme } = usePreferencesStore();
  const { user, logout } = useAuthStore();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/projects')) return 'Projects Workspace';
    if (path.includes('/api-client')) return 'API Client';
    if (path.includes('/swagger-import')) return 'OpenAPI / Swagger Import';
    if (path.includes('/performance-tests')) return 'Load & Performance Testing';
    if (path.includes('/live-monitor')) return 'Real-time Live Monitoring';
    if (path.includes('/database-monitoring')) return 'PostgreSQL / TimescaleDB Monitoring';
    if (path.includes('/jvm-monitoring')) return 'JVM Metrics & Garbage Collection';
    if (path.includes('/kubernetes-monitoring')) return 'Kubernetes Cluster Monitoring';
    if (path.includes('/rabbitmq-monitoring')) return 'RabbitMQ Queue Observatory';
    return 'Observatory Dashboard';
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold tracking-tight text-foreground">{getBreadcrumb()}</h1>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
          SYSTEM HEALTHY
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Environment Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border border-border bg-card">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground font-medium">Env:</span>
          <span className="font-semibold text-foreground">Production (Live)</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 text-xs font-semibold gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                {user?.firstName?.[0] || 'U'}
              </span>
              <span className="hidden md:inline">{user?.firstName || 'Account'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user ? `${user.firstName} ${user.lastName}` : 'User Account'}</span>
                <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
