import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const uploadFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(1000, 'Description is too long').optional(),
  tone: z.enum(['friendly', 'professional', 'playful', 'concise']),
  userContext: z.string().max(500, 'Context is too long').optional()
});

export type UploadFormValues = z.infer<typeof uploadFormSchema>;

export const useUploadForm = (defaults?: Partial<UploadFormValues>) =>
  useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: '',
      description: '',
      tone: 'friendly',
      userContext: '',
      ...defaults
    }
  });
