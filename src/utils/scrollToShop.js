export function scrollToShop() {
  const shop = document.getElementById('shop');
  if (!shop) return;
  const header = document.querySelector('.site-header');
  const offset = header ? header.getBoundingClientRect().height : 70;
  const top = shop.getBoundingClientRect().top + window.scrollY - offset - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}
