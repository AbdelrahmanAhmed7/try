/**
 * StoreHero — store entrance with category selector.
 *
 * Structure:
 *   Brand label · Short headline · One description line
 *   ↓
 *   3 visual category tiles (full-bleed images, no white card boxes)
 *
 * Clicking a tile:
 *   1. Calls onSelectCategory(id) → lifts state to App
 *   2. Smooth-scrolls to #shop
 *
 * No countdown. No trust cards. No product collage. No giant CTA.
 */
import spreadImg from '../assets/1.webp';
import colaImg   from '../assets/cola/products/healthy_cola.webp';
import bundleImg from '../assets/bundle/bundle.webp';
import { scrollToShop } from '../utils/scrollToShop.js';

const CATEGORIES = [
  {
    id:      'spread',
    label:   'Healthy Spread',
    sub:     'سبريد · زبدة فول سوداني',
    image:   spreadImg,
    accent:  '#5f2d91',
    cta:     'تسوق السبريد',
  },
  {
    id:      'cola',
    label:   'Healthy Cola',
    sub:     '0 سكر · 0 سعرات',
    image:   colaImg,
    accent:  '#4f8d42',
    cta:     'تسوق الكولا',
  },
  {
    id:      'bundles',
    label:   'Bundles',
    sub:     'أكتر وادفع أقل',
    image:   bundleImg,
    accent:  '#c07a00',
    cta:     'شوف الباقات',
  },
];

export default function StoreHero({ onSelectCategory }) {
  function handleSelect(id) {
    onSelectCategory(id);
    requestAnimationFrame(scrollToShop);
  }

  return (
    <section className="se-hero" id="top" dir="rtl" aria-label="Healthy &amp; Tasty — اختار فئة">

      {/* ── Brand intro ── */}
      <div className="se-hero__intro">
        <span className="se-eyebrow">Healthy &amp; Tasty</span>
        <h1 className="se-hero__headline">اختار اللي يناسبك</h1>
        <p className="se-hero__desc">
          منتجات صحية بطعم تحبه — حدد العرض اللي يناسبك واطلب دلوقتي.
        </p>
      </div>

      {/* ── Category selector ── */}
      <div className="se-cats" role="list" aria-label="فئات المتجر">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="se-cat"
            style={{ '--cat-accent': cat.accent }}
            onClick={() => handleSelect(cat.id)}
            role="listitem"
            aria-label={`تسوق ${cat.label}`}
          >
            {/* Full-bleed image */}
            <div className="se-cat__img">
              <img
                src={cat.image}
                alt={cat.label}
                width={600}
                height={800}
                loading={cat.id === 'spread' ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={cat.id === 'spread' ? 'high' : 'auto'}
              />
            </div>

            {/* Overlay text */}
            <div className="se-cat__overlay">
              <span className="se-cat__sub">{cat.sub}</span>
              <strong className="se-cat__name">{cat.label}</strong>
              <span className="se-cat__cta">{cat.cta} ←</span>
            </div>
          </button>
        ))}
      </div>

    </section>
  );
}
