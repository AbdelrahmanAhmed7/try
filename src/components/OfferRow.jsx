import { formatPrice } from '../data/landingData.js';
import OfferImage from './OfferImage.jsx';
import QtyStepper from './QtyStepper.jsx';

export default function OfferRow({
  offer,
  qty = 0,
  onAdd,
  onChangeQty,
  shippingLine = '🚚 توصيل مجاناً',
  staticCta,
  categoryLabel,
}) {
  const interactive = typeof onAdd === 'function';
  const inCart = interactive && qty > 0;
  const displayQty = Math.max(qty, 1);
  const hasPrice = Number.isFinite(offer.price);

  return (
    <article
      className={`bundle-row${inCart ? ' selected' : ''}${interactive ? '' : ' bundle-row--static'}`}
      style={{ '--accent': offer.accent }}
      onClick={interactive ? () => onAdd(offer.id) : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${offer.title} — أضف للسلة` : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAdd(offer.id);
              }
            }
          : undefined
      }
    >
      {inCart && <div className="selected-check" aria-hidden="true">✓</div>}
      {offer.badge && <div className="bundle-row-badge">{offer.badge}</div>}

      <div className="bundle-row-img">
        <OfferImage
          offerId={offer.id}
          alt={offer.title}
          width={90}
          height={90}
          fallback={offer.image}
        />
      </div>

      <div className="bundle-row-info">
        {categoryLabel && <span className="bundle-row-cat">{categoryLabel}</span>}
        <h3>{offer.title}</h3>
        {offer.amount && <p className="bundle-row-amount">{offer.amount}</p>}
        {offer.description && <p>{offer.description}</p>}
        {offer.note && <p className="bundle-row-note">{offer.note}</p>}
        {hasPrice && (
          <div className="bundle-row-price">
            <strong>{formatPrice(offer.price * displayQty)}</strong>
            {Number.isFinite(offer.originalPrice) && (
              <s>{formatPrice(offer.originalPrice * displayQty)}</s>
            )}
            {Number.isFinite(offer.saving) && (
              <span className="saving-tag">وفر {formatPrice(offer.saving * displayQty)}</span>
            )}
          </div>
        )}
        <p className="bundle-row-shipping">{shippingLine}</p>

        {interactive ? (
          inCart ? (
            <QtyStepper qty={qty} onChange={(val) => onChangeQty(offer.id, val)} />
          ) : (
            <span className="add-to-cart-btn" aria-hidden="true">
              🛒 أضف للسلة
            </span>
          )
        ) : staticCta ? (
          <span className="category-card__cta bundle-row-static-cta">{staticCta}</span>
        ) : null}
      </div>
    </article>
  );
}
