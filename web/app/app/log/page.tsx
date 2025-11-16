'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { VisitForm } from '@/components/visit-form';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Visit } from '@/types';

async function fetchVisits(): Promise<Visit[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // TODO: Implement actual API call to fetch visits
  return [];
}

export default function LogPage() {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const initialRestaurant = searchParams.get('restaurant') || '';

  const { data: visits, isLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: fetchVisits,
  });

  useEffect(() => {
    if (initialRestaurant) {
      setShowForm(true);
    }
  }, [initialRestaurant]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Visit Log</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          {showForm ? 'Cancel' : '+ Log Visit'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <VisitForm
            initialRestaurant={initialRestaurant}
            onSuccess={() => {
              setShowForm(false);
            }}
          />
        </div>
      )}

      {isLoading && (
        <div className="text-center text-zinc-600 dark:text-zinc-400">Loading visits...</div>
      )}

      {visits && visits.length === 0 && !showForm && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            You haven't logged any visits yet.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Log Your First Visit
          </button>
        </div>
      )}

      {visits && visits.length > 0 && (
        <div className="space-y-4">
          {visits.map((visit) => (
            <div
              key={visit.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {visit.restaurant?.name || 'Unknown Restaurant'}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(visit.visit_date).toLocaleDateString()}
                  </p>
                  {visit.rating_overall && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      ⭐ {visit.rating_overall}/5
                    </p>
                  )}
                  {visit.notes && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{visit.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

