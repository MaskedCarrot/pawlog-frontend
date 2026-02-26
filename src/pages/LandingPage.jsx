import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import { useState, useMemo, useRef, useEffect } from 'react';

// Expanded food database — American market focus. safe/unsafe/unknown
const FOOD_DB = {
  // UNSAFE - high/severe
  chocolate: { safe: false, severity: 'high', name: 'Chocolate', symptoms: 'Vomiting, diarrhea, rapid heart rate, seizures', action: 'Contact vet immediately. Dark chocolate is more toxic than milk chocolate.', safeFor: 'dog' },
  grapes: { safe: false, severity: 'high', name: 'Grapes', symptoms: 'Kidney failure, vomiting, lethargy', action: 'Seek emergency vet care. Even small amounts can be dangerous.', safeFor: 'dog' },
  raisins: { safe: false, severity: 'high', name: 'Raisins', symptoms: 'Same as grapes — kidney failure can be rapid', action: 'Emergency vet visit. Induce vomiting only if instructed by vet.', safeFor: 'dog' },
  xylitol: { safe: false, severity: 'severe', name: 'Xylitol', symptoms: 'Rapid insulin release, liver failure, seizures', action: 'Emergency vet immediately. Found in sugar-free gum, candy, peanut butter.', safeFor: 'dog' },
  alcohol: { safe: false, severity: 'severe', name: 'Alcohol', symptoms: 'Vomiting, disorientation, seizures, coma', action: 'Emergency vet. Never give alcohol to pets.', safeFor: 'dog' },
  caffeine: { safe: false, severity: 'moderate', name: 'Caffeine', symptoms: 'Restlessness, rapid heart rate, tremors', action: 'Contact vet. Found in coffee, tea, energy drinks.', safeFor: 'dog' },
  'macadamia nuts': { safe: false, severity: 'moderate', name: 'Macadamia nuts', symptoms: 'Weakness, vomiting, tremors', action: 'Contact vet. Often combined with chocolate in cookies.', safeFor: 'dog' },
  nutmeg: { safe: false, severity: 'moderate', name: 'Nutmeg', symptoms: 'Tremors, seizures, hallucinations', action: 'Contact vet. Found in pumpkin pie, eggnog.', safeFor: 'dog' },
  'raw yeast dough': { safe: false, severity: 'high', name: 'Raw yeast dough', symptoms: 'Bloat, gas, alcohol poisoning from fermentation', action: 'Contact vet immediately. Dough can expand in stomach.', safeFor: 'dog' },
  'cooked bones': { safe: false, severity: 'high', name: 'Cooked bones', symptoms: 'Splintering, choking, internal puncture', action: 'Do not induce vomiting. Contact vet if ingested.', safeFor: 'dog' },
  // UNSAFE - moderate
  onions: { safe: false, severity: 'moderate', name: 'Onions', symptoms: 'Anemia, weakness, pale gums', action: 'Monitor and contact vet. Effects build up over time.', safeFor: 'dog' },
  garlic: { safe: false, severity: 'moderate', name: 'Garlic', symptoms: 'Similar to onions — damages red blood cells', action: 'Contact vet. More toxic than onions in small amounts.', safeFor: 'dog' },
  chives: { safe: false, severity: 'moderate', name: 'Chives', symptoms: 'Same as onions — damage red blood cells', action: 'Contact vet.', safeFor: 'dog' },
  leeks: { safe: false, severity: 'moderate', name: 'Leeks', symptoms: 'Same as onions', action: 'Contact vet.', safeFor: 'dog' },
  avocado: { safe: false, severity: 'low', name: 'Avocado', symptoms: 'Mild stomach upset; pit is choking hazard', action: 'Monitor. Persin is more toxic to birds; dogs usually tolerate small amounts.', safeFor: 'dog' },
  rhubarb: { safe: false, severity: 'moderate', name: 'Rhubarb', symptoms: 'Kidney failure, tremors', action: 'Contact vet. Leaves are most toxic.', safeFor: 'dog' },
  cherries: { safe: false, severity: 'moderate', name: 'Cherries', symptoms: 'Cyanide in pits; stem', action: 'Contact vet. Pit and stem are toxic.', safeFor: 'dog' },
  'cherry pits': { safe: false, severity: 'moderate', name: 'Cherry pits', symptoms: 'Cyanide in pits', action: 'Contact vet.', safeFor: 'dog' },
  'peach pits': { safe: false, severity: 'moderate', name: 'Peach pits', symptoms: 'Cyanide in pits', action: 'Contact vet.', safeFor: 'dog' },
  'peach pit': { safe: false, severity: 'moderate', name: 'Peach pits', symptoms: 'Cyanide in pits', action: 'Contact vet.', safeFor: 'dog' },
  'plum pits': { safe: false, severity: 'moderate', name: 'Plum pits', symptoms: 'Cyanide in pits', action: 'Contact vet.', safeFor: 'dog' },
  'apricot pits': { safe: false, severity: 'moderate', name: 'Apricot pits', symptoms: 'Cyanide in pits', action: 'Contact vet.', safeFor: 'dog' },
  'apple seeds': { safe: false, severity: 'low', name: 'Apple seeds', symptoms: 'Cyanide in large amounts', action: 'Contact vet if many ingested.', safeFor: 'dog' },
  elderberry: { safe: false, severity: 'moderate', name: 'Elderberry raw', symptoms: 'Raw berries, leaves, stems toxic', action: 'Contact vet. Cooked berries are sometimes used in supplements.', safeFor: 'dog' },
  mushrooms: { safe: false, severity: 'high', name: 'Wild mushrooms', symptoms: 'Varies by species — liver failure, seizures', action: 'Emergency vet. Never give wild mushrooms.', safeFor: 'dog' },
  'fat trimmings': { safe: false, severity: 'moderate', name: 'Fat trimmings', symptoms: 'Pancreatitis', action: 'Contact vet.', safeFor: 'dog' },
  bacon: { safe: false, severity: 'moderate', name: 'Bacon', symptoms: 'High salt, fat — pancreatitis risk', action: 'Small amounts rarely. Avoid regular feeding.', safeFor: 'dog' },
  'salt': { safe: false, severity: 'moderate', name: 'Salt', symptoms: 'Excessive thirst, sodium ion poisoning', action: 'Contact vet if large amount ingested.', safeFor: 'dog' },
  // SAFE
  apple: { safe: true, name: 'Apple', note: 'Remove seeds and core. Safe in moderation.', safeFor: 'dog' },
  banana: { safe: true, name: 'Banana', note: 'High in sugar — small slices as a treat.', safeFor: 'dog' },
  carrot: { safe: true, name: 'Carrot', note: 'Great for crunch and vitamins. Raw or cooked.', safeFor: 'dog' },
  blueberry: { safe: true, name: 'Blueberry', note: 'Antioxidant-rich treat. A few at a time.', safeFor: 'dog' },
  chicken: { safe: true, name: 'Chicken', note: 'Plain cooked chicken is fine. No bones or seasoning.', safeFor: 'dog' },
  rice: { safe: true, name: 'Rice', note: 'Plain cooked rice is good for upset stomachs.', safeFor: 'dog' },
  peanut: { safe: true, name: 'Peanut butter', note: 'Xylitol-free only. Small amounts as a treat.', safeFor: 'dog' },
  'peanut butter': { safe: true, name: 'Peanut butter', note: 'Xylitol-free only. Small amounts as a treat.', safeFor: 'dog' },
  pumpkin: { safe: true, name: 'Pumpkin', note: 'Plain canned pumpkin helps with digestion.', safeFor: 'dog' },
  'sweet potato': { safe: true, name: 'Sweet potato', note: 'Plain cooked. No skin or seasoning.', safeFor: 'dog' },
  turkey: { safe: true, name: 'Turkey', note: 'Plain cooked, no skin or bones.', safeFor: 'dog' },
  salmon: { safe: true, name: 'Salmon', note: 'Cooked only. Raw can have parasites.', safeFor: 'dog' },
  broccoli: { safe: true, name: 'Broccoli', note: 'Small amounts. Raw or cooked.', safeFor: 'dog' },
  'green beans': { safe: true, name: 'Green beans', note: 'Plain, no salt. Good low-calorie treat.', safeFor: 'dog' },
  spinach: { safe: true, name: 'Spinach', note: 'Small amounts. Raw or cooked.', safeFor: 'dog' },
  watermelon: { safe: true, name: 'Watermelon', note: 'Remove seeds and rind. Hydrating treat.', safeFor: 'dog' },
  strawberry: { safe: true, name: 'Strawberry', note: 'A few at a time. Remove stems.', safeFor: 'dog' },
  pear: { safe: true, name: 'Pear', note: 'Remove seeds and core. In moderation.', safeFor: 'dog' },
  cucumber: { safe: true, name: 'Cucumber', note: 'Low-calorie, hydrating. Peel if preferred.', safeFor: 'dog' },
  zucchini: { safe: true, name: 'Zucchini', note: 'Plain cooked or raw. Safe in moderation.', safeFor: 'dog' },
  coconut: { safe: true, name: 'Coconut', note: 'Fresh meat in small amounts. Avoid shell.', safeFor: 'dog' },
  oatmeal: { safe: true, name: 'Oatmeal', note: 'Plain cooked. No sugar or flavorings.', safeFor: 'dog' },
  yogurt: { safe: true, name: 'Plain yogurt', note: 'No sugar added. Avoid xylitol. Small amounts.', safeFor: 'dog' },
  cheese: { safe: true, name: 'Cheese', note: 'Small amounts. Many dogs are lactose intolerant.', safeFor: 'dog' },
  'cottage cheese': { safe: true, name: 'Cottage cheese', note: 'Plain, low-fat. Small amounts.', safeFor: 'dog' },
  eggs: { safe: true, name: 'Eggs', note: 'Cooked only. Raw can cause biotin deficiency.', safeFor: 'dog' },
  peas: { safe: true, name: 'Peas', note: 'Green peas, plain. Safe in moderation.', safeFor: 'dog' },
  cranberry: { safe: true, name: 'Cranberry', note: 'Fresh or dried, unsweetened. Small amounts.', safeFor: 'dog' },
  blackberry: { safe: true, name: 'Blackberry', note: 'A few at a time. Remove stems.', safeFor: 'dog' },
  raspberry: { safe: true, name: 'Raspberry', note: 'A few at a time. Remove stems.', safeFor: 'dog' },
  mango: { safe: true, name: 'Mango', note: 'Remove pit. High sugar — small amounts.', safeFor: 'dog' },
  pineapple: { safe: true, name: 'Pineapple', note: 'Remove skin and core. Small amounts.', safeFor: 'dog' },
  popcorn: { safe: true, name: 'Popcorn', note: 'Plain, no butter or salt. Unpopped kernels are choking hazards.', safeFor: 'dog' },
  'plain popcorn': { safe: true, name: 'Popcorn', note: 'Plain, no butter or salt.', safeFor: 'dog' },
  cauliflower: { safe: true, name: 'Cauliflower', note: 'Small amounts. Raw or cooked.', safeFor: 'dog' },
  'brussels sprouts': { safe: true, name: 'Brussels sprouts', note: 'Small amounts. Can cause gas.', safeFor: 'dog' },
  lentils: { safe: true, name: 'Lentils', note: 'Plain cooked. Good fiber.', safeFor: 'dog' },
  quinoa: { safe: true, name: 'Quinoa', note: 'Plain cooked. No seasoning.', safeFor: 'dog' },
  'plain beef': { safe: true, name: 'Plain beef', note: 'Cooked, lean, no seasoning.', safeFor: 'dog' },
  'plain pork': { safe: true, name: 'Plain pork', note: 'Cooked, lean, no seasoning.', safeFor: 'dog' },
  'corn': { safe: true, name: 'Corn', note: 'Kernels only. Never corn on the cob — choking hazard.', safeFor: 'dog' },
  honey: { safe: true, name: 'Honey', note: 'Small amounts. Not for puppies under 1 year.', safeFor: 'dog' },
};

