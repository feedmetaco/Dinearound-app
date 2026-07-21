'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, X, Star, Pencil, Trash2, Share2, BookOpen } from 'lucide-react';
import { useDineAroundStore, LocalVisit } from '@/lib/local-store';
import { saveMedia, listMedia, deleteMediaByKind, mediaObjectURL, MediaRecord, uploadMediaIfSynced } from '@/lib/media-db';
import { generateMenuPDF } from '@/lib/pdf';
import { resolveRestaurantId, menuSeed } from '@/lib/seed-data';
import { FoodPhotoSection, MenuPdfSection } from '@/components/photo-attachments';
import { syncDeleteVisitFromServer, syncMediaUpload, syncMenuToServer, syncVisitToServer } from '@/lib/sync-service';

interface DraftState {
  restaurantName: string;
  restaurantId?: string;
  visitDate: string;
  rating: number;
  notes: string;
  editingVisitId?: string;
}

function emptyDraft(): DraftState {
  return { restaurantName: '', visitDate: new Date().toISOString().slice(0, 10), rating: 0, notes: '' };
}

function LogContent() {
  const searchParams = useSearchParams();
  const visits = useDineAroundStore((s) => s.visits);
  const upsertVisit = useDineAroundStore((s) => s.upsertVisit);
  const deleteVisit = useDineAroundStore((s) => s.deleteVisit);
  const setMenuItems = useDineAroundStore((s) => s.setMenuItems);
  const isGuest = useDineAroundStore((s) => s.isGuest);
  const isAuthenticated = useDineAroundStore((s) => s.isAuthenticated);

  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<DraftState>(emptyDraft());
  const [pendingFoodFiles, setPendingFoodFiles] = useState<File[]>([]);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [savingPdf, setSavingPdf] = useState(false);
  const [hasMenuPdfMap, setHasMenuPdfMap] = useState<Record<string, boolean>>({});
  const [photosByVisit, setPhotosByVisit] = useState<Record<string, MediaRecord[]>>({});
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const initialRestaurant = searchParams.get('restaurant') || '';
  const initialId = searchParams.get('id') || undefined;
  const openBlank = searchParams.get('new') === '1';

  useEffect(() => {
    if (initialRestaurant) {
      setDraft({ ...emptyDraft(), restaurantName: initialRestaurant, restaurantId: initialId });
      setShowForm(true);
    } else if (openBlank) {
      setDraft(emptyDraft());
      setShowForm(true);
    }
  }, [initialRestaurant, initialId, openBlank]);

  const draftRestaurantId = useMemo(
    () => resolveRestaurantId(draft.restaurantName, draft.restaurantId),
    [draft.restaurantName, draft.restaurantId]
  );

  useEffect(() => {
    listMedia({ restaurantId: draftRestaurantId, kind: 'menuPDF' }).then((records) =>
      setHasMenuPdfMap((prev) => ({ ...prev, [draftRestaurantId]: records.length > 0 }))
    );
  }, [draftRestaurantId]);

  useEffect(() => {
    visits.forEach((visit) => {
      const rid = visit.restaurantId || resolveRestaurantId(visit.restaurantName);
      listMedia({ restaurantId: rid, visitId: visit.id, kind: 'foodPhoto' }).then((records) =>
        setPhotosByVisit((prev) => ({ ...prev, [visit.id]: records }))
      );
    });
  }, [visits]);

  const resetForm = () => {
    setShowForm(false);
    setDraft(emptyDraft());
    setPendingFoodFiles([]);
    setMenuFile(null);
  };

  const handleSaveVisit = async () => {
    const name = draft.restaurantName.trim();
    if (!name) return;
    const restaurantId = draftRestaurantId;
    const isNew = !draft.editingVisitId;
    const visitId = upsertVisit({
      id: draft.editingVisitId,
      restaurantId,
      restaurantName: name,
      visitDate: draft.visitDate,
      rating: draft.rating,
      notes: draft.notes,
    });

    if (isAuthenticated && !isGuest) {
      await syncVisitToServer(
        {
          id: visitId,
          restaurantId,
          restaurantName: name,
          visitDate: draft.visitDate,
          rating: draft.rating,
          notes: draft.notes,
        },
        isNew
      ).catch(() => {});
    }

    await Promise.all(
      pendingFoodFiles.map(async (file) => {
        await saveMedia({ restaurantId, visitId, kind: 'foodPhoto', blob: file });
        if (isAuthenticated && !isGuest) {
          await uploadMediaIfSynced({
            file,
            fileName: file.name,
            restaurantId,
            visitId,
            kind: 'food_photo',
          }).catch(() => {});
        }
      })
    );

    resetForm();
  };

  const handleSaveMenuPdf = async () => {
    if (!menuFile) return;
    setSavingPdf(true);
    try {
      const restaurantId = draftRestaurantId;
      const seed = menuSeed(restaurantId);
      setMenuItems(restaurantId, seed);
      const pdfBlob = await generateMenuPDF(draft.restaurantName || 'Restaurant', seed, menuFile);
      await deleteMediaByKind(restaurantId, 'menuPDF');
      await deleteMediaByKind(restaurantId, 'menuPhoto');
      await saveMedia({ restaurantId, kind: 'menuPhoto', blob: menuFile });
      await saveMedia({ restaurantId, kind: 'menuPDF', blob: pdfBlob });
      if (isAuthenticated && !isGuest) {
        await syncMediaUpload({
          file: menuFile,
          fileName: menuFile.name || 'menu.jpg',
          restaurantId,
          kind: 'menu_photo',
        }).catch(() => {});
        await syncMediaUpload({
          file: pdfBlob,
          fileName: 'menu.pdf',
          restaurantId,
          kind: 'menu_pdf',
        }).catch(() => {});
        await syncMenuToServer(restaurantId, seed).catch(() => {});
      }
      setHasMenuPdfMap((prev) => ({ ...prev, [restaurantId]: true }));
    } finally {
      setSavingPdf(false);
    }
  };

  const handleViewMenuPdf = async () => {
    const records = await listMedia({ restaurantId: draftRestaurantId, kind: 'menuPDF' });
    if (records[0]) setPdfPreviewUrl(mediaObjectURL(records[0]));
  };

  const shareVisit = async (visit: LocalVisit) => {
    const lines = [`${visit.restaurantName} — visited ${new Date(visit.visitDate).toLocaleDateString()}`];
    if (visit.rating > 0) lines[0] += `, ${visit.rating}/5 ★`;
    if (visit.notes) lines.push(`"${visit.notes}"`);
    lines.push('Shared from DineAround');
    const text = lines.join('\n');
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-extrabold" style={{ color: 'var(--foreground)' }}>
            Visit Log
          </h2>
          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">Your dining history, one visit at a time</p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : (setDraft(emptyDraft()), setShowForm(true)))}
          className="btn-primary flex items-center gap-1.5 px-4 py-2.5 text-sm"
        >
          {showForm ? <X size={13} strokeWidth={2.8} /> : <Plus size={13} strokeWidth={2.8} />}
          {showForm ? 'Cancel' : 'Log Visit'}
        </button>
      </div>

      {showForm && (
        <div className="card-surface mb-5 space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              Restaurant Name *
            </label>
            <input
              value={draft.restaurantName}
              onChange={(e) => setDraft({ ...draft, restaurantName: e.target.value })}
              className="input-field w-full px-3 py-3 text-sm"
              placeholder="Restaurant"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              Visit Date *
            </label>
            <input
              type="date"
              value={draft.visitDate}
              onChange={(e) => setDraft({ ...draft, visitDate: e.target.value })}
              className="input-field w-full px-3 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              Rating
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setDraft({ ...draft, rating: star })}>
                  <Star
                    size={26}
                    strokeWidth={1.8}
                    fill={star <= draft.rating ? 'var(--accent-gold)' : 'none'}
                    style={{ color: star <= draft.rating ? 'var(--accent-gold)' : 'var(--input-border)' }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              Notes
            </label>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={3}
              className="input-field w-full px-3 py-3 text-sm"
              placeholder="What did you think?"
            />
          </div>

          <FoodPhotoSection
            existing={[]}
            pendingFiles={pendingFoodFiles}
            onAddFiles={(files) => setPendingFoodFiles((prev) => [...prev, ...files])}
            onRemovePending={(index) => setPendingFoodFiles((prev) => prev.filter((_, i) => i !== index))}
          />

          <MenuPdfSection
            menuFile={menuFile}
            onFileChange={setMenuFile}
            hasSavedPDF={Boolean(hasMenuPdfMap[draftRestaurantId])}
            saving={savingPdf}
            onSavePDF={handleSaveMenuPdf}
            onViewPDF={handleViewMenuPdf}
          />

          <div className="flex gap-2.5 pt-1">
            <button onClick={handleSaveVisit} className="btn-primary flex-1 py-3 text-sm">
              {draft.editingVisitId ? 'Update Visit' : 'Save Visit'}
            </button>
            <button onClick={resetForm} className="btn-outline flex-1 py-3 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {visits.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'var(--accent-coral-tint)' }}>
            <BookOpen size={28} strokeWidth={1.8} style={{ color: 'var(--accent-coral)' }} />
          </div>
          <p className="mt-1 text-base font-extrabold" style={{ color: 'var(--foreground)' }}>
            No visits logged yet
          </p>
          <p className="max-w-xs text-sm font-semibold text-[var(--text-secondary)]">
            Tap &quot;Log Visit&quot; to record your first meal out.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
            <div key={visit.id} className="card-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="label-caps">
                    {new Date(visit.visitDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <h3 className="text-base font-extrabold" style={{ color: 'var(--foreground)' }}>
                    {visit.restaurantName}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <button onClick={() => shareVisit(visit)} aria-label="Share visit">
                    <Share2 size={15} strokeWidth={2.2} />
                  </button>
                  <button
                    onClick={() =>
                      (setDraft({
                        restaurantName: visit.restaurantName,
                        restaurantId: visit.restaurantId,
                        visitDate: visit.visitDate,
                        rating: visit.rating,
                        notes: visit.notes,
                        editingVisitId: visit.id,
                      }),
                      setShowForm(true))
                    }
                    aria-label="Edit visit"
                  >
                    <Pencil size={15} strokeWidth={2.2} />
                  </button>
                  <button
                    onClick={async () => {
                      await syncDeleteVisitFromServer(visit.id).catch(() => {});
                      deleteVisit(visit.id);
                    }}
                    aria-label="Delete visit"
                  >
                    <Trash2 size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              {visit.rating > 0 && (
                <div
                  className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ background: 'color-mix(in srgb, var(--accent-gold) 16%, transparent)', color: 'var(--accent-gold-dark)' }}
                >
                  {Array.from({ length: visit.rating }).map((_, i) => (
                    <Star key={i} size={9} strokeWidth={3} fill="currentColor" />
                  ))}
                  {visit.rating}/5
                </div>
              )}

              {visit.notes && (
                <p className="mt-2 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  {visit.notes}
                </p>
              )}

              {(photosByVisit[visit.id]?.length ?? 0) > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {photosByVisit[visit.id]!.map((photo) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={photo.id}
                      src={mediaObjectURL(photo)}
                      alt="Food"
                      className="h-16 w-16 shrink-0 rounded-[10px] object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPdfPreviewUrl(null)}>
          <div className="h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <iframe src={pdfPreviewUrl} className="h-full w-full" title="Menu PDF" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-6 text-center">Loading...</div>}>
      <LogContent />
    </Suspense>
  );
}
