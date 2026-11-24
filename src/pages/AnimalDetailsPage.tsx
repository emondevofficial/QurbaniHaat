import React, { useState, useEffect } from 'react';
import animalsData from '../data/animals.json';
import { Animal, BookingFormData } from '../types';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, MARKETPLACE_CURRENCY } from '../config/env';
import { 
  ArrowLeft, 
  Scale, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Lock, 
  Phone, 
  Mail, 
  Home, 
  FileText, 
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const AnimalDetailsPage: React.FC = () => {
  const { query, navigate } = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loadingAnimal, setLoadingAnimal] = useState<boolean>(true);

  // Booking Form State
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryDate: '',
    specialInstructions: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Sync user info into form on mount
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Load animal by ID from query
  useEffect(() => {
    setLoadingAnimal(true);
    const animalId = parseInt(query.id || '1', 10);
    const found = (animalsData as Animal[]).find((a) => a.id === animalId);
    
    // Simulate brief network fetch
    const timer = setTimeout(() => {
      setAnimal(found || (animalsData as Animal[])[0]);
      setLoadingAnimal(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query.id]);

  // Private Route Check: If not authenticated, prompt user
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-center space-y-6 animate__animated animate__fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Private Buyer Route
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 font-serif mt-3">
              Authentication Required
            </h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              To review detailed veterinary records, live weight certificates, and place a booking request for this Qurbani animal, please log in or create an account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="private-route-login-btn"
              onClick={() => navigate(`/login?redirectTo=/details-page?id=${query.id || '1'}`)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 transition-colors cursor-pointer"
            >
              Log In to Continue
            </button>
            <button
              onClick={() => navigate('/animals')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Back to All Animals
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingAnimal || !animal) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-stone-500 font-medium">Loading animal veterinary file...</p>
      </div>
    );
  }

  const formattedPrice = formatCurrency(animal.price);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast('Please fill in all required booking fields.', 'warning', 'Missing Details');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setBookingSuccess(true);

      // Toast Success Message (Prompt Requirement: "Show success toast message")
      showToast(
        `🎉 Booking request placed successfully for ${animal.name}! Our representative will contact ${formData.phone} shortly.`,
        'success',
        'Booking Confirmed'
      );

      // Reset form (Prompt Requirement: "The booking form will be reset on submit and show a success message. (Data will not save in DB or Local Storage)")
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        deliveryDate: '',
        specialInstructions: ''
      });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-animals-btn"
          onClick={() => navigate('/animals')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Animals</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span>Livestock</span>
          <span>/</span>
          <span>{animal.type}</span>
          <span>/</span>
          <span className="font-semibold text-stone-800">#{animal.id.toString().padStart(3, '0')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left 7 Columns: Full Details View */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Showcase Image */}
          <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-200 shadow-lg">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-80 sm:h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {animal.type}
              </span>
              <span className="bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-stone-200/50">
                {animal.category}
              </span>
            </div>

            {/* Bottom Overlay Price & Location */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Farm Origin: {animal.location}, Bangladesh</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
                  {animal.name}
                </h1>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-stone-300 uppercase font-semibold">Fixed Price</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{formattedPrice}</p>
              </div>
            </div>
          </div>

          {/* Quick Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <Scale className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-stone-400 uppercase font-semibold">Live Weight</p>
              <p className="text-base font-bold text-stone-900 mt-0.5">{animal.weight} kg</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-stone-400 uppercase font-semibold">Verified Age</p>
              <p className="text-base font-bold text-stone-900 mt-0.5">{animal.age} Years</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-stone-400 uppercase font-semibold">Teeth Count</p>
              <p className="text-base font-bold text-stone-900 mt-0.5">{animal.teethCount || 2} Teeth</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-stone-400 uppercase font-semibold">Breed</p>
              <p className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">{animal.breed}</p>
            </div>
          </div>

          {/* Description & Detailed Specs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                Animal Profile & Temperament
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {animal.description}
              </p>
            </div>

            {/* Health & Diet Specifications */}
            <div className="border-t border-stone-100 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Veterinary & Nutritional Audit
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-800">Vaccination Status:</span>
                    <p className="text-stone-500 mt-0.5">{animal.vaccinationStatus || 'Fully Vaccinated against FMD & Anthrax'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-800">Natural Diet:</span>
                    <p className="text-stone-500 mt-0.5">{animal.diet || 'Green Napier grass, corn silage, rice bran'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-800">Color & Coat:</span>
                    <p className="text-stone-500 mt-0.5">{animal.color || 'Healthy natural coat'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-800">Qurbani Validity:</span>
                    <p className="text-stone-500 mt-0.5">100% Shariah compliant (Clear vision, intact ears, strong limbs)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Boarding Notice */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold">Complimentary Farm Boarding: </span>
                Once your booking is confirmed, the pastoral farm will board, wash, feed, and care for this animal free of charge until 24 hours prior to Eid day.
              </div>
            </div>

          </div>

        </div>

        {/* Right 5 Columns: Booking Form */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
            
            <div className="border-b border-stone-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Reserve Animal
                </span>
                <span className="text-xs text-stone-400 font-medium">Fixed Rate</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 mt-2">
                Place Booking Request
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter your contact & delivery coordinates to lock in this animal.
              </p>
            </div>

            {bookingSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1.5 animate__animated animate__bounceIn">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Booking Request Confirmed!</span>
                </div>
                <p className="text-emerald-700">
                  Order Total: <span className="font-mono font-bold">{formattedPrice}</span> ({MARKETPLACE_CURRENCY}).
                </p>
                <p className="text-stone-500 text-[11px]">
                  The booking invoice has been logged. Our logistics team will contact your phone for vehicle delivery coordination.
                </p>
              </div>
            )}

            {/* Booking Form (Prompt: name, email, phone, address) */}
            <form id="animal-booking-form" onSubmit={handleBookingSubmit} className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="booking-name-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Shabaz Mahamood"
                  required
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="booking-email-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. buyer@example.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="booking-phone-input"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +880 1700-000000"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Delivery Address / Garage Location <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="booking-address-input"
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House/Plot number, Road, Sector, City (e.g. Uttara Sector 4, Dhaka)"
                  required
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all resize-none"
                />
              </div>

              {/* Optional Preferred Delivery Date */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Preferred Delivery Date (Optional)
                </label>
                <input
                  id="booking-delivery-date-input"
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>

              {/* Price Breakdown Preview */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Animal Fixed Price:</span>
                  <span className="font-mono font-medium text-stone-800">{formattedPrice}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Marketplace Currency:</span>
                  <span className="font-mono font-semibold text-emerald-800">{MARKETPLACE_CURRENCY}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Farm Boarding & Feed:</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Veterinary Inspection Certificate:</span>
                  <span className="text-emerald-700 font-bold">INCLUDED</span>
                </div>
                <div className="border-t border-stone-200 pt-1.5 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Total Payable on Delivery:</span>
                  <span className="text-emerald-800 font-mono">{formattedPrice}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-booking-btn"
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm Qurbani Booking</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                By clicking confirm, you agree to our fair livestock terms. Payment is completed upon live inspection during vehicle handover.
              </p>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
