/**
 * Bundle commerce regression tests (pure logic, no React / assets).
 *
 * Verifies that the Bundle behaves as a first-class offer inside the
 * existing cart architecture:
 *   - catalog classification (bundle vs spread vs cola)
 *   - per-line spread/cola distribution totals derived from
 *     configuration × quantity (never hardcoded)
 *   - cart totals for all 7 offer combinations
 *   - bundle ×2 scaling (6 spread jars, 2 shrinks, 1800 EGP)
 *   - payload quantity = number of bundles
 */
import {
  incrementCartItem,
  setCartItemQty,
  getCartCount,
  getCartSubtotal,
  getGrandTotal,
  cartToCheckoutItems,
  offerNeedsFlavors,
  offerNeedsColaConfig,
  offerNeedsBundleConfig,
  offerPackUnits,
  bundleSpreadUnits,
  bundleColaShrinks,
  bundleColaUnitsPerShrink,
  spreadDistributionTotal,
  colaDistributionTotal,
  itemNeedsColaDistribution,
} from '../src/utils/cartState.js';

const SHIPPING = 0;

const offers = [
  {
    id: 'two-jars',
    categoryId: 'spread',
    price: 450,
    originalPrice: 600,
    saving: 150,
    unitsPerPack: 2,
    configuration: { type: 'flavors' },
  },
  {
    id: 'month',
    categoryId: 'cola',
    price: 229,
    originalPrice: 300,
    saving: 71,
    configuration: { type: 'colaFlavors', unitsPerPack: 12 },
  },
  {
    id: 'bundles',
    categoryId: 'bundles',
    price: 900,
    originalPrice: 1200,
    saving: 300,
    configuration: {
      type: 'bundle',
      spread: { unitsPerBundle: 3, maxFlavors: 9, configuration: { type: 'flavors' } },
      cola: { unitsPerBundle: 1, unitsPerShrink: 12, configuration: { type: 'colaFlavors' } },
    },
  },
];

const bundle = offers.find((o) => o.id === 'bundles');

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed += 1;
  } else {
    console.log('OK:', msg);
  }
}

// ── Classification ──
assert(offerNeedsBundleConfig(bundle), 'bundle: offerNeedsBundleConfig true');
assert(!offerNeedsFlavors(bundle), 'bundle: NOT a plain spread offer');
assert(!offerNeedsColaConfig(bundle), 'bundle: NOT a plain cola offer');
assert(offerPackUnits(bundle) === 1, 'bundle: 1 cart unit = 1 bundle');
assert(bundleSpreadUnits(bundle) === 3, 'bundle: 3 spread jars per bundle');
assert(bundleColaShrinks(bundle) === 1, 'bundle: 1 cola shrink per bundle');
assert(bundleColaUnitsPerShrink(bundle) === 12, 'bundle: shrink = 12 bottles');

const line = (offer, qty) => ({ offer, qty });

// ── Distribution totals derive from configuration × quantity ──
assert(spreadDistributionTotal(line(offers[0], 1)) === 2, 'two-jars ×1 → 2 spread jars');
assert(spreadDistributionTotal(line(bundle, 1)) === 3, 'bundle ×1 → 3 spread jars');
assert(spreadDistributionTotal(line(bundle, 2)) === 6, 'bundle ×2 → 6 spread jars');
assert(spreadDistributionTotal(line(bundle, 3)) === 9, 'bundle ×3 → 9 spread jars');
assert(colaDistributionTotal(line(offers[1], 1)) === 12, 'month ×1 → 12 cola bottles');
assert(colaDistributionTotal(line(bundle, 1)) === 12, 'bundle ×1 → 12 cola bottles');
assert(colaDistributionTotal(line(bundle, 2)) === 24, 'bundle ×2 → 24 cola bottles (2 shrinks)');
assert(itemNeedsColaDistribution(line(bundle, 1)), 'bundle line needs cola distribution');
assert(itemNeedsColaDistribution(line(offers[1], 1)), 'cola line needs cola distribution');
assert(!itemNeedsColaDistribution(line(offers[0], 1)), 'spread line needs no cola distribution');

// ── Cart totals: 7 combos ──
function comboTotal(cart) {
  const items = cartToCheckoutItems(cart, offers);
  return { grand: getGrandTotal(cart, offers, SHIPPING), items };
}

let t = comboTotal({ 'two-jars': 1 });
assert(t.grand === 450 && t.items.length === 1, `1. Spread only → 450 (${t.grand})`);

t = comboTotal({ month: 1 });
assert(t.grand === 229 && t.items.length === 1, `2. Cola only → 229 (${t.grand})`);

t = comboTotal({ bundles: 1 });
assert(t.grand === 900 && t.items.length === 1, `3. Bundle only → 900 (${t.grand})`);

t = comboTotal({ 'two-jars': 1, month: 1 });
assert(t.grand === 679 && t.items.length === 2, `4. Spread + Cola → 679 (${t.grand})`);

t = comboTotal({ 'two-jars': 1, bundles: 1 });
assert(t.grand === 1350 && t.items.length === 2, `5. Spread + Bundle → 1350 (${t.grand})`);

t = comboTotal({ month: 1, bundles: 1 });
assert(t.grand === 1129 && t.items.length === 2, `6. Cola + Bundle → 1129 (${t.grand})`);

t = comboTotal({ 'two-jars': 1, month: 1, bundles: 1 });
assert(t.grand === 1579 && t.items.length === 3, `7. Spread + Cola + Bundle → 1579 (${t.grand})`);

// ── Bundle ×2 stays ONE cart line, no merging into spread/cola ──
let cart = incrementCartItem({}, 'bundles');
cart = incrementCartItem(cart, 'bundles');
const items = cartToCheckoutItems(cart, offers);
assert(cart.bundles === 2 && items.length === 1 && items[0].qty === 2, 'bundle ×2 → single line qty 2');
assert(getCartCount(cart) === 2, 'bundle ×2 → cart count 2');
assert(getGrandTotal(cart, offers, SHIPPING) === 1800, 'bundle ×2 → 1800');
assert(spreadDistributionTotal(items[0]) === 6, 'bundle ×2 → 6 spread jars to configure');
assert(colaDistributionTotal(items[0]) === 24, 'bundle ×2 → 24 cola bottles (2 shrinks)');

// ── Payload quantity = number of bundles (mirrors StepConfirm reduce) ──
const payloadQty = items.reduce(
  (s, item) => s + (offerNeedsFlavors(item.offer) ? item.offer.unitsPerPack * item.qty : item.qty),
  0,
);
assert(payloadQty === 2, 'bundle ×2 → payload quantity 2');

// qty 0 removes bundle line like any other offer
cart = setCartItemQty(cart, 'bundles', 0);
assert(cart.bundles === undefined && getCartCount(cart) === 0, 'bundle qty 0 removes line');

if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log('\nAll bundle commerce scenarios passed.');
