import { useEffect, useState } from 'react';
import { useSettings } from '@/shared/hooks/useSettings';
import { useToast } from '@/shared/hooks/useToast';
import { useTheme } from '@/app/providers/ThemeProvider';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch
} from '@/shared/ui';

export const SettingsPage = () => {
  const toast = useToast();
  const { data, isLoading, update, isUpdating } = useSettings();
  const { mode, setMode } = useTheme();
  const [themeMode, setThemeMode] = useState<'auto' | 'light' | 'dark'>('auto');
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (data) {
      setAutoplay(data.autoplay);
    }
  }, [data]);

  useEffect(() => {
    setThemeMode(mode);
  }, [mode]);

  const handleSave = async () => {
    await update({ autoplay });
    toast('Settings saved');
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Settings"
        description="Preferences map to the backend settings entity."
      />
      {isLoading && <p className="text-muted-foreground">Loading settings…</p>}
      <div className="space-y-4">
        <div className="space-y-2 rounded-lg border border-border bg-card/80 p-4">
          <div className="flex flex-col gap-2 text-sm text-foreground">
            <span>Theme (saved on this device)</span>
            <Select
              value={themeMode}
              onValueChange={(value) => {
                const next = value as typeof themeMode;
                setThemeMode(next);
                setMode(next);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Follow system</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            UI theme stays on this browser only. Server-side preferences below remain unaffected.
          </p>
        </div>
        <div className="space-y-3 rounded-lg border border-border bg-card/80 p-4">
          <div className="flex items-center justify-between gap-3 text-sm text-foreground">
            <div className="space-y-1">
              <p className="font-medium">Autoplay next episode</p>
              <p className="text-xs text-muted-foreground">Applies to continuous playback behavior.</p>
            </div>
            <Switch checked={autoplay} onCheckedChange={setAutoplay} />
          </div>
        </div>
      </div>
      <Button className="w-fit" variant="solid" disabled={isUpdating} onClick={handleSave}>
        {isUpdating ? 'Saving…' : 'Save preference'}
      </Button>
    </section>
  );
};
