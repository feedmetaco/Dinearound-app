'use client';

// Client-side media storage for food photos + menu photo/PDF blobs.
// Mirrors ios/Dinearound-app/Dinearound-app/Services/MediaStorage.swift (local-first, no backend
// credentials required). Backed by IndexedDB via idb-keyval so blobs persist across reloads.
import { get, set, del } from 'idb-keyval';

export type MediaKind = 'foodPhoto' | 'menuPhoto' | 'menuPDF';

export interface MediaRecord {
  id: string;
  restaurantId: string;
  visitId?: string;
  kind: MediaKind;
  blob: Blob;
  createdAt: number;
}

const INDEX_KEY = 'dinearound-media-index';

function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `media-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function getIndex(): Promise<string[]> {
  return (await get(INDEX_KEY)) ?? [];
}

async function setIndex(ids: string[]): Promise<void> {
  await set(INDEX_KEY, ids);
}

export async function saveMedia(params: {
  restaurantId: string;
  visitId?: string;
  kind: MediaKind;
  blob: Blob;
}): Promise<MediaRecord> {
  const record: MediaRecord = {
    id: uid(),
    restaurantId: params.restaurantId,
    visitId: params.visitId,
    kind: params.kind,
    blob: params.blob,
    createdAt: Date.now(),
  };
  await set(`dinearound-media:${record.id}`, record);
  const index = await getIndex();
  await setIndex([...index, record.id]);
  return record;
}

export async function listMedia(filter: {
  restaurantId?: string;
  visitId?: string;
  kind?: MediaKind;
}): Promise<MediaRecord[]> {
  const index = await getIndex();
  const records = (
    await Promise.all(index.map((id) => get<MediaRecord>(`dinearound-media:${id}`)))
  ).filter((r): r is MediaRecord => Boolean(r));
  return records
    .filter((r) => (filter.restaurantId ? r.restaurantId === filter.restaurantId : true))
    .filter((r) => (filter.visitId ? r.visitId === filter.visitId : true))
    .filter((r) => (filter.kind ? r.kind === filter.kind : true))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteMedia(id: string): Promise<void> {
  await del(`dinearound-media:${id}`);
  const index = await getIndex();
  await setIndex(index.filter((existing) => existing !== id));
}

export async function deleteMediaByKind(restaurantId: string, kind: MediaKind): Promise<void> {
  const matches = await listMedia({ restaurantId, kind });
  await Promise.all(matches.map((m) => deleteMedia(m.id)));
}

/** Creates an object URL for a blob. Caller is responsible for revoking it when done. */
export function mediaObjectURL(record: MediaRecord): string {
  return URL.createObjectURL(record.blob);
}

/** Upload to Cloudflare R2 via Worker when API is configured and user is signed in. */
export async function uploadMediaIfSynced(params: {
  file: Blob;
  fileName: string;
  restaurantId: string;
  visitId?: string;
  kind: 'food_photo' | 'menu_photo' | 'menu_pdf';
}): Promise<void> {
  const { apiUploadMedia, getAuthToken, isApiEnabled } = await import('@/lib/api-client');
  if (!isApiEnabled() || !getAuthToken()) return;
  await apiUploadMedia(params);
}
