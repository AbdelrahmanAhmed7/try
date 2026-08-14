/**
 * Shipping rule regression tests (pure logic, no React / assets).
 *
 * Business rule: the 5-Cola offer (id 'lamma', عرض اللمة) declares
 * shippingFee: 50. That fee is applied ONCE per order (never × quantity),
 * and every other offer ships for free. Totals, checkout, and submitted
 * price must all resolve through the same centralized getItemsShipping().
 */
import {
  incrementCartItem,
  getCartSubtotal,
  getGrandTotal,
  getItemsShipping,
  cartToCheckoutItems,
} from '../src/utils/cartState.js';

const spread = { id: 'three-jars', categoryId: 'spread', price: 650, unitsPerPack: 3 };
const cola = { id: 'month', categoryId: 'cola', price: 229, configuration: { type: 'colaFlavors', unitsPerPack: 12 } };
const lamma = { id: 'lamma', categoryId: 'cola', price: 99, shippingFee: 50, configuration: { type: 'colaFlavors', unitsPerPack: 5 } };
const bundle = { id: 'bundles', categoryId: 'bundles', price: 900, configuration: { type: 'bundle' } };

const offers = [spread, cola, lamma, bundle];

let failed = 0;
function assert(cond, msg) {
  if (cond) {
    console.log('OK:', msg);
  } else {
    failed += 1;
    console.error('FAIL:', msg);
  }
}

function shippingOf(cart) {
  return getItemsShipping(cartToCheckoutItems(cart, offers));
}

function grandOf(cart) {
  return getGrandTotal(cart, offers, getItemsShipping(cartToCheckoutItems(cart, offers)));
}

// 1. Spread only → shipping 0
let cart = incrementCartItem({}, 'three-jars');
assert(shippingOf(cart) === 0, 'spread only → shipping 0');
assert(grandOf(cart) === 650, 'spread only → grand 650');

// 2. Normal Cola offer (no fee) → shipping 0
cart = incrementCartItem({}, 'month');
assert(shippingOf(cart) === 0, 'normal cola only → shipping 0');
assert(grandOf(cart) === 229, 'normal cola only → grand 229');

// 3. 5-Cola ×1 → shipping 50
cart = incrementCartItem({}, 'lamma');
assert(shippingOf(cart) === 50, '5-cola ×1 → shipping 50');
assert(grandOf(cart) === 149, '5-cola ×1 → grand 149 (99 + 50)');

// 4. 5-Cola ×2 → shipping still 50 (fee NOT multiplied by quantity)
cart = incrementCartItem({}, 'lamma');
cart = incrementCartItem(cart, 'lamma');
assert(shippingOf(cart) === 50, '5-cola ×2 → shipping 50 (not 100)');
assert(grandOf(cart) === 248, '5-cola ×2 → grand 248 (198 + 50)');

// 5. Bundle ×1 → shipping 0
cart = incrementCartItem({}, 'bundles');
assert(shippingOf(cart) === 0, 'bundle ×1 → shipping 0');
assert(grandOf(cart) === 900, 'bundle ×1 → grand 900');

// 6. Spread + normal Cola → shipping 0
cart = incrementCartItem({}, 'three-jars');
cart = incrementCartItem(cart, 'month');
assert(shippingOf(cart) === 0, 'spread + normal cola → shipping 0');
assert(grandOf(cart) === 879, 'spread + normal cola → grand 879');

// 7. Spread + 5-Cola offer → shipping 50 (once)
cart = incrementCartItem({}, 'three-jars');
cart = incrementCartItem(cart, 'lamma');
assert(shippingOf(cart) === 50, 'spread + 5-cola → shipping 50 (not 50+50)');
assert(grandOf(cart) === 799, 'spread + 5-cola → grand 799');

// 8. Bundle + 5-Cola offer → shipping 50
cart = incrementCartItem({}, 'bundles');
cart = incrementCartItem(cart, 'lamma');
assert(shippingOf(cart) === 50, 'bundle + 5-cola → shipping 50');
assert(grandOf(cart) === 1049, 'bundle + 5-cola → grand 1049');

// 9. Spread + Cola + Bundle + 5-Cola → shipping 50
cart = incrementCartItem({}, 'three-jars');
cart = incrementCartItem(cart, 'month');
cart = incrementCartItem(cart, 'bundles');
cart = incrementCartItem(cart, 'lamma');
assert(shippingOf(cart) === 50, 'spread + cola + bundle + 5-cola → shipping 50 (single order fee)');
assert(grandOf(cart) === 1928, 'spread + cola + bundle + 5-cola → grand 1928 (1878 + 50)');

// 10. Remove the 5-Cola offer from the mixed cart → shipping returns to 0
const mixed = cartToCheckoutItems(cart, offers).filter((item) => item.offer.id !== 'lamma');
assert(getItemsShipping(mixed) === 0, 'mixed cart minus 5-cola → shipping returns to 0');

// 11. Empty cart → shipping 0
assert(getItemsShipping([]) === 0, 'empty cart → shipping 0');

// Sanity: subtotal still independent of shipping
cart = incrementCartItem({}, 'three-jars');
cart = incrementCartItem(cart, 'lamma');
assert(getCartSubtotal(cart, offers) === 749, 'subtotal excludes shipping (749)');

if (failed > 0) {
  console.error(`\n${failed} shipping scenario(s) FAILED.`);
  process.exit(1);
}
console.log('\nAll shipping scenarios passed.');
