import React from 'react';
import { Animal } from '../types';
import { useRouter } from '../context/RouterContext';
import { formatCurrency } from '../config/env';
import { 
  Scale, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight,
  Tag
} from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
  index?: number;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, index = 0 }) => {
  const { navigate } = useRouter();

  const formattedPrice = formatCurrency(animal.price);

  return (
    <div 
      id={`animal-card-${animal.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 flex flex-col hover:-translate-y-1"
    >
      {/* Image & Badges */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-100">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover object-center grayscale-[0.08] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-60" />
        
        {/* Type & Category Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest shadow-sm">
            {animal.type}
          </span>
          <span className="bg-white/95 backdrop-blur-md text-stone-700 text-[10px] font-semibold px-2 py-1 rounded shadow-sm border border-stone-200">
            {animal.category}
          </span>
        </div>

        {/* Location Pin */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span>{animal.location}</span>
        </div>

        {/* Teeth / Qurbani Age verified badge */}
        {animal.teethCount && (
          <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>{animal.teethCount} Teeth</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Breed & ID */}
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1.5">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-600" />
              {animal.breed}
            </span>
            <span className="text-stone-400 font-normal">ID: #{animal.id.toString().padStart(3, '0')}</span>
          </div>

          {/* Title and Price */}
          <div className="flex justify-between items-baseline gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {animal.name}
            </h3>
            <span className="text-base sm:text-lg font-extrabold text-emerald-700 font-mono whitespace-nowrap">
              {formattedPrice}
            </span>
          </div>

          {/* Filter / Metric pills from Professional Polish design */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200 font-medium">
              {animal.weight} KG
            </span>
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200 font-medium">
              {animal.age} Years
            </span>
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200 font-medium">
              {animal.location}
            </span>
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
            {animal.description}
          </p>
        </div>

        {/* Footer: View Details CTA button styled per Professional Polish */}
        <div className="pt-2">
          <button
            id={`view-details-btn-${animal.id}`}
            onClick={() => navigate(`/details-page?id=${animal.id}`)}
            className="w-full bg-stone-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs group-hover:shadow-md"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
