import { useEffect, useRef, useState } from 'react';

/**
 * Storefront navigation: brand trust strip + store navbar.
 *
 * Desktop: logo, category links, cart icon, primary CTA.
 * Mobile (<=980px): hamburger menu with category links, cart and CTA.
 *
 * Expected props:
 * { brand: { logo, name }, nav: [{ label, href }] }
 */
export default function StoreNavbar({ brand, nav }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDocClick = (e) => {
      if (
        navRef.current &&
        btnRef.current &&
        !navRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onDocClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onDocClick);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <div className="promo-bar">
        <span>🚚 توصيل مجاني على معظم العروض</span>
        <span>•</span>
        <span>💳 الدفع عند الاستلام</span>
        <span>•</span>
        <span>🌿 منتجات صحية مختارة</span>
      </div>
      <header className="site-header">
        <a className="brand-link" href="#top" aria-label={brand.name}>
          <img src={brand.logo} alt={brand.name} decoding="async" width={160} height={40} />
        </a>
        <nav className="main-nav" aria-label="روابط المتجر">
          {nav.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-cart" href="#shop" aria-label="السلة">
            🛒
          </a>
          <a className="header-cta" href="#shop">
            اطلب الآن 🛒
          </a>
          <button
            type="button"
            ref={btnRef}
            className={`store-nav-toggle${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="store-nav-toggle-bar" aria-hidden="true" />
            <span className="store-nav-toggle-bar" aria-hidden="true" />
            <span className="store-nav-toggle-bar" aria-hidden="true" />
          </button>
        </div>
        <nav
          id="mobile-nav"
          ref={navRef}
          className={`mobile-nav${open ? ' is-open' : ''}`}
          aria-label="قائمة الجوال"
        >
          {nav.map((item) => (
            <a key={item.label} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
          <a href="#shop" onClick={close}>
            🛒 السلة
          </a>
          <a className="mobile-nav__cta" href="#shop" onClick={close}>
            اطلب الآن
          </a>
        </nav>
      </header>
    </>
  );
}
