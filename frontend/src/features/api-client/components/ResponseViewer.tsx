import Editor from '@monaco-editor/react';
import { ExecutionResultDto } from '../../../types/api.types';
import { StatusBadge } from '../../../components/data-display/StatusBadge';
import { formatBytes, formatMs } from '../../../lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Clock, HardDrive } from 'lucide-react';

interface ResponseViewerProps {
  result: ExecutionResultDto | null;
  loading: boolean;
}

export function ResponseViewer({ result, loading }: ResponseViewerProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-xl bg-card/40 animate-pulse gap-2 text-xs text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Executing HTTP request...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border rounded-xl bg-card/20 text-xs text-muted-foreground p-6 text-center">
        <span>Click <strong>Send</strong> to execute the API request and view real-time latency, payload, and response headers.</span>
      </div>
    );
  }

  let formattedBody = result.responseBody;
  try {
    const json = JSON.parse(result.responseBody);
    formattedBody = JSON.stringify(json, null, 2);
  } catch (e) {
    // raw string fallback
  }

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col h-full shadow-lg">
      {/* Response Header Summary Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-muted-foreground">Response Status:</span>
          <StatusBadge status={result.statusCode} text={result.statusText} />
        </div>

        <div className="flex items-center gap-6 text-muted-foreground font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{formatMs(result.responseTimeMs)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-primary" />
            <span>{formatBytes(result.responseSizeBytes)}</span>
          </div>
        </div>
      </div>

      {/* Response Content Tabs */}
      <div className="p-3 flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="body" className="flex-1 flex flex-col">
          <TabsList className="w-fit h-7">
            <TabsTrigger value="body" className="text-xs py-1 px-3">Body</TabsTrigger>
            <TabsTrigger value="headers" className="text-xs py-1 px-3">
              Headers ({Object.keys(result.responseHeaders || {}).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="flex-1 mt-2 min-h-0">
            <div className="border border-border rounded-lg overflow-hidden h-72 bg-[#1e1e1e]">
              <Editor
                height="100%"
                defaultLanguage="json"
                theme="vs-dark"
                value={formattedBody}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-2 flex-1 overflow-y-auto max-h-72">
            <div className="border border-border rounded-lg overflow-hidden bg-card/60">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold">
                  <tr>
                    <th className="px-3 py-2 w-1/3">Header Key</th>
                    <th className="px-3 py-2">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  {Object.entries(result.responseHeaders || {}).map(([key, values], idx) => (
                    <tr key={idx} className="hover:bg-accent/30">
                      <td className="px-3 py-1.5 font-semibold text-foreground">{key}</td>
                      <td className="px-3 py-1.5 text-muted-foreground break-all">{values.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
