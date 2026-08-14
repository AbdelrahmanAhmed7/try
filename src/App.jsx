import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { landingData } from './data/landingData.js';
import StoreNavbar from './components/StoreNavbar.jsx';
import StoreHero from './components/StoreHero.jsx';
import ShopSection from './components/ShopSection.jsx';
import TrustSection from './components/TrustSection.jsx';
import FAQSection from './components/FAQSection.jsx';
import CountdownTimer from './components/CountdownTimer.jsx';
import { CheckoutSummaryBar, StickyCartBar } from './components/CartSummary.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { buildCatalog } from './data/catalog.js';
import { isOrderCompleted, ORDER_ID_KEY } from './utils/orderSession.js';
import { scrollToShop } from './utils/scrollToShop.js';

const StepConfirm = lazy(() => import('./components/StepConfirm.jsx'));

function getRoute() {
  return window.location.pathname;
}

function getCategoryFromHash() {
  const m = window.location.hash.match(/^#shop-(spread|cola|bundles)$/);
  return m ? m[1] : 'all';
}

function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function useRoute() {
  const [route, setRoute] = useState(getRoute);
  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);
  return route;
}

function SectionFallback({ minHeight = 200 }) {
  return <div className="section-fallback" aria-hidden="true" style={{ minHeight }} />;
}

function Benefits({ benefits }) {
  return (
    <section className="section benefits-section section-below-fold" id="benefits" aria-label="ليه Healthy & Tasty؟">
      <div className="section-intro centered">
        <span className="eyebrow">ليه Healthy & Tasty؟</span>
        <h2>اختيار صحي من غير ما تتنازل عن الطعم</h2>
      </div>
      <div className="benefits-band">
        {benefits.map((benefit) => (
          <div className="benefit-pill" key={benefit}>
            <span aria-hidden="true">✓</span>
            {benefit}
          </div>
        ))}
      </div>
    </section>
  );
}

function Audience({ audience }) { return null; }
function LoveReasons({ loveReasons }) { return null; }

function Footer({ brand, footer }) {
  return (
    <footer className="site-footer">
      <img src={brand.logo} alt={brand.name} loading="lazy" decoding="async" width={260} height={64} />
      <p>{brand.tagline}</p>
      <nav className="footer-nav" aria-label="روابط المتجر">
        <a href="#top">الرئيسية</a>
        <a href="#shop">تسوق الآن</a>
        <a href="#trust">ليه Healthy &amp; Tasty</a>
        <a href="#faq">الأسئلة الشائعة</a>
      </nav>
      <span>{footer.note}</span>
    </footer>
  );
}

function PurchaseSuccess({ onBack }) {
  return (
    <main className="funnel" dir="rtl">
      <div className="funnel-header">
        <button className="funnel-back-btn" type="button" onClick={onBack}>
          → رجوع للرئيسية
        </button>
        <img
          src={landingData.brand.logo}
          alt={landingData.brand.name}
          className="funnel-logo"
          decoding="async"
          width={160}
          height={40}
        />
      </div>
      <section className="step-screen">
        <div className="order-success">
          <div className="success-anim">
            <div className="success-circle" aria-hidden="true">✓</div>
          </div>
          <h2>تم تسجيل طلبك بنجاح! 🎉</h2>
          <p className="success-msg">{landingData.form.successMessage}</p>
          <div className="success-steps">
            <div className="success-step">
              <span className="success-step-num">1</span>
              <div>
                <strong>تأكيد الطلب</strong>
                <p>هيتواصل معاك فريقنا خلال ساعات لتأكيد الطلب</p>
              </div>
            </div>
            <div className="success-step">
              <span className="success-step-num">2</span>
              <div>
                <strong>التجهيز والشحن</strong>
                <p>بنجهز طلبك ونبعته مع أقرب شحنة</p>
              </div>
            </div>
            <div className="success-step">
              <span className="success-step-num">3</span>
              <div>
                <strong>الاستلام والدفع</strong>
                <p>تستلم طلبك وتدفع عند الباب</p>
              </div>
            </div>
          </div>
          <button type="button" className="confirm-order-btn" onClick={onBack}>
            العودة للرئيسية
          </button>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const route = useRoute();
  const cartRef = useRef([]);
  const [, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(getCategoryFromHash);
  const catalog = useMemo(() => buildCatalog(), []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  useEffect(() => {
    const onHashChange = () => {
      const cat = getCategoryFromHash();
      if (cat !== 'all') setActiveCategory(cat);
      const hash = window.location.hash;
      if (hash === '#shop' || hash.startsWith('#shop-')) {
        requestAnimationFrame(scrollToShop);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#shop' || hash.startsWith('#shop-')) {
      requestAnimationFrame(scrollToShop);
    }
  }, []);

  useEffect(() => {
    if (route === '/add_to_cart' && cartRef.current.length === 0) {
      navigate('/');
    }
  }, [route]);

  const goToCart = (items) => {
    cartRef.current = items;
    setCartItems(items);
    navigate('/add_to_cart');
  };

  const goToPurchase = () => {
    navigate('/purchase');
    // Clear the cart AFTER navigation is triggered so the confirm screen
    // doesn't flash empty before the route change takes effect.
    // This also ensures that if the user back-buttons from /purchase to
    // /add_to_cart, the empty-cart guard (line below) will redirect home.
    cartRef.current = [];
    setCartItems([]);
  };

  const goHome = () => {
    cartRef.current = [];
    setCartItems([]);
    navigate('/');
  };

  if (route === '/purchase') {
    return <PurchaseSuccess onBack={goHome} />;
  }

  if (route === '/add_to_cart') {
    // Guard against back-button re-entry after a completed order.
    // If the cart is empty (cleared by goToPurchase) OR the last session
    // order was already completed, redirect home. This prevents
    // re-submission of the same order while still allowing genuinely
    // new orders (user adds new items → new orderId → no completed flag).
    const lastOrderId = sessionStorage.getItem(ORDER_ID_KEY);
    if (cartRef.current.length === 0 || (lastOrderId && isOrderCompleted(lastOrderId))) {
      // Use navigate instead of showing null to ensure clean redirect
      if (route === '/add_to_cart') navigate('/');
      return null;
    }

    return (
      <main className="funnel" dir="rtl">
        <div className="funnel-header">
          <button className="funnel-back-btn" type="button" onClick={goHome}>
            → رجوع
          </button>
          <img
            src={landingData.brand.logo}
            alt={landingData.brand.name}
            className="funnel-logo"
            decoding="async"
            width={160}
            height={40}
          />
          <CountdownTimer variant="bar" />
        </div>
        <Suspense fallback={<SectionFallback minHeight={200} />}>
          <StepConfirm
            form={landingData.form}
            cartItems={cartRef.current}
            onBack={goHome}
            onSuccess={goToPurchase}
          />
        </Suspense>
      </main>
    );
  }

  return (
    <CartProvider catalog={catalog} onCheckout={goToCart}>
      <StoreNavbar brand={landingData.brand} nav={landingData.nav} />
      <main>
        <StickyCartBar />
        <StoreHero onSelectCategory={setActiveCategory} />
        <ShopSection activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <TrustSection />
        <FAQSection />
        <CheckoutSummaryBar />
      </main>
      <Footer brand={landingData.brand} footer={landingData.footer} />
    </CartProvider>
  );
}
