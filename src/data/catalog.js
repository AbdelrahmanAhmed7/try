import { landingData } from './landingData.js';

/**
 * Unified purchasable-item catalog keyed by offer id.
 *
 * Every add-to-cart widget across all sections writes into ONE shared cart,
 * so the catalog must know about every purchasable offer:
 *   - Healthy Spread offers  (landingData.offers)
 *   - Healthy Cola offers    (landingData.colaCategory.offers)
 *   - Bundles                (landingData.bundleSection.offer, if defined)
 *
 * When a new section introduces buyable items, register them here too.
 */
export function buildCatalog() {
  const catalog = {};
  const add = (offer) => {
    if (offer && offer.id && !catalog[offer.id]) catalog[offer.id] = offer;
  };

  landingData.offers.forEach(add);
  landingData.colaCategory.offers.forEach(add);
  if (landingData.bundleSection.offer) add(landingData.bundleSection.offer);

  return catalog;
}
