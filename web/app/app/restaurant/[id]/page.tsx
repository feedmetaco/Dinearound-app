'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Star, MapPin, BookOpen, ScanLine, FileText, Sparkles, Plus, X } from 'lucide-react';
import { seedRestaurants, priceSymbols, menuSeed } from '@/lib/seed-data';
import { useDineAroundStore } from '@/lib/local-store';
import { saveMedia, listMedia, deleteMedia, deleteMediaByKind, mediaObjectURL, MediaRecord } from '@/lib/media-db';
import { generateMenuPDF } from '@/lib/pdf';
import { FoodPhotoSection } from '@/components/photo-attachments';

interface EditableMenuItem {
  id: string;
  category: string;
  name: string;
  price: string;
}

export default function RestaurantDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const restaurantId = params.id;

  const restaurant = useMemo(() => seedRestaurants.find((r) => r.id === restaurantId), [restaurantId]);
  const isWishlisted = useDineAroundStore((s) => s.wishlistIds.includes(restaurantId));
  const toggleWishlist = useDineAroundStore((s) => s.toggleWishlist);
  const storedMenuItems = useDineAroundStore((s) => s.menuItems.filter((m) => m.restaurantId === restaurantId));
  const setMenuItems = useDineAroundStore((s) => s.setMenuItems);

  const [foodPhotos, setFoodPhotos] = useState<MediaRecord[]>([]);
  const [pendingFoodFiles, setPendingFoodFiles] = useState<File[]>([]);
  const [draftItems, setDraftItems] = useState<EditableMenuItem[]>([]);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [hasMenuPdf, setHasMenuPdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const refreshPhotos = () => {
    listMedia({ restaurantId, kind: 'foodPhoto' }).then(setFoodPhotos);
    listMedia({ restaurantId, kind: 'menuPDF' }).then((r) => setHasMenuPdf(r.length > 0));
  };

  useEffect(() => {
    refreshPhotos();
    setDraftItems(storedMenuItems.map((m) => ({ id: m.id, category: m.category, name: m.name, price: m.price })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const addFoodPhotos = async (files: File[]) => {
    await Promise.all(files.map((file) => saveMedia({ restaurantId, kind: 'foodPhoto', blob: file })));
    refreshPhotos();
  };

  const removeFoodPhoto = async (id: string) => {
    await deleteMedia(id);
    refreshPhotos();
  };

  const digitizeMenu = () => {
    const seed = menuSeed(restaurantId);
    setDraftItems(seed.map((item, i) => ({ id: `seed-${i}`, ...item })));
  };

  const saveMenuPdf = async () => {
    setSaving(true);
    try {
      setMenuItems(restaurantId, draftItems.filter((i) => i.name.trim()).map((i) => ({ category: i.category, name: i.name, price: i.price })));
      const pdfBlob = await generateMenuPDF(restaurant?.name ?? 'Restaurant', draftItems, menuFile);
      await deleteMediaByKind(restaurantId, 'menuPDF');
      if (menuFile) {
        await deleteMediaByKind(restaurantId, 'menuPhoto');
        await saveMedia({ restaurantId, kind: 'menuPhoto', blob: menuFile });
      }
      await saveMedia({ restaurantId, kind: 'menuPDF', blob: pdfBlob });
      setHasMenuPdf(true);
    } finally {
      setSaving(false);
    }
  };

  const viewMenuPdf = async () => {
    const records = await listMedia({ restaurantId, kind: 'menuPDF' });
    if (records[0]) setPdfPreviewUrl(mediaObjectURL(records[0]));
  };

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-sm font-semibold text-[var(--text-secondary)]">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 text-sm font-extrabold"
        style={{ color: 'var(--accent-coral)' }}
      >
        <ChevronLeft size={15} strokeWidth={3} />
        Back
      </button>

      <div
        className="mb-4 flex h-52 items-center justify-center rounded-[24px] text-7xl"
        style={{ background: 'var(--accent-coral-tint)' }}
      >
        {restaurant.emoji}
      </div>

      <p className="label-caps">{restaurant.cuisine}</p>
      <h1 className="font-display mt-0.5 text-2xl font-extrabold" style={{ color: 'var(--foreground)' }}>
        {restaurant.name}
      </h1>
      <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]">
        <MapPin size={13} strokeWidth={2.4} />
        {restaurant.address}
      </p>

      <div className="mt-3 flex gap-2">
        <span
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ background: 'color-mix(in srgb, var(--accent-gold) 16%, transparent)', color: 'var(--accent-gold-dark)' }}
        >
          <Star size={11} strokeWidth={2.8} fill="currentColor" />
          {restaurant.rating.toFixed(1)}
        </span>
        <span
          className="rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ background: 'var(--green-tint)', color: 'var(--brand-green-dark)' }}
        >
          {priceSymbols(restaurant.priceLevel)}
        </span>
        <span className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: 'var(--chip-fill)', color: 'var(--text-secondary)' }}>
          {restaurant.distanceKm.toFixed(1)} km away
        </span>
      </div>

      {/* Sticky footer CTA on mobile keeps primary actions reachable while scrolling menu/photos */}
      <div className="sticky top-[64px] z-30 mt-4 flex gap-2.5 rounded-2xl bg-[var(--background)]/95 py-1 backdrop-blur">
        <button
          onClick={() => router.push(`/app/log?restaurant=${encodeURIComponent(restaurant.name)}&id=${restaurant.id}`)}
          className="btn-primary flex flex-1 items-center justify-center gap-2 py-3.5 text-sm"
        >
          <BookOpen size={14} strokeWidth={2.6} />
          Log Visit
        </button>
        <button
          onClick={() => toggleWishlist(restaurant.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-3.5 text-sm font-bold"
          style={{
            borderColor: 'var(--accent-gold)',
            color: 'var(--accent-gold-dark)',
            background: isWishlisted ? 'color-mix(in srgb, var(--accent-gold) 12%, transparent)' : 'transparent',
          }}
        >
          <Star size={14} strokeWidth={2.6} fill={isWishlisted ? 'var(--accent-gold-dark)' : 'none'} />
          {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      <div className="mt-6">
        <FoodPhotoSection
          existing={foodPhotos.map((p) => ({ id: p.id, url: mediaObjectURL(p) }))}
          pendingFiles={pendingFoodFiles}
          onAddFiles={(files) => {
            setPendingFoodFiles([]);
            addFoodPhotos(files);
          }}
          onRemovePending={() => {}}
          onRemoveExisting={removeFoodPhoto}
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-base font-black" style={{ color: 'var(--foreground)' }}>
          Menu
        </h2>

        <button
          onClick={() => document.getElementById('menu-photo-input')?.click()}
          className="mb-2.5 flex h-[110px] w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[16px]"
          style={{ background: 'var(--chip-fill)', border: '2px solid var(--input-border)' }}
        >
          {menuFile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={URL.createObjectURL(menuFile)} alt="Menu preview" className="h-full w-full object-cover" />
          ) : (
            <>
              <ScanLine size={20} strokeWidth={1.8} className="text-[var(--text-secondary)]" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Add a menu photo (optional)</span>
            </>
          )}
        </button>
        <input
          id="menu-photo-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setMenuFile(e.target.files?.[0] ?? null)}
        />

        <button onClick={digitizeMenu} className="btn-green mb-2.5 flex w-full items-center justify-center gap-2 py-3 text-sm text-white">
          <Sparkles size={13} strokeWidth={2.6} />
          Digitize Menu
        </button>

        <div className="space-y-2">
          {draftItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 rounded-[14px] p-2.5" style={{ background: 'var(--chip-fill)' }}>
              <input
                value={item.category}
                onChange={(e) => setDraftItems((prev) => prev.map((it, i) => (i === index ? { ...it, category: e.target.value } : it)))}
                placeholder="Cat"
                className="w-16 bg-transparent text-xs font-semibold outline-none"
                style={{ color: 'var(--foreground)' }}
              />
              <input
                value={item.name}
                onChange={(e) => setDraftItems((prev) => prev.map((it, i) => (i === index ? { ...it, name: e.target.value } : it)))}
                placeholder="Dish"
                className="flex-1 bg-transparent text-sm font-semibold outline-none"
                style={{ color: 'var(--foreground)' }}
              />
              <input
                value={item.price}
                onChange={(e) => setDraftItems((prev) => prev.map((it, i) => (i === index ? { ...it, price: e.target.value } : it)))}
                placeholder="$"
                className="w-10 bg-transparent text-sm font-semibold outline-none"
                style={{ color: 'var(--accent-coral)' }}
              />
              <button onClick={() => setDraftItems((prev) => prev.filter((_, i) => i !== index))} style={{ color: 'var(--destructive)' }}>
                <X size={15} strokeWidth={2.8} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setDraftItems((prev) => [...prev, { id: `new-${Date.now()}`, category: 'Mains', name: '', price: '' }])}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[18px] border-2 border-dashed py-3 text-sm font-semibold"
          style={{ borderColor: 'var(--input-border)', color: 'var(--text-secondary)' }}
        >
          <Plus size={13} strokeWidth={2.6} />
          Add dish
        </button>

        {(draftItems.length > 0 || menuFile) && (
          <div className="mt-3 flex gap-2.5">
            <button onClick={saveMenuPdf} disabled={saving} className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 text-sm disabled:opacity-50">
              <FileText size={13} strokeWidth={2.6} />
              {saving ? 'Saving…' : 'Save PDF to restaurant'}
            </button>
            {hasMenuPdf && (
              <button onClick={viewMenuPdf} className="btn-outline px-4 py-3 text-sm">
                View PDF
              </button>
            )}
          </div>
        )}
      </div>

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