const SEVERITY_COLORS = { low: 'bg-amber-100 text-amber-800', moderate: 'bg-orange-100 text-orange-800', high: 'bg-red-100 text-red-800', severe: 'bg-red-200 text-red-900' };
const QUICK_FOODS = ['Chocolate', 'Grapes', 'Apple', 'Banana', 'Carrot', 'Onions', 'Garlic', 'Peanut butter', 'Chicken', 'Xylitol', 'Bacon', 'Cheese', 'Bread', 'Milk', 'Salmon', 'Avocado', 'Bone', 'Pizza', 'Ice cream', 'Coffee', 'Gum', 'Raisins', 'Mushroom', 'Nutmeg'];

const TESTIMONIALS = [
  { quote: 'PawLog made handing off my dog to the sitter so easy. One link and they had everything.', name: 'Sarah M.', location: 'Austin, TX' },
  { quote: 'Finally stopped forgetting my dog\'s medicine. The reminders are a lifesaver.', name: 'James K.', location: 'Seattle, WA' },
  { quote: 'One link and my sitter had routines, vet info, allergies. So easy.', name: 'Emily R.', location: 'Denver, CO' },
  { quote: 'I travel for work and PawLog keeps my cat\'s care consistent. Worth every penny.', name: 'Michael T.', location: 'Chicago, IL' },
  { quote: 'The food safety checker is so helpful. I check everything before giving my dog a treat.', name: 'Jessica L.', location: 'Portland, OR' },
  { quote: 'Shared the care sheet with my parents. They finally know exactly how to care for my dog.', name: 'David P.', location: 'Austin, TX' },
  { quote: 'Simple, clean, and works. My sitter loved the care sheet.', name: 'Amanda N.', location: 'San Francisco, CA' },
  { quote: 'No more scribbled notes. One link and my sitter has everything.', name: 'Chris B.', location: 'Boston, MA' },
];

