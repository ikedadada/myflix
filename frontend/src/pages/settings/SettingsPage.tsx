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
    toast.success('Settings saved');
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="設定"
        description="再生やテーマの設定を変更できます。"
      />
      {isLoading && <p className="text-muted-foreground">設定を読み込み中…</p>}
      <div className="space-y-4">
        <div className="space-y-2 rounded-lg border border-border bg-card/80 p-4">
          <div className="flex flex-col gap-2 text-sm text-foreground">
            <span>テーマ（この端末に保存）</span>
            <Select
              value={themeMode}
              onValueChange={(value) => {
                const next = value as typeof themeMode;
                setThemeMode(next);
                setMode(next);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="テーマを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">システムに合わせる</SelectItem>
                <SelectItem value="light">ライト</SelectItem>
                <SelectItem value="dark">ダーク</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            テーマ設定はこのブラウザのみに保存されます。サーバー側の設定には影響しません。
          </p>
        </div>
        <div className="space-y-3 rounded-lg border border-border bg-card/80 p-4">
          <div className="flex items-center justify-between gap-3 text-sm text-foreground">
            <div className="space-y-1">
              <p className="font-medium">次のエピソードを自動再生</p>
              <p className="text-xs text-muted-foreground">連続再生の挙動に適用されます。</p>
            </div>
            <Switch checked={autoplay} onCheckedChange={setAutoplay} />
          </div>
        </div>
      </div>
      <Button className="w-fit" variant="solid" disabled={isUpdating} onClick={handleSave}>
        {isUpdating ? '保存中…' : '設定を保存'}
      </Button>
    </section>
  );
};
