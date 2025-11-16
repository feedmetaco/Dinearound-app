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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border-2 border-[#E8D5BC]/40 bg-[#FAF8F5] p-6 shadow-xl dark:border-[#524D47]/40 dark:bg-[#3D3935]">
      {error && (
        <div className="rounded-2xl bg-[#D69B9B]/15 border-2 border-[#D69B9B]/40 p-4 text-sm font-medium text-[#C08F84] dark:bg-[#D69B9B]/25">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="restaurantName" className="block text-sm font-bold text-[#3D3935] dark:text-[#F2EFE9]">
          Restaurant Name *
        </label>
        <input
          id="restaurantName"
          {...register('restaurantName')}
          className="mt-2 block w-full rounded-2xl border-2 border-[#E6E1D8] bg-[#FAF8F5] px-4 py-3 text-base font-medium text-[#3D3935] shadow-sm transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 dark:border-[#524D47] dark:bg-[#2A2621] dark:text-white"
          placeholder="Enter restaurant name"
        />
        {errors.restaurantName && (
          <p className="mt-2 text-sm font-medium text-[#D69B9B]">
            {errors.restaurantName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="visitDate" className="block text-sm font-bold text-[#3D3935] dark:text-[#F2EFE9]">
          Visit Date *
        </label>
        <input
          id="visitDate"
          type="date"
          {...register('visitDate')}
          className="mt-2 block w-full rounded-2xl border-2 border-[#E6E1D8] bg-[#FAF8F5] px-4 py-3 text-base font-medium text-[#3D3935] shadow-sm transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 dark:border-[#524D47] dark:bg-[#2A2621] dark:text-white"
        />
        {errors.visitDate && (
          <p className="mt-2 text-sm font-medium text-[#D69B9B]">
            {errors.visitDate.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-bold text-[#3D3935] dark:text-[#F2EFE9]">
          Rating (1-5)
        </label>
        <input
          id="rating"
          type="number"
          min="1"
          max="5"
          {...register('rating', { valueAsNumber: true })}
          className="mt-2 block w-full rounded-2xl border-2 border-[#E6E1D8] bg-[#FAF8F5] px-4 py-3 text-base font-medium text-[#3D3935] shadow-sm transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 dark:border-[#524D47] dark:bg-[#2A2621] dark:text-white"
        />
        {errors.rating && (
          <p className="mt-2 text-sm font-medium text-[#D69B9B]">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-bold text-[#3D3935] dark:text-[#F2EFE9]">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          {...register('notes')}
          className="mt-2 block w-full rounded-2xl border-2 border-[#E6E1D8] bg-[#FAF8F5] px-4 py-3 text-base font-medium text-[#3D3935] shadow-sm transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 dark:border-[#524D47] dark:bg-[#2A2621] dark:text-white"
          placeholder="What did you think about this restaurant?"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-gradient-to-r from-[#D4A59A] to-[#C08F84] px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : 'Save Visit'}
      </button>
    </form>
  );
}

