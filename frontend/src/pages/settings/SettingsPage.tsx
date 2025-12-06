import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useSettings } from '@/shared/hooks/useSettings';
import { useToast } from '@/shared/hooks/useToast';
import { useTheme } from '@/app/providers/ThemeProvider';

export const SettingsPage = () => {
  const toast = useToast();
  const { data, isLoading, update, isUpdating } = useSettings();
  const { setMode } = useTheme();
  const [backendTheme, setBackendTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (data) {
      setBackendTheme(data.theme);
      setAutoplay(data.autoplay);
      setMode(data.theme === 'system' ? 'auto' : data.theme);
    }
  }, [data, setMode]);

  const handleSave = async () => {
    await update({ theme: backendTheme, autoplay });
    toast('Settings saved');
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-white/70">Preferences map to the backend settings entity.</p>
      </div>
      {isLoading && <p className="text-white/60">Loading settings…</p>}
      <div className="space-y-4">
        <div className="space-y-2 rounded-lg border border-border/60 bg-card/80 p-4">
          <label className="flex flex-col gap-2 text-sm">
            Theme
            <select
              className="rounded border border-border bg-card px-3 py-2 text-text"
              value={backendTheme}
              onChange={(event) => {
                const next = event.target.value as typeof backendTheme;
                setBackendTheme(next);
                setMode(next === 'system' ? 'auto' : next);
              }}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={autoplay} onChange={(event) => setAutoplay(event.target.checked)} />
            Autoplay next episode
          </label>
        </div>
      </div>
      <Button className="w-fit" variant="solid" disabled={isUpdating} onClick={handleSave}>
        {isUpdating ? 'Saving…' : 'Save preference'}
      </Button>
    </section>
  );
};
