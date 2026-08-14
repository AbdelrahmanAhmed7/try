/**
 * FAQSection — compact accordion FAQ.
 *
 * Placement: after TrustSection, before Footer.
 * Data: from landingData.faq — every answer is grounded in
 *       existing project code/data (no invented policies).
 *
 * REMOVABLE: delete this file + its import/render in App.jsx.
 * All styles use ht-faq- prefix (isolated).
 * No cart / checkout logic touched.
 *
 * Accessibility:
 *   - <button> triggers (not clickable divs)
 *   - aria-expanded / aria-controls / id pairing
 *   - keyboard: Enter / Space open/close
 */
import { useState } from 'react';
import { landingData } from '../data/landingData.js';

function ChevronIcon({ open }) {
  return (
    <svg
      className={`ht-faq__chevron${open ? ' ht-faq__chevron--open' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="18"
      height="18"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FAQItem({ item, isOpen, onToggle }) {
  const answerId = `faq-answer-${item.id}`;
  const triggerId = `faq-trigger-${item.id}`;

  return (
    <div className={`ht-faq__item${isOpen ? ' ht-faq__item--open' : ''}`}>
      <button
        id={triggerId}
        type="button"
        className="ht-faq__trigger"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
      >
        <span className="ht-faq__question">{item.q}</span>
        <ChevronIcon open={isOpen} />
      </button>

      <div
        id={answerId}
        role="region"
        aria-labelledby={triggerId}
        className="ht-faq__answer"
        hidden={!isOpen}
      >
        <p className="ht-faq__answer-text">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const items = landingData.faq;
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="ht-faq" dir="rtl" aria-label="الأسئلة الشائعة" id="faq">
      <div className="ht-faq__inner">

        <div className="ht-faq__header">
          <h2 className="ht-faq__heading">الأسئلة الشائعة</h2>
          <p className="ht-faq__sub">إجابات سريعة على أكتر الأسئلة شيوعاً</p>
        </div>

        <div className="ht-faq__list">
          {items.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
