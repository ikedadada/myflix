import { useEffect, useId } from 'react';
import { Input, Textarea } from '@/components/ui';
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { UploadFormValues } from '../useUploadForm';

interface TextInputsProps {
  register: UseFormRegister<UploadFormValues>;
  errors: FieldErrors<UploadFormValues>;
  suggestedTitle?: string;
  setValue: UseFormSetValue<UploadFormValues>;
}

export const TextInputs = ({ register, errors, suggestedTitle, setValue }: TextInputsProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (suggestedTitle) {
      setValue('title', suggestedTitle, { shouldValidate: false, shouldDirty: true });
    }
  }, [suggestedTitle, setValue]);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor={titleId}>
          タイトル
        </label>
        <Input id={titleId} {...register('title')} placeholder="動画のタイトル" />
        {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor={descriptionId}>
          説明
        </label>
        <Textarea
          id={descriptionId}
          {...register('description')}
          placeholder="動画の概要や補足"
          rows={8}
        />
        {errors.description && (
          <p className="text-xs text-danger">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};
