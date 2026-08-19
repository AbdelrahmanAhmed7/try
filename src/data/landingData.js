import logo from '../assets/logo.webp';
import product1 from '../assets/1.webp';
import product2 from '../assets/2.webp';
import product3 from '../assets/3.webp';
import product4 from '../assets/4.webp';
import product5 from '../assets/5.webp';
import product6 from '../assets/prestiege.webp';
import product7 from '../assets/coconut.webp';
import product8 from '../assets/beanut_butter_high_protien.webp';
import product9 from '../assets/beanut_butter.webp';
import colaBottle from '../assets/cola/products/healthy_cola.webp';
import lemonBottle from '../assets/cola/products/healthy_lemon.webp';
import offerSummer from '../assets/cola/offers/summer.webp';
import offerCombo from '../assets/cola/offers/combo.webp';
import offerShrink from '../assets/cola/offers/shrink.webp';
import offerLamma from '../assets/cola/offers/lama.webp';
import bundleImg from '../assets/bundle/bundle.jpeg';
import bundleImg2 from '../assets/bundle/bundle2.jpeg';

/** Product shots in carousel / gallery order: أطفال، أوجينال، بروتين، فيجن، بريستيج، جوز هند، زبدة فول سوداني، زبدة فول سوداني عالي البروتين، زبدة فول سوداني شيكولاتة */
export const productImages = [product4, product1, product2, product3, product6, product7, product5, product8, product9];

export const spreadFlavors = [
  { id: 'kids',    label: 'سبريد شيكولاتة أطفال 375 جرام',   shortLabel: 'أطفال',          emoji: '🧒', weight: '375 جرام', image: product4 },
  { id: 'original',label: 'سبريد شيكولاتة أوجينال 375 جرام',  shortLabel: 'أوجينال',        emoji: '🍫', weight: '375 جرام', image: product1 },
  { id: 'protein', label: 'سبريد شيكولاتة بروتين 375 جرام',   shortLabel: 'بروتين',         emoji: '💪', weight: '375 جرام', image: product2 },
  { id: 'vegan',   label: 'سبريد شيكولاتة فيجن 375 جرام',     shortLabel: 'فيجن',           emoji: '🌱', weight: '375 جرام', image: product3 },
  { id: 'prestige', label: 'سبريد شيكولاتة بريستيج 375 جرام', shortLabel: 'بريستيج', emoji: '👑', weight: '375 جرام', badge: '(بندق أكتر)', featured: true, image: product6 },
  { id: 'coconut', label: 'سبريد جوز هند 375 جرام',            shortLabel: 'جوز هند',        emoji: '🥥', weight: '375 جرام', image: product7 },
  { id: 'peanut',  label: 'زبدة فول سوداني 375 جرام',         shortLabel: 'زبدة فول سوداني', emoji: '🥜', weight: '375 جرام', image: product5 },
  { id: 'highProtein', label: 'زبدة فول سوداني عالي البروتين 375 جرام', shortLabel: 'زبدة فول سوداني عالي البروتين', emoji: '💪', weight: '375 جرام', image: product8 },
  { id: 'chocolatePeanut', label: 'زبدة فول سوداني شيكولاتة 375 جرام', shortLabel: 'زبدة فول سوداني شيكولاتة', emoji: '🍫', weight: '375 جرام', image: product9 },
];

export const colaFlavors = [
  { id: 'cola',  label: 'كولا',        shortLabel: 'كولا',        emoji: '🥤' },
  { id: 'lemon', label: 'ليمون نعناع', shortLabel: 'ليمون نعناع', emoji: '🍋' },
];

export const egyptGovs = ['القاهرة', 'الجيزة', 'الإسكندرية', 'طنطا', 'المنصورة', 'السويس', 'دمياط'];

