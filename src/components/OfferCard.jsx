/**
 * OfferCard — single reusable card for Spread / Cola / Bundles.
 *
 * Card hierarchy:
 *   Image → Category label → Title → Descriptor → Price row → Action
 *
 * Interaction:
 *   - Card click (when not yet in cart): add to cart
 *   - When in cart: show QtyStepper inline, card click disabled
 *   - Static (bundle): show CTA link, no cart interaction
 *
 * Cart / pricing / saving logic unchanged.
 */
import { formatPrice } from '../data/landingData.js';
import OfferImage from './OfferImage.jsx';
import QtyStepper from './QtyStepper.jsx';

export default function OfferCard({
  offer,
  qty = 0,
  onAdd,
  onChangeQty,
  categoryLabel,
  staticCta,
}) {
  const interactive = typeof onAdd === 'function';
  const inCart      = interactive && qty > 0;
  const displayQty  = Math.max(qty, 1);
  const hasPrice    = Number.isFinite(offer.price);
  const featured    = offer.configuration?.type === 'bundle';

  const handleAdd = (e) => {
    e.stopPropagation();
    if (interactive && !inCart) onAdd(offer.id);
  };

  const handleCardClick = () => {
    if (interactive && !inCart) onAdd(offer.id);
  };

  const handleKeyDown = (e) => {
    if (!inCart && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      if (interactive) onAdd(offer.id);
    }
  };

  return (
    <article
      className={[
        'ht-card',
        featured      ? 'ht-card--featured'  : '',
        inCart        ? 'ht-card--in-cart'    : '',
        interactive   ? 'ht-card--interactive' : '',
      ].filter(Boolean).join(' ')}
      style={{ '--card-accent': offer.accent || 'var(--purple-700)' }}
      onClick={interactive && !inCart ? handleCardClick : undefined}
      role={interactive && !inCart ? 'button' : 'article'}
      tabIndex={interactive && !inCart ? 0 : undefined}
      aria-label={interactive && !inCart ? `أضف ${offer.title} للسلة` : undefined}
      onKeyDown={interactive && !inCart ? handleKeyDown : undefined}
    >

      {/* ── Badge ── */}
      {offer.badge && (
        <span className="ht-card__badge">{offer.badge}</span>
      )}

      {/* ── In-cart check ── */}
      {inCart && (
        <span className="ht-card__check" aria-hidden="true">✓</span>
      )}

      {/* ── Image ── */}
      <div className="ht-card__media">
        <OfferImage
          offerId={offer.id}
          alt={offer.title}
          width={300}
          height={300}
          fallback={offer.image}
        />
      </div>

      {/* ── Body ── */}
      <div className="ht-card__body">

        {categoryLabel && (
          <span className="ht-card__cat">{categoryLabel}</span>
        )}

        <h3 className="ht-card__title">{offer.title}</h3>

        {offer.amount
          ? <p className="ht-card__amount">{offer.amount}</p>
          : offer.description
          ? <p className="ht-card__desc">{offer.description}</p>
          : null
        }

        {featured && offer.amount && offer.description && (
          <p className="ht-card__desc">{offer.description}</p>
        )}

        {Number.isFinite(offer.shippingFee) && offer.shippingFee > 0 && (
          <p className="ht-card__shipping">
            🚚 شحن {formatPrice(offer.shippingFee)} لهذا العرض
          </p>
        )}

        {/* Price row */}
        {hasPrice && (
          <div className="ht-card__price-row">
            <div className="ht-card__price-main">
              <span className="ht-card__price">
                {formatPrice(offer.price * displayQty)}
              </span>
              {Number.isFinite(offer.originalPrice) && (
                <s className="ht-card__original">
                  بدل {formatPrice(offer.originalPrice * displayQty)}
                </s>
              )}
            </div>
            {Number.isFinite(offer.saving) && offer.saving > 0 && (
              <span className="ht-card__saving">
                وفر {formatPrice(offer.saving * displayQty)}
              </span>
            )}
          </div>
        )}

        {/* Action */}
        <div className="ht-card__action" onClick={(e) => e.stopPropagation()}>
          {interactive ? (
            inCart ? (
              <QtyStepper
                qty={qty}
                onChange={(val) => onChangeQty(offer.id, val)}
              />
            ) : (
              <button
                type="button"
                className="ht-card__atc"
                onClick={handleAdd}
                aria-label={`أضف ${offer.title} للسلة`}
              >
                أضف للسلة
              </button>
            )
          ) : staticCta ? (
            <a
              href="#shop"
              className="ht-card__atc ht-card__atc--ghost"
              onClick={(e) => e.stopPropagation()}
            >
              {staticCta}
            </a>
          ) : null}
        </div>

      </div>
    </article>
  );
}
