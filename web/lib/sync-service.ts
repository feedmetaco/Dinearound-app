'use client';

import {
  apiAddWishlist,
  apiCreateVisit,
  apiDeleteVisit,
  apiGetVisits,
  apiGetWishlistIds,
  apiRemoveWishlist,
  apiSaveMenuItems,
  apiUpdateVisit,
  apiUploadMedia,
  apiVisitToLocal,
  isApiEnabled,
} from '@/lib/api-client';
import { useDineAroundStore, LocalVisit } from '@/lib/local-store';

/** Pull server state into zustand after login */
export async function syncFromServer(): Promise<void> {
  if (!isApiEnabled()) return;

  const [visits, wishlistIds] = await Promise.all([apiGetVisits(), apiGetWishlistIds()]);

  useDineAroundStore.setState({
    visits: visits.map(apiVisitToLocal),
    wishlistIds,
  });
}

export async function syncVisitToServer(
  visit: Omit<LocalVisit, 'createdAt'> & { createdAt?: string },
  isNew: boolean
): Promise<void> {
  if (!isApiEnabled()) return;

  if (isNew) {
    await apiCreateVisit({
      id: visit.id,
      restaurantId: visit.restaurantId || undefined,
      restaurantName: visit.restaurantName,
      visitDate: visit.visitDate,
      rating: visit.rating,
      notes: visit.notes,
    });
  } else {
    await apiUpdateVisit(visit.id, {
      restaurantId: visit.restaurantId,
      restaurantName: visit.restaurantName,
      visitDate: visit.visitDate,
      rating: visit.rating,
      notes: visit.notes,
    });
  }
}

export async function syncDeleteVisitFromServer(id: string): Promise<void> {
  if (!isApiEnabled()) return;
  await apiDeleteVisit(id);
}

export async function syncWishlistToggle(restaurantId: string, add: boolean): Promise<void> {
  if (!isApiEnabled()) return;
  if (add) await apiAddWishlist(restaurantId);
  else await apiRemoveWishlist(restaurantId);
}

export async function syncMenuToServer(
  restaurantId: string,
  items: { category: string; name: string; price: string }[]
): Promise<void> {
  if (!isApiEnabled()) return;
  await apiSaveMenuItems(restaurantId, items);
}

export async function syncMediaUpload(params: {
  file: Blob;
  fileName: string;
  restaurantId: string;
  visitId?: string;
  kind: 'food_photo' | 'menu_photo' | 'menu_pdf';
}): Promise<void> {
  if (!isApiEnabled()) return;
  await apiUploadMedia(params);
}
