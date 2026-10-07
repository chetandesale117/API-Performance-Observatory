import { useState } from 'react';
import { Layers, Folder, FileCode, Plus, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { CollectionTreeResponse, FolderTreeNode, ApiRequestSummary } from '../../../types/api.types';
import { HttpMethodBadge } from '../../../components/data-display/HttpMethodBadge';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface CollectionSidebarProps {
  tree: CollectionTreeResponse | null;
  onSelectRequest: (requestId: string) => void;
  onNewRequest: () => void;
  activeRequestId?: string | null;
}

export function CollectionSidebar({
  tree,
  onSelectRequest,
  onNewRequest,
  activeRequestId,
}: CollectionSidebarProps) {
  const [filter, setFilter] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const renderFolderNode = (node: FolderTreeNode) => {
    const isExpanded = expandedFolders[node.id] !== false; // default expanded

    return (
      <div key={node.id} className="space-y-1 pl-2">
        <div
          onClick={() => toggleFolder(node.id)}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer select-none"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <Folder className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">{node.name}</span>
        </div>

        {isExpanded && (
          <div className="pl-3 border-l border-border/40 space-y-1">
            {node.childFolders?.map(renderFolderNode)}
            {node.requests?.map(renderRequestItem)}
          </div>
        )}
      </div>
    );
  };

  const renderRequestItem = (req: ApiRequestSummary) => {
    const isActive = activeRequestId === req.id;
    return (
      <div
        key={req.id}
        onClick={() => onSelectRequest(req.id)}
        className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
          isActive
            ? 'bg-primary/20 text-primary font-semibold border border-primary/30'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <HttpMethodBadge method={req.httpMethod} className="text-[9px] px-1 py-0" />
          <span className="truncate font-medium">{req.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full border-r border-border bg-card/40 w-64 shrink-0">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Layers className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-bold truncate">{tree?.name || 'Collection'}</span>
        </div>

        <Button size="icon" variant="ghost" onClick={onNewRequest} className="h-7 w-7 text-muted-foreground hover:text-foreground">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter requests..."
            className="pl-8 h-8 text-xs bg-background/50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {!tree ? (
          <div className="p-4 text-center text-xs text-muted-foreground">Select a collection</div>
        ) : (
          <>
            {tree.folders?.map(renderFolderNode)}
            {tree.requests?.map(renderRequestItem)}
          </>
        )}
      </div>
    </div>
  );
}
