'use client';

// Client-side menu PDF generator — mirrors ios/Dinearound-app/Dinearound-app/Services/MediaStorage.swift's
// MenuPDFExporter (title, optional menu photo, itemized lines), using jsPDF instead of UIGraphicsPDFRenderer.
import { jsPDF } from 'jspdf';

export interface MenuLine {
  category: string;
  name: string;
  price: string;
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function imageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function generateMenuPDF(
  restaurantName: string,
  items: MenuLine[],
  menuImageBlob?: Blob | null
): Promise<Blob> {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = 50;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(`${restaurantName} — Menu`, margin, y);
  y += 30;

  if (menuImageBlob) {
    const dataUrl = await blobToDataURL(menuImageBlob);
    const { width, height } = await imageDimensions(dataUrl);
    const maxWidth = pageWidth - margin * 2;
    const aspect = height / Math.max(width, 1);
    const drawWidth = Math.min(maxWidth, width);
    const drawHeight = Math.min(drawWidth * aspect, 320);
    doc.addImage(dataUrl, 'JPEG', margin, y, drawWidth, drawHeight);
    y += drawHeight + 24;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  for (const item of items) {
    if (!item.name.trim()) continue;
    if (y > pageHeight - margin) {
      doc.addPage();
      y = 50;
    }
    doc.text(`${item.category} — ${item.name}  $${item.price}`, margin, y);
    y += 22;
  }

  return doc.output('blob');
}
