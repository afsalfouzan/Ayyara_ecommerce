import sharp from 'sharp';
import { cheapestVariant, getProductBySlug } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { og, ogCard, OgLogo, ogSize } from '@/lib/og';
import { site } from '@/lib/site';

export const alt = `${site.name} perfume`;
export const size = ogSize;
// JPEG: a photo card is several times smaller than as PNG, and chat apps skip heavy previews.
export const contentType = 'image/jpeg';

/** Photos are stored as WebP, which the card renderer can't read, so the first one is converted here. */
async function photoDataUrl(src: string) {
  try {
    const response = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const jpeg = await sharp(Buffer.from(await response.arrayBuffer())).resize(630, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
  } catch {
    return null;
  }
}

/** Share card for a perfume: its photo, name, sizes and starting price. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) {
    return toJpeg(ogCard(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <OgLogo height={250} />
      </div>,
    ));
  }
  const photo = product.images[0] ? await photoDataUrl(product.images[0].src) : null;
  const cheapest = cheapestVariant(product);
  const sizes = product.variants.map((variant) => `${variant.sizeMl} ml`).join('  ·  ');

  const card = ogCard(
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {photo && <img src={photo} width={630} height={630} alt="" style={{ objectFit: 'cover' }} />}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: photo ? '0 56px' : '0 110px' }}>
        <OgLogo height={photo ? 92 : 120} />
        <div style={{ marginTop: 44, fontSize: 22, letterSpacing: 7, textTransform: 'uppercase', color: og.gold }}>{product.concentration}</div>
        <div style={{ marginTop: 14, fontSize: product.name.length > 18 ? 58 : 72, lineHeight: 1.05 }}>{product.name}</div>
        <div style={{ marginTop: 26, fontSize: 26, color: '#d6d3d1' }}>{sizes}</div>
        {cheapest && (
          <div style={{ marginTop: 14, fontSize: 34 }}>{`${product.variants.length > 1 ? 'From ' : ''}${formatPrice(cheapest.pricePaise)}`}</div>
        )}
      </div>
    </div>,
  );
  return toJpeg(card);
}

async function toJpeg(card: Response) {
  const jpeg = await sharp(Buffer.from(await card.arrayBuffer())).jpeg({ quality: 86 }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
