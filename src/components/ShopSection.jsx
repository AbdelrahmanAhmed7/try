/**
 * ShopSection — ONE unified shopping area.
 *
 * activeCategory / onCategoryChange are lifted to App so the Hero
 * category selector drives the same state.
 *
 * All cart / checkout / pricing / flavor logic is untouched.
 */
import { useEffect, useMemo } from 'react';
import { landingData } from '../data/landingData.js';
import OfferCard from './OfferCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { loadOfferImage } from '../utils/offerImages.js';

export const TABS = [
  { id: 'all',     label: 'الكل' },
  { id: 'spread',  label: 'Healthy Spread' },
  { id: 'cola',    label: 'Healthy Cola' },
  { id: 'bundles', label: 'Bundles' },
];

const CAT_LABEL = {
  spread:  'Healthy Spread',
  cola:    'Healthy Cola',
  bundles: 'Bundles',
};

function buildItems() {
  const spread = landingData.offers.map((offer) => ({
    tabId: 'spread',
    offer,
  }));

  const cola = landingData.colaCategory.offers.map((offer) => ({
    tabId: 'cola',
    offer,
  }));

  const bundleOffers = landingData.bundleSection.offers ?? [];
  const bundles = bundleOffers.map((offer) => ({ tabId: 'bundles', offer }));

  // Featured deal leads the "all" grid so it's visible immediately.
  return [...bundles, ...spread, ...cola];
}

const ALL_ITEMS = buildItems();

export default function ShopSection({ activeCategory, onCategoryChange }) {
  const { cart, addItem, changeQty } = useCart();

  /* preload spread offer images on mount */
  useEffect(() => {
    landingData.offers.forEach((o) => loadOfferImage(o.id));
  }, []);

  const filtered = useMemo(
    () => activeCategory === 'all'
      ? ALL_ITEMS
      : ALL_ITEMS.filter((item) => item.tabId === activeCategory),
    [activeCategory],
  );

  const showCatLabel = activeCategory === 'all';

  return (
    <section className="ht-shop" id="shop" dir="rtl" aria-label="تسوق المنتجات">

      {/* ── Section header ── */}
      <div className="ht-shop__header">
        <h2 className="ht-shop__title">تسوق منتجاتنا</h2>
      </div>

      {/* ── Category tabs ── */}
      <div className="ht-tabs" role="tablist" aria-label="تصفية المنتجات">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`ht-tab${activeCategory === tab.id ? ' ht-tab--active' : ''}`}
            aria-selected={activeCategory === tab.id}
            onClick={() => onCategoryChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Product grid ── */}
      {filtered.length > 0 ? (
        <div className="ht-grid" key={activeCategory} role="list">
          {filtered.map((item) => (
            <OfferCard
              key={item.offer.id}
              offer={item.offer}
              qty={cart[item.offer.id] || 0}
              onAdd={addItem}
              onChangeQty={changeQty}
              categoryLabel={showCatLabel ? CAT_LABEL[item.tabId] : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="ht-empty">
          <p>لا توجد عروض متاحة حالياً في هذه الفئة.</p>
        </div>
      )}

    </section>
  );
}
