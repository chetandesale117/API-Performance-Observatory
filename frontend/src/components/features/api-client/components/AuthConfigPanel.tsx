import { AuthType } from '../../../types/api.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

interface AuthConfigPanelProps {
  authType: AuthType;
  authConfig: string;
  onAuthTypeChange: (type: AuthType) => void;
  onAuthConfigChange: (config: string) => void;
}

export function AuthConfigPanel({
  authType,
  authConfig,
  onAuthTypeChange,
  onAuthConfigChange,
}: AuthConfigPanelProps) {
  return (
    <div className="space-y-4 max-w-md">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Authentication Type</Label>
        <Select value={authType} onValueChange={(val) => onAuthTypeChange(val as AuthType)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select Auth Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">No Authentication</SelectItem>
            <SelectItem value="BEARER">Bearer Token (JWT)</SelectItem>
            <SelectItem value="BASIC">Basic Auth (user:pass)</SelectItem>
            <SelectItem value="API_KEY">API Key</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {authType === 'BEARER' && (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Token</Label>
          <Input
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={authConfig}
            onChange={(e) => onAuthConfigChange(e.target.value)}
            className="h-8 text-xs font-mono"
          />
        </div>
      )}

      {authType === 'BASIC' && (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Username:Password</Label>
          <Input
            placeholder="admin:secret123"
            value={authConfig}
            onChange={(e) => onAuthConfigChange(e.target.value)}
            className="h-8 text-xs font-mono"
          />
        </div>
      )}

      {authType === 'API_KEY' && (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">API Key Value</Label>
          <Input
            placeholder="obs_live_99a8b7c6..."
            value={authConfig}
            onChange={(e) => onAuthConfigChange(e.target.value)}
            className="h-8 text-xs font-mono"
          />
        </div>
      )}
    </div>
  );
}
