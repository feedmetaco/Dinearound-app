'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

const visitSchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  visitDate: z.string().min(1, 'Visit date is required'),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

interface VisitFormProps {
  initialRestaurant?: string;
  onSuccess?: () => void;
}

export function VisitForm({ initialRestaurant = '', onSuccess }: VisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      restaurantName: initialRestaurant,
      visitDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: VisitFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // TODO: Implement actual API call to save visit
      // For now, just show success
      await new Promise((resolve) => setTimeout(resolve, 500));

      queryClient.invalidateQueries({ queryKey: ['visits'] });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save visit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="restaurantName" className="block text-sm font-medium text-foreground">
          Restaurant Name *
        </label>
        <input
          id="restaurantName"
          {...register('restaurantName')}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          placeholder="Enter restaurant name"
        />
        {errors.restaurantName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.restaurantName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="visitDate" className="block text-sm font-medium text-foreground">
          Visit Date *
        </label>
        <input
          id="visitDate"
          type="date"
          {...register('visitDate')}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
        {errors.visitDate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.visitDate.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-foreground">
          Rating (1-5)
        </label>
        <input
          id="rating"
          type="number"
          min="1"
          max="5"
          {...register('rating', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          {...register('notes')}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          placeholder="What did you think about this restaurant?"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:hover:bg-zinc-200"
      >
        {isSubmitting ? 'Saving...' : 'Save Visit'}
      </button>
    </form>
  );
}