const SCREENSHOTS = [
  { src: '/screenshots/dashboard.png', alt: 'Dashboard with your pets and daily tasks', caption: 'Your pets at a glance' },
  { src: '/screenshots/shared-routine.png', alt: 'Share care sheet with sitters', caption: 'Share with sitters' },
  { src: '/screenshots/pet-profile.png', alt: 'Pet profile with routines and logs', caption: 'Routines & logs' },
];

// Curated images that clearly match each resource (dog walking, cat care, feeding, etc.)
const RESOURCES = [
  { title: 'Daily walks', url: 'https://plus.unsplash.com/premium_photo-1681882152840-a2ae455095b4?w=400&h=300&fit=crop', alt: 'Person walking dog on leash outdoors' },
  { title: 'Cat care', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop', alt: 'Cat portrait' },
  { title: 'Feeding routine', url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop', alt: 'Dog with food bowl' },
  { title: 'Pet care tips', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop', alt: 'Owner with pet' },
  { title: 'Happy pets', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop', alt: 'Happy dog' },
];

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const testimonialRef = useRef(null);
  const scrollRef = useRef(null);
  const screenshotScrollRef = useRef(null);
  const screenshotTouchRef = useRef(null);

  const checkFood = (foodName) => {
    const normalized = foodName.toLowerCase().trim();
    const key = Object.keys(FOOD_DB).find(k => normalized.includes(k) || k.includes(normalized));
    if (key) setResult({ ...FOOD_DB[key], key });
    else setResult({ safe: null, name: foodName, unknown: true, key: 'unknown' });
  };

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return Object.entries(FOOD_DB)
      .filter(([k, v]) => k.includes(q) || v.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(([k, v]) => ({ key: k, ...v }));
  }, [query]);

  // Auto-advance testimonials with smooth scroll
  useEffect(() => {
    const t = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // Auto-advance screenshots
  useEffect(() => {
    const t = setInterval(() => {
      setScreenshotIndex(i => (i + 1) % SCREENSHOTS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !el.offsetWidth) return;
    el.scrollTo({
      left: testimonialIndex * el.offsetWidth,
      behavior: 'smooth',
    });
  }, [testimonialIndex]);

  useEffect(() => {
    const el = screenshotScrollRef.current;
    if (!el || !el.offsetWidth) return;
    el.scrollTo({
      left: screenshotIndex * el.offsetWidth,
      behavior: 'smooth',
    });
  }, [screenshotIndex]);

  const handleTouchStart = (e) => { testimonialRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!testimonialRef.current) return;
    const diff = testimonialRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setTestimonialIndex(i => diff > 0 ? (i + 1) % TESTIMONIALS.length : (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    }
    testimonialRef.current = null;
  };

  const handleScreenshotTouchStart = (e) => { screenshotTouchRef.current = e.touches[0]?.clientX; };
  const handleScreenshotTouchEnd = (e) => {
    const start = screenshotTouchRef.current;
    if (start == null) return;
    const diff = start - (e.changedTouches[0]?.clientX ?? 0);
    if (Math.abs(diff) > 50) {
      setScreenshotIndex(i => diff > 0 ? (i + 1) % SCREENSHOTS.length : (i - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);
    }
    screenshotTouchRef.current = null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="flex items-center gap-2 font-semibold text-gray-800">
            <span className="text-xl">🐾</span> PawLog
          </span>
          <Link to="/signin" className="text-sm font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4">
          Pet care made simple
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Manage routines, share care sheets with sitters, and never miss a feeding or walk.
        </p>
        <Link to="/signin" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
          Start for Free
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Is it safe for them?</h2>
          <p className="text-sm text-gray-600 mb-4">Search or tap to check — dogs & cats. Not a substitute for vet advice.</p>
          <div className="relative mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setResult(null); }}
              onKeyDown={(e) => e.key === 'Enter' && query.trim() && checkFood(query)}
              placeholder="Type a food (e.g. chocolate, apple, chicken)..."
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            {suggestions.length > 0 && !result && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                {suggestions.map(s => (
                  <li key={s.key}>
                    <button type="button" onClick={() => { checkFood(s.name); setQuery(s.name); }} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2">
                      <span className={s.safe === false ? 'text-red-600' : s.safe ? 'text-green-600' : 'text-gray-500'}>{s.safe === false ? '⚠' : s.safe ? '✓' : '?'}</span>
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_FOODS.map(f => (
              <button key={f} onClick={() => { checkFood(f); setQuery(f); }} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                {f}
              </button>
            ))}
          </div>
          {result && (
            <div className={`mt-4 p-5 rounded-xl border ${
              result.unknown ? 'bg-amber-50 border-amber-200' :
              result.safe ? 'bg-green-50 border-green-200' : 'bg-red-50/50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{result.unknown ? '❓' : result.safe ? '✅' : '⚠️'}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{result.name}</h3>
                  {result.unknown ? (
                      <>
                        <p className="text-amber-800 mt-2 font-medium">We don&apos;t have this in our database.</p>
                        <p className="text-amber-700 mt-1">When in doubt, check with your vet before feeding.</p>
                      </>
                    ) : result.safe ? (
                    <p className="text-green-800 mt-1">{result.note}</p>
                  ) : (
                    <>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[result.severity] || 'bg-gray-100'}`}>
                        {result.severity} risk
                      </span>
                      <p className="text-xs text-gray-600 mt-2 font-medium">Symptoms:</p>
                      <p className="text-sm text-gray-500">{result.symptoms}</p>
                      <p className="text-xs text-gray-600 mt-2 font-medium">What to do:</p>
                      <p className="text-sm text-gray-700">{result.action}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">What pet parents say</h2>
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full px-2 snap-start"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <span className="text-4xl text-primary/30 font-serif leading-none">"</span>
                  <p className="text-gray-700 text-lg leading-relaxed -mt-4 mb-6 max-w-xl mx-auto">
                    {t.quote}
                  </p>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500 mt-1 sm:text-base">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setTestimonialIndex(i)}
              className={`h-2 rounded-full transition-all ${i === testimonialIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">See PawLog in action</h2>
        <div
          ref={screenshotScrollRef}
          className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide"
          onTouchStart={handleScreenshotTouchStart}
          onTouchEnd={handleScreenshotTouchEnd}
        >
          <div className="flex">
            {SCREENSHOTS.map((s, i) => (
              <div key={i} className="flex-shrink-0 w-full px-2 snap-start">
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white max-w-3xl mx-auto">
                  <img src={s.src} alt={s.alt} className="w-full aspect-[3/4] sm:aspect-[4/3] object-cover object-top" loading={i === 0 ? 'eager' : 'lazy'} />
                  <p className="p-4 text-base font-medium text-gray-700 text-center">{s.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {SCREENSHOTS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setScreenshotIndex(i)}
              className={`h-2 rounded-full transition-all ${i === screenshotIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`View screenshot ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Pet care resources</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {RESOURCES.map((r, i) => (
            <a
              key={i}
              href="https://www.aspca.org/pet-care/animal-poison-control"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow block"
            >
              <img src={r.url} alt={r.alt} className="w-full h-32 object-cover" loading="lazy" />
              <p className="p-2 text-sm font-medium text-gray-700">{r.title}</p>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 mt-16">
        <AppFooter />
      </footer>
    </div>
  );
}
