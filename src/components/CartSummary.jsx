import { formatPrice } from '../data/landingData.js';
import { preloadCheckout } from '../utils/preloadCheckout.js';
import { useCart } from '../context/CartContext.jsx';

function warmCheckout() {
  preloadCheckout();
}

/** Sticky top bar shown whenever the shared cart has items. */
export function StickyCartBar() {
  const { cartCount, subtotal, shipping, grandTotal, checkout } = useCart();

  if (cartCount === 0) return null;

  return (
    <div className="offer-sticky-bar" role="status" aria-live="polite">
      <div className="offer-sticky-info">
        <span className="offer-sticky-title">
          {cartCount === 1 ? 'منتج واحد في السلة' : `${cartCount} منتجات في السلة`}
        </span>
        <span className="offer-sticky-price">{formatPrice(grandTotal)}</span>
        <span className="offer-sticky-shipping">
          منتجات {formatPrice(subtotal)} + {shipping > 0 ? `شحن ${formatPrice(shipping)}` : 'شحن مجاناً'} 🚚
        </span>
      </div>
      <button
        type="button"
        className="offer-sticky-cta"
        onClick={checkout}
        onMouseEnter={warmCheckout}
        onFocus={warmCheckout}
        onTouchStart={warmCheckout}
      >
        أكمل الطلب ←
      </button>
    </div>
  );
}

/** Full checkout summary (rows + CTA) shown near the end of the page. */
export function CheckoutSummaryBar() {
  const { cartCount, subtotal, shipping, grandTotal, checkout } = useCart();

  if (cartCount === 0) return null;

  return (
    <div className="cart-checkout-panel" aria-live="polite">
      <div className="checkout-summary-rows">
        <div className="checkout-summary-row">
          <span>المنتجات ({cartCount})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="checkout-summary-row">
          <span>🚚 الشحن</span>
          <span>{shipping > 0 ? formatPrice(shipping) : 'مجاناً'}</span>
        </div>
        <div className="checkout-summary-row checkout-summary-total">
          <span>الإجمالي</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      </div>
      <button
        type="button"
        className="next-btn landing-next-btn"
        onClick={checkout}
        onMouseEnter={warmCheckout}
        onFocus={warmCheckout}
        onTouchStart={warmCheckout}
      >
        أكمل الطلب ←
      </button>
    </div>
  );
}
