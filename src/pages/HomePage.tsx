import React, { useState, useEffect } from 'react';
import animalsData from '../data/animals.json';
import { Animal } from '../types';
import { AnimalCard } from '../components/AnimalCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useRouter } from '../context/RouterContext';
import { APP_TITLE, formatCurrency } from '../config/env';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  HeartHandshake, 
  Scale, 
  Award,
  Truck,
  BookOpen,
  HelpCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [featuredAnimals, setFeaturedAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate async data fetching with loading state
    const timer = setTimeout(() => {
      const featured = (animalsData as Animal[]).filter((a) => a.isFeatured).slice(0, 4);
      setFeaturedAnimals(featured.length > 0 ? featured : (animalsData as Animal[]).slice(0, 4));
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  const topBreeds = [
    {
      name: 'Shahiwal Cross (শাহিওয়াল)',
      origin: 'Montgomery & North Bengal Farms',
      characteristics: 'Distinctive dewlap and hump, high muscle yield, calm nature, and superior lean meat ratio.',
      idealFor: 'Large Families & 7-Share Qurbani',
      badge: 'Most Popular',
      image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Black Bengal Goat (ব্ল্যাক বেঙ্গল)',
      origin: 'Kushtia & Chuadanga Grazing Belts',
      characteristics: 'World-renowned for ultra-tender, succulent meat texture, thin skin, and natural resilience.',
      idealFor: 'Individual & Small Family Qurbani',
      badge: 'Heritage Prize',
      image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Red Chittagong Cattle (RCC)',
      origin: 'Chittagong Coastal Belt',
      characteristics: 'Rich reddish coat, disease-tolerant indigenous genetic stock, organic pasture diet.',
      idealFor: 'Pure Deshi Connoisseurs',
      badge: 'Organic Deshi',
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Jamunapari Goat (যমুনাপারি)',
      origin: 'Rajshahi & Chapainawabganj',
      characteristics: 'Tall stature with long flowing pendulous ears, energetic build, and substantial weight.',
      idealFor: 'Prized Showcase Sacrifice',
      badge: 'Premium Size',
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const qurbaniTips = [
    {
      title: 'Age Criteria Verification',
      desc: 'Cattle (Cow/Bull) must be minimum 2 full lunar years of age with at least 2 permanent incisor teeth grown. Goats must be at least 1 full year.',
      icon: Clock,
      badge: 'Shariah Mandate'
    },
    {
      title: 'Physical Perfection & Health',
      desc: 'Animal must be free from disqualifying physical defects: no blindness, no broken horns down to the root, no limp preventing normal walking.',
      icon: ShieldCheck,
      badge: 'Sacrificial Criteria'
    },
    {
      title: 'Ethical Nutrition & Welfare',
      desc: 'Our animals are reared strictly on green fodder, Napier grass, and natural grains without harmful fattening chemicals or artificial hormone pellets.',
      icon: HeartHandshake,
      badge: 'Halal Feeding'
    },
    {
      title: 'Live Weight Transparency',
      desc: `Every animal at ${APP_TITLE} has an unedited digital scale weight certificate recorded within 48 hours prior to market listing.`,
      icon: Scale,
      badge: 'Zero Fraud'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION WITH BANNER & BROWSE BUTTON */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-900 text-white py-20 lg:py-28">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold backdrop-blur-md animate__animated animate__fadeInDown">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Premier Qurbani Livestock Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif leading-[1.15] animate__animated animate__fadeInUp">
                Sacred Sacrifice, <br />
                <span className="text-emerald-400">Ethically Raised</span> Livestock.
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
                Skip chaotic street haats. Explore vetted Deshi cows, Shahiwal bulls, and Kushtia Black Bengal goats directly from trusted rural pastoral farms with guaranteed digital weigh-in and doorstep safe delivery.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id="hero-browse-animals-btn"
                  onClick={() => navigate('/animals')}
                  className="px-7 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore All Animals</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-learn-tips-btn"
                  onClick={() => {
                    const el = document.getElementById('qurbani-tips-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-4 bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-sm sm:text-base font-semibold rounded-xl border border-stone-700 backdrop-blur-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Qurbani Guidelines</span>
                </button>
              </div>

              {/* Quick Feature Metric Counters */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">1,250+</div>
                  <div className="text-xs text-stone-400 font-medium mt-0.5">Verified Animals</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
                  <div className="text-xs text-stone-400 font-medium mt-0.5">Shariah Age Check</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">64</div>
                  <div className="text-xs text-stone-400 font-medium mt-0.5">Districts Delivery</div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 animate__animated animate__fadeInRight">
                <img
                  src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80"
                  alt="Featured Qurbani Bull"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Float Card Overlay */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-stone-900 shadow-xl border border-stone-200/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        Spotlight Cattle
                      </span>
                      <h4 className="text-base font-bold text-stone-900 mt-1">Shahiwal Royal Bull #002</h4>
                      <p className="text-xs text-stone-500 font-medium">Sirajganj Farm • 460 kg Live Weight</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-400 font-semibold uppercase">Fixed</p>
                      <p className="text-base font-bold text-emerald-700 font-mono">{formatCurrency(240000)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED ANIMALS (4 ITEMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Handpicked For Eid Sacrifice</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 font-serif">
              Featured Qurbani Animals
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Top health-audited cattle and goats ready for immediate booking with free farm boarding until Eid day.
            </p>
          </div>

          <button
            id="view-all-animals-link-btn"
            onClick={() => navigate('/animals')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group cursor-pointer"
          >
            <span>Browse All {animalsData.length} Animals</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading State or Featured Animals Grid */}
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAnimals.map((animal, idx) => (
              <AnimalCard key={animal.id} animal={animal} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* 3. EXTRA SECTION: QURBANI TIPS (ISLAMIC SACRIFICE GUIDELINES) */}
      <section id="qurbani-tips-section" className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authentic Islamic Knowledge</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 font-serif">
              Essential Qurbani Guidelines & Health Tips
            </h2>
            <p className="text-sm sm:text-base text-stone-500 mt-2">
              Ensuring your sacrifice is valid, humane, and spiritually rewarded according to Islamic jurisprudence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qurbaniTips.map((tip, idx) => {
              const IconComp = tip.icon;
              return (
                <div 
                  key={idx}
                  className="bg-stone-50 rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                        {tip.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Certified at {APP_TITLE}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EXTRA SECTION: TOP BREEDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Genetics & Proven Meat Quality</span>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 font-serif">
            Top Qurbani Livestock Breeds
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Understanding breed attributes helps you pick the right temperament, yield, and flavor profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topBreeds.map((breed, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                <img
                  src={breed.image}
                  alt={breed.name}
                  className="w-full h-full object-cover grayscale-[0.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
                  {breed.badge}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {breed.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    Origin: {breed.origin}
                  </p>
                  <p className="text-xs text-stone-500 mt-3 leading-relaxed">
                    {breed.characteristics}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <p className="text-[11px] text-stone-400 font-medium">Recommended for:</p>
                  <p className="text-xs font-bold text-stone-800 mt-0.5">{breed.idealFor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ADDITIONAL REQUIREMENT: "ADD ONE EXTRA SECTION" */}
      {/* Verified Halal & Vet Inspection Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-stone-800">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>4-Tier Quality Guarantee</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight leading-snug">
              Our Certified Veterinarian & Halal Inspection Standard
            </h2>
            
            <p className="text-sm sm:text-base text-stone-300 mt-3 leading-relaxed">
              Every cow, bull, and goat listed on {APP_TITLE} passes rigorous on-farm physical vetting. No chemical injections, no swollen hormone tricks, and no undisclosed ailments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-start gap-3 bg-stone-800/80 border border-stone-700/80 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Digital Live Weighing</h4>
                  <p className="text-xs text-stone-400 mt-1">Calibrated scales eliminate guesswork. Exact live weight documented on video.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-800/80 border border-stone-700/80 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Dental & Age Inspection</h4>
                  <p className="text-xs text-stone-400 mt-1">Two-teeth Shariah criteria physically certified by registered Upazila vets.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-800/80 border border-stone-700/80 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Free Boarding Until Eid</h4>
                  <p className="text-xs text-stone-400 mt-1">Book early and let our farms feed, wash, and board your animal until Eid eve.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-800/80 border border-stone-700/80 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Safe Air-Suspension Trucks</h4>
                  <p className="text-xs text-stone-400 mt-1">Stress-free, straw-bedded transport vehicles delivered right to your garage.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 flex items-center gap-4">
              <button
                onClick={() => navigate('/animals')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-950/40 transition-colors cursor-pointer"
              >
                Find Your Qurbani Animal Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
