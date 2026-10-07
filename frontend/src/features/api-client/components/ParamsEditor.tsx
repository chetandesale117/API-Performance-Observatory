import { Plus, Trash2 } from 'lucide-react';
import { ParameterDto } from '../../../types/api.types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';

interface ParamsEditorProps {
  parameters: ParameterDto[];
  onChange: (params: ParameterDto[]) => void;
}

export function ParamsEditor({ parameters, onChange }: ParamsEditorProps) {
  const handleAdd = () => {
    onChange([...parameters, { key: '', value: '', isActive: true }]);
  };

  const handleRemove = (index: number) => {
    const updated = [...parameters];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleChange = (index: number, field: keyof ParameterDto, val: any) => {
    const updated = [...parameters];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="border border-border rounded-lg overflow-hidden bg-card/40">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold">
            <tr>
              <th className="w-10 px-3 py-2 text-center">Use</th>
              <th className="px-3 py-2">Parameter Key</th>
              <th className="px-3 py-2">Value</th>
              <th className="w-10 px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {parameters.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-muted-foreground">
                  No query parameters. Click below to add.
                </td>
              </tr>
            ) : (
              parameters.map((param, idx) => (
                <tr key={idx} className="hover:bg-accent/30 transition-colors">
                  <td className="px-3 py-1.5 text-center">
                    <Checkbox
                      checked={param.isActive}
                      onCheckedChange={(checked) => handleChange(idx, 'isActive', !!checked)}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      placeholder="Key (e.g. page)"
                      value={param.key}
                      onChange={(e) => handleChange(idx, 'key', e.target.value)}
                      className="h-7 text-xs font-mono bg-transparent border-none shadow-none focus-visible:ring-0"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      placeholder="Value (e.g. 1)"
                      value={param.value}
                      onChange={(e) => handleChange(idx, 'value', e.target.value)}
                      className="h-7 text-xs font-mono bg-transparent border-none shadow-none focus-visible:ring-0"
                    />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(idx)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Button variant="outline" size="sm" onClick={handleAdd} className="gap-1 text-xs h-7">
        <Plus className="w-3.5 h-3.5" /> Add Query Parameter
      </Button>
    </div>
  );
}