export const landingData = {
  brand: {
    logo,
    name: 'Healthy & Tasty',
    tagline: 'Healthy food for all people',
  },
  nav: [
    { label: 'الرئيسية',      href: '#top' },
    { label: 'Healthy Spread', href: '#shop-spread' },
    { label: 'Healthy Cola',   href: '#shop-cola' },
    { label: 'Bundles',        href: '#shop-bundles' },
  ],
  hero: {
    eyebrow: 'Healthy & Tasty',
    title: 'اختيار صحي من غير ما تتنازل عن الطعم',
    subtitle:
      'منتجاتنا الصحية في مكان واحد: Healthy Spread، Healthy Cola، وباقات تناسب حياتك الصحية.',
    primaryCta: 'تسوق دلوقتي',
    stats: [
      { value: '🚚', label: 'توصيل مجاني على معظم العروض' },
      { value: '💳', label: 'الدفع عند الاستلام' },
      { value: '🌿', label: 'بدون سكر مضاف' },
    ],
  },
  categories: [
    { id: 'spread', title: 'Healthy Spread', image: product1, cta: 'شوف العروض', href: '#shop-spread', accent: '#5f2d91' },
    { id: 'cola',   title: 'Healthy Cola',   image: colaBottle, cta: 'شوف العروض', href: '#shop-cola',   accent: '#4f8d42' },
    { id: 'bundle', title: 'Bundles',        image: bundleImg, cta: 'شوف العروض', href: '#shop-bundles', accent: '#f5b51b' },
  ],
  colaCategory: {
    id: 'cola',
    eyebrow: 'Healthy & Tasty تقدم',
    title: 'Healthy Cola',
    subtitle: 'كولا 0 سكر و0 سعرات حرارية — نفس الطعم اللي بتحبه من غير ما تبوّظ نظامك',
    highlights: ['0 سكر', '0 سعرات', 'مناسب للكيتو', 'بدون أسبارتام', 'مناسبة لمرضى السكر'],
    products: [
      {
        id: 'cola',
        name: 'Healthy Cola',
        flavor: 'كولا',
        size: '350 مل',
        image: colaBottle,
      },
      {
        id: 'lemon-mint',
        name: 'Healthy Cola',
        flavor: 'ليمون نعناع',
        size: '350 مل',
        image: lemonBottle,
      },
    ],
    offers: [
      {
        id: 'summer',
        categoryId: 'cola',
        title: 'عرض الصيف',
        badge: '⭐ الأكثر طلبًا',
        amount: '2 شرنك + هدية + 5 Oat Bites',
        unit: 'كولا 350 مل',
        description: 'اشتري 2 شرنك (24 زجاجة) Healthy Cola (كولا 350 مل) واحصل على شرنك (12 زجاجة) مجاناً + 5 Oat Bites مجاناً',
        price: 599,
        originalPrice: 900,
        saving: 301,
        note: '2 شرنك + شرنك هدية + 5 Oat Bites — أقوى عرض الصيف.',
        image: offerSummer,
        accent: '#F97316',
        configuration: { type: 'colaFlavors', unitsPerPack: 36 },
      },
      {
        id: 'combo',
        categoryId: 'cola',
        title: 'عرض الكومبو',
        badge: '🎁 عرض خاص',
        amount: 'شرنك (12 زجاجة) + 6 هدية',
        unit: 'كولا 350 مل',
        description: '12 زجاجة Healthy Cola (كولا 350 مل · ليمون نعناع 350 مل) + 6 قطع هدية من اختيارك',
        price: 299,
        originalPrice: 450,
        saving: 151,
        note: 'شرنك + هدية من اختيارك — أفضل قيمة.',
        image: offerCombo,
        accent: '#6B21A8',
        configuration: { type: 'colaFlavors', unitsPerPack: 18 },
      },
      {
        id: 'month',
        categoryId: 'cola',
        title: 'عرض الشرنك',
        badge: 'وفر أكتر 🔥',
        amount: 'شرنك (12 زجاجة)',
        unit: 'كولا 350 مل',
        description: '12 زجاجة Healthy Cola (كولا 350 مل · ليمون نعناع 350 مل)',
        price: 229,
        originalPrice: 300,
        saving: 71,
        note: 'شرنك — يكفي البيت طول الشهر.',
        image: offerShrink,
        accent: '#DC2626',
        configuration: { type: 'colaFlavors', unitsPerPack: 12 },
      },
      {
        id: 'lamma',
        categoryId: 'cola',
        title: 'عرض اللمة',
        badge: '☀️ عرض محدود',
        amount: '5 زجاجات',
        unit: 'كولا 350 مل',
        description: '5 زجاجات Healthy Cola (كولا 350 مل)',
        price: 99,
        originalPrice: 125,
        saving: 26,
        note: 'مثالي للّمة، الماتش، أو أي خروجة.',
        image: offerLamma,
        accent: '#D4A017',
        shippingFee: 50,
        configuration: { type: 'colaFlavors', unitsPerPack: 5 },
      },
    ],
  },
  bundleSection: {
    id: 'bundles',
    eyebrow: 'باقات منتجاتنا',
    title: 'Bundles',
    subtitle: 'منتجات متعددة مجمعة في عرض واحد',
    description: 'باقات تجمع منتجاتنا الصحية مع بعض في عرض واحد مناسب',
    image: bundleImg,
    cta: 'Shop Bundles',
    offers: [
      {
        id: 'bundles',
        categoryId: 'bundles',
        title: 'البندل ١',
        amount: '٣ برطمانات سبريد + ١ شرنك كولا',
        unit: 'برطمان 375 جرام + كولا 350 مل',
        description: '٣ برطمانات Healthy Spread (375 جرام) + شرنك Healthy Cola (12 زجاجة) — 350 مل',
        price: 900,
        originalPrice: 1200,
        saving: 300,
        image: bundleImg,
        accent: '#f5b51b',
        badge: '⭐ أفضل قيمة',
        configuration: {
          type: 'bundle',
          spread: {
            unitsPerBundle: 3,
            maxFlavors: 9,
            configuration: { type: 'flavors' },
          },
          cola: {
            unitsPerBundle: 1,
            unitsPerShrink: 12,
            configuration: { type: 'colaFlavors' },
          },
        },
      },
      {
        id: 'bundle2',
        categoryId: 'bundles',
        title: 'البندل ٢',
        amount: '٢ برطمان سبريد + ٦ زجاجات كولا',
        unit: 'برطمان 375 جرام + كولا 350 مل',
        description: '٢ برطمانات Healthy Spread (375 جرام) + ٦ زجاجات Healthy Cola (كولا 350 مل)',
        price: 550,
        originalPrice: 750,
        saving: 200,
        image: bundleImg2,
        accent: '#c07a00',
        badge: '🔥 عرض جديد',
        configuration: {
          type: 'bundle',
          spread: {
            unitsPerBundle: 2,
            maxFlavors: 9,
            configuration: { type: 'flavors' },
          },
          cola: {
            unitsPerBundle: 1,
            unitsPerShrink: 6,
            configuration: { type: 'colaFlavors' },
          },
        },
      },
    ],
  },
  audience: {
    title: 'مناسب لمين؟',
    description: 'Healthy Spread اختيار ذكي لأكتر من روتين صحي، من غير حرمان ومن غير تعقيد.',
    items: [
      { label: 'الرياضيين',                  icon: '🏋️' },
      { label: 'مرضى السكر',                 icon: '🩺' },
      { label: 'متبعي الكيتو دايت',           icon: '🥑' },
      { label: 'متبعي نظام منخفض السعرات',    icon: '⚖️' },
    ],
  },
  product: {
    title: 'طعم حلو من غير إحساس بالذنب',
    description:
      'سبريد غني يناسب الفطار، السناك، والحلويات الصحية. معمول عشان يديك إحساس الشوكولاتة اللي بتحبه بشكل أخف وأنسب للاستخدام اليومي.',
    gallery: [
      { title: 'طعم غني', note: 'قوام كريمي وطعم شوكولاتة واضح' },
      { title: 'مكونات أخف', note: 'مناسب للاستخدام اليومي بدون سكر مضاف' },
      { title: 'سناك سريع', note: 'ينفع مع الفطار أو بين الوجبات' },
      { title: 'اختيار صحي', note: 'مناسب لأسلوب حياة أخف' },
      { title: 'بريستيج', note: 'نكهة فاخرة وغنية ببندق أكتر' },
      { title: 'جوز هند', note: 'نكهة جوز هند استوائية منعشة' },
      { title: 'زبدة فول سوداني', note: 'نكهة فول سوداني غنية بدون سكر مضاف' },
      { title: 'زبدة فول سوداني عالي البروتين', note: 'مثالي للرياضيين ومحبي البروتين' },
      { title: 'زبدة فول سوداني شيكولاتة', note: 'مزيج مثالي من فول السوداني والشوكولاتة' },
    ],
  },
  offersIntro: {
    eyebrow: 'اختار العرض المناسب ليك 👇',
    title: 'الحق العروض قبل ما تخلص',
    description: 'كل العروض شاملة الدفع عند الاستلام 💳 + توصيل مجاني على معظم العروض 🚚',
  },
  offers: [
    {
        id: 'two-jars',
      categoryId: 'spread',
      title: 'العرض الأول',
      amount: 'قطعتين من اختيارك',
      unit: 'برطمان 375 جرام',
      description: 'كل برطمان Healthy Spread 375 جرام',
      price: 450,
      originalPrice: 600,
      saving: 150,
      unitsPerPack: 2,
      maxFlavors: 9,
      configuration: { type: 'flavors' },
      badge: 'توفير 🔥',
      accent: '#5f2d91',
      note: '',
    },
    {
        id: 'three-jars',
      categoryId: 'spread',
      title: 'العرض الثاني',
      amount: '3 برطمانات من اختيارك',
      unit: 'برطمان 375 جرام',
      description: 'كل برطمان Healthy Spread 375 جرام',
      price: 650,
      originalPrice: 900,
      saving: 250,
      unitsPerPack: 3,
      maxFlavors: 9,
      configuration: { type: 'flavors' },
      badge: '⭐ الأكثر طلبًا',
      accent: '#b11730',
      note: '',
    },
    {
        id: 'four-jars',
      categoryId: 'spread',
      title: 'العرض الثالث',
      amount: '4 برطمانات من اختيارك',
      unit: 'برطمان 375 جرام',
      description: 'كل برطمان Healthy Spread 375 جرام',
      price: 850,
      originalPrice: 1200,
      saving: 350,
      unitsPerPack: 4,
      maxFlavors: 9,
      configuration: { type: 'flavors' },
      badge: 'أكبر توفير 🔥',
      accent: '#0f766e',
      note: '',
    },
  ],
  loveReasons: {
    eyebrow: 'ليه العملاء بيحبوا Healthy Spread؟',
    title: 'لأنها بتديك الطعم اللي بتحبه بشكل أخف',
    items: [
      { label: 'طعم حلو من غير إحساس بالذنب',              icon: '😍' },
      { label: 'اختيار يناسب أسلوب الحياة الصحي',           icon: '🌿' },
      { label: 'مكونات أخف وأنسب للاستخدام اليومي',         icon: '✅' },
      { label: 'حل مثالي للحلويات والسناك الصحية',           icon: '🍽️' },
    ],
  },
  form: {
    title: 'بياناتك',
    subtitle: 'أدخل بياناتك وهنكلمك لتأكيد الطلب',
    submitLabel: 'تأكيد الطلب',
    successMessage: 'تم تسجيل طلبك! سيتم التواصل معاك في أقرب وقت لتأكيد الطلب والتوصيل.',
    validationMessage: 'من فضلك املأ كل الحقول المطلوبة بشكل صحيح.',
  },
  footer: {
    note: 'اختيار صحي من غير ما تتنازل عن الطعم',
  },
  faq: [
    {
      id: 'how-to-order',
      q: 'إزاي أطلب؟',
      a: 'اختار المنتج أو العرض وأضفه للسلة، بعدين ادخل اسمك ورقم موبايلك والعنوان، وهيتواصل معاك فريقنا لتأكيد الطلب والتوصيل.',
    },
    {
      id: 'cod',
      q: 'هل الدفع عند الاستلام؟',
      a: 'أيوه، كل الطلبات بتتدفع كاش عند الاستلام. مفيش دفع مسبق أو بيانات بنكية.',
    },
    {
      id: 'shipping',
      q: 'هل التوصيل مجاناً؟',
      a: 'أيوه، التوصيل مجاني على معظم العروض، باستثناء عرض اللمة حيث تبلغ مصاريف الشحن 50 جنيه.',
    },
    {
      id: 'govs',
      q: 'بتوصلوا لأنهي محافظات؟',
      a: 'بنوصل حالياً للقاهرة والجيزة والإسكندرية وطنطا والمنصورة والسويس ودمياط.',
    },
    {
      id: 'flavors',
      q: 'إزاي أختار النكهات لـ Healthy Spread؟',
      a: 'بعد ما تضيف عرض Spread للسلة، هتظهرلك شاشة اختيار النكهات قبل تأكيد الطلب. هتوزّع عدد البرطمانات على النكهات المتاحة زي ما يناسبك.',
    },
    {
      id: 'notes',
      q: 'أقدر أكتب ملاحظة على الطلب؟',
      a: 'أيوه، في خانة "ملاحظات" في صفحة إتمام الطلب تقدر تكتب أي تفاصيل إضافية.',
    },
  ],
};

/**
 * Legacy default shipping fee. Not the source of truth — the real
 * order-level fee is data-driven via offer.shippingFee, resolved once per
 * order by getItemsShipping() in src/utils/cartState.js (0 = free).
 */
export const SHIPPING_FEE = 0;

export const formatPrice = (amount) => `${amount} جنيه`;
