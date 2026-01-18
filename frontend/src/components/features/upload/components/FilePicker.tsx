import { useEffect, useId, useRef } from 'react';
import { Input } from '@/components/ui';

interface FilePickerProps {
  file: File | null;
  onChange: (payload: {
    file: File | null;
    durationSeconds: number | null;
    suggestedTitle?: string;
  }) => void;
}

export const FilePicker = ({ file, onChange }: FilePickerProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (!file) {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      onChange({ file: null, durationSeconds: null });
      return;
    }

    objectUrl = URL.createObjectURL(file);
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';

    videoEl.onloadedmetadata = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
      const computed = Math.max(1, Math.round(videoEl.duration || 0));
      onChange({
        file,
        durationSeconds: computed,
        suggestedTitle: file.name.replace(/\.[^.]+$/, '')
      });
    };

    videoEl.onerror = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
      onChange({
        file,
        durationSeconds: 60,
        suggestedTitle: file.name.replace(/\.[^.]+$/, '')
      });
    };

    videoEl.src = objectUrl;

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file, onChange]);

  return (
    <div>
      <Input
        id={inputId}
        type="file"
        accept="video/*"
        className="border-dashed"
        ref={inputRef}
        onChange={(event) => onChange({ file: event.target.files?.[0] ?? null, durationSeconds: null })}
      />
    </div>
  );
};
