'use client';

import { useState, useEffect, Suspense } from 'react';
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

function LogContent() {
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
        <h2 className="bg-gradient-to-r from-[#A8C4A5] to-[#D4A59A] bg-clip-text text-3xl font-black text-transparent">Visit Log</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-2xl bg-gradient-to-r from-[#A8C4A5] to-[#8FB08C] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
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
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E8D5BC]/40 border-t-[#D4A59A]"></div>
          <p className="text-base font-bold text-[#D4A59A] dark:text-[#E5C4BA]">Loading visits...</p>
        </div>
      )}

      {visits && visits.length === 0 && !showForm && (
        <div className="rounded-3xl border-2 border-[#E8D5BC]/40 bg-[#FAF8F5] p-10 text-center shadow-lg dark:border-[#524D47]/40 dark:bg-[#3D3935]">
          <span className="mb-4 inline-block text-6xl">📝</span>
          <p className="mb-4 text-lg font-bold text-[#3D3935] dark:text-[#F2EFE9]">
            You haven't logged any visits yet.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-gradient-to-r from-[#A8C4A5] to-[#8FB08C] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
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
              className="rounded-3xl border-2 border-[#E8D5BC]/40 bg-[#FAF8F5] p-6 shadow-lg transition-all hover:shadow-xl hover:border-[#D4A59A]/60 dark:border-[#524D47]/40 dark:bg-[#3D3935]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#3D3935] dark:text-[#F2EFE9]">
                    {visit.restaurant?.name || 'Unknown Restaurant'}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#6E6962] dark:text-[#A39D93]">
                    {new Date(visit.visit_date).toLocaleDateString()}
                  </p>
                  {visit.rating_overall && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#D4A59A] to-[#C08F84] px-3 py-1 text-sm font-bold text-white">
                      ⭐ {visit.rating_overall}/5
                    </div>
                  )}
                  {visit.notes && (
                    <p className="mt-3 text-base font-medium text-[#524D47] dark:text-[#D4CFC4]">{visit.notes}</p>
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

export default function LogPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-6 text-center">Loading...</div>}>
      <LogContent />
    </Suspense>
  );
}

