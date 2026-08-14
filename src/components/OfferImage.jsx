import { useEffect, useState } from 'react';
import { loadOfferImage } from '../utils/offerImages.js';

export default function OfferImage({ offerId, alt, width = 90, height = 90, className = '', fallback }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadOfferImage(offerId).then((url) => {
      if (!cancelled && url) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [offerId]);

  const imgClass = className || '';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={imgClass}
      />
    );
  }

  if (fallback) {
    return (
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={imgClass}
      />
    );
  }

  return (
    <div
      className={`offer-img-placeholder ${className}`.trim()}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
