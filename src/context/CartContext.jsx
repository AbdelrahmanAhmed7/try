import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  cartToCheckoutItems,
  getCartCount,
  getCartSubtotal,
  getGrandTotal,
  getItemsShipping,
  incrementCartItem,
  setCartItemQty,
} from '../utils/cartState.js';
import { metaParamsFromItems, metaParamsFromOffer, trackMetaEvent } from '../utils/metaPixel.js';
import { preloadCheckout } from '../utils/preloadCheckout.js';

const CartContext = createContext(null);

/**
 * Shared cart for the whole storefront. Every section reads/writes the same
 * cart so the totals and checkout always reflect ALL sections combined.
 *
 * Props:
 *   catalog     — object map of offerId -> offer (see src/data/catalog.js)
 *   onCheckout  — (items) => void, called with the resolved checkout items
 */
export function CartProvider({ catalog, onCheckout, children }) {
  const [cart, setCart] = useState({});
  const checkoutGuardRef = useRef(false);

  const offers = useMemo(() => Object.values(catalog), [catalog]);

  const addItem = useCallback(
    (id) => {
      preloadCheckout();
      setCart((prev) => {
        const isFirstAdd = !prev[id];
        if (isFirstAdd) {
          const offer = catalog[id];
          if (offer) trackMetaEvent('AddToCart', metaParamsFromOffer(offer, 1));
        }
        return incrementCartItem(prev, id);
      });
    },
    [catalog],
  );

  const changeQty = useCallback((id, qty) => {
    setCart((prev) => setCartItemQty(prev, id, qty));
  }, []);

  const checkout = useCallback(() => {
    if (checkoutGuardRef.current) return;
    const items = cartToCheckoutItems(cart, offers);
    if (items.length === 0) return;
    checkoutGuardRef.current = true;
    const total = getGrandTotal(cart, offers, getItemsShipping(items));
    trackMetaEvent('InitiateCheckout', metaParamsFromItems(items, total));
    onCheckout(items);
  }, [cart, offers, onCheckout]);

  // Re-arm the guard whenever the cart empties (e.g. after an order).
  useEffect(() => {
    if (getCartCount(cart) === 0) checkoutGuardRef.current = false;
  }, [cart]);

  const items = useMemo(() => cartToCheckoutItems(cart, offers), [cart, offers]);

  const value = useMemo(
    () => ({
      cart,
      cartCount: getCartCount(cart),
      subtotal: getCartSubtotal(cart, offers),
      shipping: getItemsShipping(items),
      grandTotal: getGrandTotal(cart, offers, getItemsShipping(items)),
      items,
      addItem,
      changeQty,
      checkout,
    }),
    [cart, offers, items, addItem, changeQty, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
