/**
 * TrustSection — brand trust / reassurance strip.
 *
 * Placement: after ShopSection, before FAQ / Footer.
 * Data: from landingData.trust — all claims are verified
 *       against existing project data (SHIPPING_FEE=0, COD confirmed,
 *       product selection is brand messaging, easy order confirmed in
 *       success page flow).
 *
 * REMOVABLE: delete this file + its import/render in App.jsx.
 * All styles use ht-trust- prefix (isolated).
 * No cart / checkout logic touched.
 */
import { landingData } from '../data/landingData.js';

/* ── Minimal inline SVGs — no external dependency ── */
const ICONS = {
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" rx="2"/>
      <path d="M16 8h4l3 5v4h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  cash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="13" rx="2"/>
      <circle cx="12" cy="12.5" r="3"/>
      <path d="M6 9.5h.01M18 9.5h.01"/>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2
               6.4a7 7 0 0 1-7 7H11z"/>
      <path d="M5 22c2-2 4-3.5 6-6"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
};

export default function TrustSection() {
  const items = landingData.trust;

  return (
    <section className="ht-trust" dir="rtl" aria-label="ليه Healthy &amp; Tasty؟" id="trust">
      <div className="ht-trust__inner">

        <div className="ht-trust__header">
          <h2 className="ht-trust__heading">ليه Healthy &amp; Tasty؟</h2>
          <p className="ht-trust__sub">اختيارات صحية بطعم تحبه، وتجربة شراء بسيطة وواضحة.</p>
        </div>

        <ul className="ht-trust__grid" role="list">
          {items.map((item, i) => (
            <li key={item.id} className="ht-trust__item">
              {i < items.length - 1 && (
                <span className="ht-trust__sep" aria-hidden="true" />
              )}
              <span className="ht-trust__icon" aria-hidden="true">
                {ICONS[item.icon]}
              </span>
              <div className="ht-trust__text">
                <strong className="ht-trust__title">{item.title}</strong>
                <p className="ht-trust__desc">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
