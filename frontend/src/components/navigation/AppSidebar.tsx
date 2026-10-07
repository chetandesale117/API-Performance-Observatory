import { NavLink } from 'react-router-dom';
import {
  Activity,
  FolderKanban,
  Send,
  FileJson,
  Gauge,
  History,
  GitCompare,
  Server,
  Database,
  Cpu,
  Container,
  MessageSquare,
  Bell,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { usePreferencesStore } from '../../stores/usePreferencesStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar } = usePreferencesStore();
  const { user, logout } = useAuthStore();

  const navGroups = [
    {
      title: 'API Testing',
      items: [
        { label: 'Dashboard', icon: Activity, path: '/dashboard' },
        { label: 'Projects', icon: FolderKanban, path: '/projects' },
        { label: 'API Client', icon: Send, path: '/api-client' },
        { label: 'Swagger Import', icon: FileJson, path: '/swagger-import' },
      ],
    },
    {
      title: 'Performance',
      items: [
        { label: 'Load Tests', icon: Gauge, path: '/performance-tests' },
        { label: 'Live Monitor', icon: Activity, path: '/live-monitor' },
        { label: 'Test History', icon: History, path: '/test-history' },
        { label: 'Comparison', icon: GitCompare, path: '/test-comparison' },
      ],
    },
    {
      title: 'Infrastructure',
      items: [
        { label: 'Backend Services', icon: Server, path: '/service-monitoring' },
        { label: 'Database Monitoring', icon: Database, path: '/database-monitoring' },
        { label: 'JVM Monitoring', icon: Cpu, path: '/jvm-monitoring' },
        { label: 'Kubernetes', icon: Container, path: '/kubernetes-monitoring' },
        { label: 'RabbitMQ', icon: MessageSquare, path: '/rabbitmq-monitoring' },
      ],
    },
    {
      title: 'Management',
      items: [
        { label: 'Alerts', icon: Bell, path: '/alerts' },
        { label: 'Reports', icon: FileBarChart, path: '/reports' },
        { label: 'Settings', icon: Settings, path: '/settings' },
      ],
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`flex flex-col h-screen border-r border-border bg-sidebar transition-all duration-300 select-none ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/40 shrink-0">
              <Activity className="w-5 h-5 text-primary animate-pulse" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm leading-none truncate tracking-tight">API Observatory</span>
                <span className="text-[10px] text-muted-foreground font-medium">Performance Engine</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`
                    }
                  >
                    {sidebarCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Icon className="w-4 h-4 shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.firstName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : 'Observatory User'}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">{user?.email || 'user@observatory.io'}</span>
              </div>
            </div>
          ) : (
            <Avatar className="h-8 w-8 mx-auto border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.firstName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          )}

          {!sidebarCollapsed && (
            <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
