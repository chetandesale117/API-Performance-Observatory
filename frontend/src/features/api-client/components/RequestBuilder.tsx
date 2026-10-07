import { useState } from 'react';
import { Send, Save, Copy } from 'lucide-react';
import {
  HttpMethod,
  BodyType,
  AuthType,
  HeaderDto,
  ParameterDto,
  ExecuteRequestDto,
  ApiRequestResponse,
} from '../../../types/api.types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ParamsEditor } from './ParamsEditor';
import { HeadersEditor } from './HeadersEditor';
import { AuthConfigPanel } from './AuthConfigPanel';
import { BodyEditor } from './BodyEditor';

interface RequestBuilderProps {
  initialRequest?: ApiRequestResponse | null;
  onExecute: (dto: ExecuteRequestDto) => void;
  onSave?: (name: string, method: HttpMethod, url: string, body: string, bodyType: BodyType, authType: AuthType, authConfig: string, headers: HeaderDto[], params: ParameterDto[]) => void;
  executing: boolean;
}

export function RequestBuilder({ initialRequest, onExecute, onSave, executing }: RequestBuilderProps) {
  const [name, setName] = useState(initialRequest?.name || 'Untitled API Request');
  const [httpMethod, setHttpMethod] = useState<HttpMethod>(initialRequest?.httpMethod || 'GET');
  const [url, setUrl] = useState(initialRequest?.url || 'https://jsonplaceholder.typicode.com/todos/1');
  const [body, setBody] = useState(initialRequest?.body || '');
  const [bodyType, setBodyType] = useState<BodyType>(initialRequest?.bodyType || 'NONE');
  const [authType, setAuthType] = useState<AuthType>(initialRequest?.authType || 'NONE');
  const [authConfig, setAuthConfig] = useState(initialRequest?.authConfig || '');
  const [headers, setHeaders] = useState<HeaderDto[]>(initialRequest?.headers || []);
  const [parameters, setParameters] = useState<ParameterDto[]>(initialRequest?.parameters || []);

  const handleSend = () => {
    const headersMap: Record<string, string> = {};
    headers.filter((h) => h.isActive && h.key).forEach((h) => {
      headersMap[h.key] = h.value;
    });

    const paramsMap: Record<string, string> = {};
    parameters.filter((p) => p.isActive && p.key).forEach((p) => {
      paramsMap[p.key] = p.value;
    });

    onExecute({
      requestId: initialRequest?.id,
      httpMethod,
      url,
      body,
      bodyType,
      authType,
      authConfig,
      headers: headersMap,
      parameters: paramsMap,
    });
  };

  return (
    <div className="space-y-4 border border-border rounded-xl p-4 bg-card shadow-sm">
      {/* Name Input Bar */}
      <div className="flex items-center justify-between gap-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Request Name (e.g. Get User Profile)"
          className="h-8 text-sm font-bold border-none shadow-none focus-visible:ring-0 bg-transparent px-0 w-72"
        />

        {onSave && (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onSave(name, httpMethod, url, body, bodyType, authType, authConfig, headers, parameters)
            }
            className="gap-1.5 h-8 text-xs font-semibold"
          >
            <Save className="w-3.5 h-3.5" /> Save Request
          </Button>
        )}
      </div>

      {/* Primary HTTP Action Bar */}
      <div className="flex items-center gap-2">
        <Select value={httpMethod} onValueChange={(val) => setHttpMethod(val as HttpMethod)}>
          <SelectTrigger className="w-28 h-10 font-mono font-bold text-xs">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET" className="text-emerald-400 font-bold">GET</SelectItem>
            <SelectItem value="POST" className="text-blue-400 font-bold">POST</SelectItem>
            <SelectItem value="PUT" className="text-amber-400 font-bold">PUT</SelectItem>
            <SelectItem value="PATCH" className="text-purple-400 font-bold">PATCH</SelectItem>
            <SelectItem value="DELETE" className="text-rose-400 font-bold">DELETE</SelectItem>
            <SelectItem value="HEAD" className="text-cyan-400 font-bold">HEAD</SelectItem>
            <SelectItem value="OPTIONS" className="text-slate-400 font-bold">OPTIONS</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter request URL (e.g. https://api.example.com/v1/users)"
          className="h-10 flex-1 font-mono text-xs bg-background/50"
        />

        <Button
          onClick={handleSend}
          disabled={executing || !url}
          variant="gradient"
          className="h-10 px-6 font-bold gap-2 text-xs"
        >
          {executing ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-3.5 h-3.5" /> Send
            </>
          )}
        </Button>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="params" className="w-full">
        <TabsList className="h-8 bg-muted/60">
          <TabsTrigger value="params" className="text-xs px-3 py-1">
            Params ({parameters.filter((p) => p.isActive && p.key).length})
          </TabsTrigger>
          <TabsTrigger value="headers" className="text-xs px-3 py-1">
            Headers ({headers.filter((h) => h.isActive && h.key).length})
          </TabsTrigger>
          <TabsTrigger value="auth" className="text-xs px-3 py-1">
            Auth ({authType !== 'NONE' ? 'Active' : '0'})
          </TabsTrigger>
          <TabsTrigger value="body" className="text-xs px-3 py-1">
            Body ({bodyType !== 'NONE' ? bodyType : '0'})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="mt-3">
          <ParamsEditor parameters={parameters} onChange={setParameters} />
        </TabsContent>

        <TabsContent value="headers" className="mt-3">
          <HeadersEditor headers={headers} onChange={setHeaders} />
        </TabsContent>

        <TabsContent value="auth" className="mt-3">
          <AuthConfigPanel
            authType={authType}
            authConfig={authConfig}
            onAuthTypeChange={setAuthType}
            onAuthConfigChange={setAuthConfig}
          />
        </TabsContent>

        <TabsContent value="body" className="mt-3">
          <BodyEditor
            bodyType={bodyType}
            body={body}
            onBodyTypeChange={setBodyType}
            onBodyChange={setBody}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
