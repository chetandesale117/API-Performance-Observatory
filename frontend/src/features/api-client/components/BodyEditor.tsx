import Editor from '@monaco-editor/react';
import { BodyType } from '../../../types/api.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

interface BodyEditorProps {
  bodyType: BodyType;
  body: string;
  onBodyTypeChange: (type: BodyType) => void;
  onBodyChange: (body: string) => void;
}

export function BodyEditor({ bodyType, body, onBodyTypeChange, onBodyChange }: BodyEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground">Body Format:</span>
        <Select value={bodyType} onValueChange={(val) => onBodyTypeChange(val as BodyType)}>
          <SelectTrigger className="h-7 w-36 text-xs">
            <SelectValue placeholder="Body Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">None</SelectItem>
            <SelectItem value="JSON">JSON (application/json)</SelectItem>
            <SelectItem value="RAW">Raw (Text)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {bodyType === 'NONE' ? (
        <div className="flex items-center justify-center p-8 border border-dashed border-border rounded-lg text-xs text-muted-foreground bg-card/20">
          This request does not have a payload body.
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden h-64 bg-[#1e1e1e]">
          <Editor
            height="100%"
            defaultLanguage={bodyType === 'JSON' ? 'json' : 'plaintext'}
            language={bodyType === 'JSON' ? 'json' : 'plaintext'}
            theme="vs-dark"
            value={body || ''}
            onChange={(val) => onBodyChange(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
      )}
    </div>
  );
}
