import React, { useState, useEffect, useMemo } from 'react';
import animalsData from '../data/animals.json';
import { Animal } from '../types';
import { AnimalCard } from '../components/AnimalCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useRouter } from '../context/RouterContext';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Filter, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';

export const AllAnimalsPage: React.FC = () => {
  const { query } = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filtering & Sorting states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>(query.type || 'All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'weight-desc'>('default');

  useEffect(() => {
    // If URL has type query, sync it
    if (query.type) {
      setSelectedType(query.type);
    }
  }, [query.type]);

  useEffect(() => {
    // Simulate async data fetching with loading skeleton
    setLoading(true);
    const timer = setTimeout(() => {
      setAnimals(animalsData as Animal[]);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      // Type match
      const matchesType = selectedType === 'All' || animal.type.toLowerCase() === selectedType.toLowerCase();

      // Category match
      const matchesCategory = selectedCategory === 'All' || animal.category === selectedCategory;

      // Search match (name, breed, location, description)
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || (
        animal.name.toLowerCase().includes(q) ||
        animal.breed.toLowerCase().includes(q) ||
        animal.location.toLowerCase().includes(q) ||
        animal.description.toLowerCase().includes(q)
      );

      return matchesType && matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'weight-desc') return b.weight - a.weight;
      return a.id - b.id; // default
    });
  }, [animals, selectedType, selectedCategory, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('All');
    setSelectedCategory('All');
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-stone-900 rounded-3xl p-8 sm:p-10 text-white shadow-lg border border-stone-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Complete Qurbani Marketplace Inventory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
            Explore All Qurbani Animals
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Browse authentic local Deshi cows, heavy Shahiwal bulls, and Kushtia Black Bengal goats. Filter by price, live weight, and age criteria.
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        
        {/* Top Controls: Search and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="animal-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by breed (e.g. Shahiwal, Deshi), name, or farm location..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Price Dropdown (Requirement: Sort by price) */}
          <div className="sm:col-span-5 flex items-center gap-2">
            <div className="w-full relative">
              <ArrowUpDown className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="animal-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer appearance-none"
              >
                <option value="default">Sort: Default Featured</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
                <option value="weight-desc">Sort: Live Weight (Heaviest First)</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
                ▼
              </div>
            </div>

            {(searchTerm || selectedType !== 'All' || selectedCategory !== 'All' || sortBy !== 'default') && (
              <button
                id="reset-filters-btn"
                onClick={handleResetFilters}
                title="Reset All Filters"
                className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Bottom Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
          
          {/* Animal Type Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              Type:
            </span>
            {['All', 'Cow', 'Goat', 'Sheep'].map((type) => (
              <button
                key={type}
                id={`filter-type-${type.toLowerCase()}`}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {type === 'All' ? 'All Types' : type}
              </button>
            ))}
          </div>

          {/* Size Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Size:
            </span>
            {['All', 'Large Animal', 'Medium Animal', 'Small Animal'].map((cat) => (
              <button
                key={cat}
                id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 px-1">
        <p>
          Showing <span className="font-bold text-stone-900">{filteredAnimals.length}</span> of {animals.length} registered livestock
        </p>
        {sortBy !== 'default' && (
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            Sorted active
          </span>
        )}
      </div>

      {/* Grid or Loading state */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : filteredAnimals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimals.map((animal, idx) => (
            <AnimalCard key={animal.id} animal={animal} index={idx} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No animals match your filters</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We couldn't find any livestock matching "{searchTerm || selectedType}". Try adjusting your search query or reset your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
