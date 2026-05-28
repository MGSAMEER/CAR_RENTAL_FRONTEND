import { getApiBaseUrl } from '@/lib/env';

interface HeadProps {
  params: { id: string };
}

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://driveeasy.com').replace(/\/$/, '');
const API_BASE_URL = getApiBaseUrl();

async function getCar(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data ?? null;
  } catch (error) {
    console.error('[HEAD] Failed to fetch car metadata', error);
    return null;
  }
}

export default async function Head({ params }: HeadProps) {
  const car = await getCar(params.id);
  const pageUrl = `${SITE_URL}/cars/${params.id}`;
  const title = car ? `${car.name} | DriveEasy` : 'DriveEasy | Car Rental';
  const description = car?.description
    ? car.description
    : 'Book premium cars with DriveEasy. Fast, reliable, and affordable car rental across India.';
  const imageUrl = car?.imageUrl || '/opengraph-image.png';
  const schema = car
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: car.name,
        description,
        sku: car.id,
        image: car.imageUrl ? [car.imageUrl] : undefined,
        brand: {
          '@type': 'Brand',
          name: car.brand,
        },
        offers: {
          '@type': 'Offer',
          url: pageUrl,
          priceCurrency: 'INR',
          price: String(car.pricePerDay),
          availability: car.availability
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating:
          car.ratingAvg && Number(car.ratingAvg) > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: Number(car.ratingAvg).toFixed(1),
                reviewCount: car.reviewCount ?? 0,
              }
            : undefined,
      }
    : null;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              Object.fromEntries(
                Object.entries(schema).filter(([, value]) => value !== undefined),
              ),
            ),
          }}
        />
      )}
    </>
  );
}
