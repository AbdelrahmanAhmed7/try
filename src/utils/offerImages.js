const loaders = {
  'two-jars':   () => import('../assets/el3ard.webp'),
  'three-jars': () => import('../assets/3pieces.webp'),
  'four-jars':  () => import('../assets/4pieces.webp'),
};

const cache = new Map();

export function loadOfferImage(offerId) {
  const load = loaders[offerId];
  if (!load) return Promise.resolve(null);
  if (!cache.has(offerId)) {
    cache.set(offerId, load().then((m) => m.default));
  }
  return cache.get(offerId);
}
