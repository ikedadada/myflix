import { useId } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/ui';

interface ThumbnailSectionProps {
  previewUrl: string | null;
  fileName: string | null;
  error: string | null;
  generating: boolean;
  uploading?: boolean;
  objectKey?: string | null;
  onSelect: (file: File | null) => void;
}

export const ThumbnailSection = ({
  previewUrl,
  fileName,
  error,
  generating,
  uploading,
  objectKey,
  onSelect
}: ThumbnailSectionProps) => {
  const inputId = useId();

  return (
    <Card className="border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Thumbnail (optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor={inputId}>
            Select image
          </label>
          <Input
            id={inputId}
            type="file"
            accept="image/*"
            className="border-dashed"
            onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
          />
        </div>
        {fileName && (
          <div className="rounded border border-border bg-muted/10 px-3 py-2 text-sm text-muted-foreground">
            Selected thumbnail: {fileName}
          </div>
        )}
        {previewUrl && (
          <div className="overflow-hidden rounded border border-border bg-card">
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="w-full max-h-64 object-contain bg-card"
            />
            <p className="px-2 py-1 text-center text-xs text-muted-foreground">
              Preview (resized to 16:9, showing full frame)
            </p>
          </div>
        )}
        {objectKey && <p className="text-xs text-success">Thumbnail uploaded: {objectKey}</p>}
        {uploading && <p className="text-xs text-muted-foreground">Uploading thumbnail…</p>}
        {generating && <p className="text-xs text-muted-foreground">Generating thumbnail from video…</p>}
        {error && <p className="text-xs text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
};
