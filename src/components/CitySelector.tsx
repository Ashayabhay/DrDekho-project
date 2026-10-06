'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, ChevronDown, Search, X, Check, Building2, Compass } from 'lucide-react';
import { INDIAN_STATES_AND_CITIES } from '@/data/indianCities';

export interface LocationSelection {
  city: string;
  state: string;
}

const POPULAR_CITIES: LocationSelection[] = [
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'New Delhi', state: 'Delhi NCR' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Kolkata', state: 'West Bengal' },
];

interface CitySelectorProps {
  selectedLocation: LocationSelection;
  onSelectLocation: (location: LocationSelection) => void;
}

export function CitySelector({ selectedLocation, onSelectLocation }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');

  // Filter cities and states across India
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return INDIAN_STATES_AND_CITIES.map((group) => {
      const matchesStateTab = selectedStateFilter === 'All' || group.state === selectedStateFilter;
      if (!matchesStateTab) return null;

      const matchesStateSearch = group.state.toLowerCase().includes(query);
      const matchingCities = group.cities.filter(
        (city) => matchesStateSearch || city.toLowerCase().includes(query)
      );

      if (matchingCities.length === 0) return null;

      return {
        state: group.state,
        cities: matchingCities,
      };
    }).filter(Boolean) as { state: string; cities: string[] }[];
  }, [searchQuery, selectedStateFilter]);

  // Check if current search query matches an exact existing city
  const isExactCityMatch = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return INDIAN_STATES_AND_CITIES.some((group) =>
      group.cities.some((c) => c.toLowerCase() === q)
    );
  }, [searchQuery]);

  const handleSelectCity = (city: string, state: string) => {
    onSelectLocation({ city, state });
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCustomSubmit = (cityToUse?: string) => {
    const finalCity = cityToUse || searchQuery.trim();
    if (!finalCity) return;

    handleSelectCity(finalCity, selectedStateFilter !== 'All' ? selectedStateFilter : 'India');
  };

  return (
    <div className="relative inline-block text-left">
      {/* Location Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-label="Select city and state"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all select-none cursor-pointer shadow-2xs whitespace-nowrap"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
        <span className="truncate max-w-[150px] sm:max-w-xs">
          {selectedLocation.city} <span className="font-normal text-slate-500">({selectedLocation.state})</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-teal-700 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <>
          {/* Backdrop overlay with z-[50] */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[50] transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Card with z-[60] */}
          <div
            className="fixed inset-x-3 top-16 sm:inset-auto sm:absolute sm:left-0 sm:right-auto sm:top-full sm:mt-2 z-[60] w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Search */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-teal-700" /> Choose Any Indian City or State
                  </h3>
                  <p className="text-xs text-slate-500">Search over 150+ fed Indian cities or enter any custom city name</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Type City / State Input */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomSubmit();
                    }
                  }}
                  placeholder="Type any Indian city name (e.g., Jaipur, Sikar, Udaipur, Pune)..."
                  className="w-full pl-9 pr-24 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-inner text-slate-900"
                  autoFocus
                />
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => handleCustomSubmit()}
                    className="absolute right-1.5 px-3 py-1 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors shadow-xs"
                  >
                    Select City
                  </button>
                )}
              </div>

              {/* Quick Popular Cities Chips */}
              <div className="pt-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-teal-600" /> Popular Cities
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {POPULAR_CITIES.map((pop) => (
                    <button
                      key={pop.city}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCity(pop.city, pop.state);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                        selectedLocation.city.toLowerCase() === pop.city.toLowerCase()
                          ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                          : 'bg-white text-slate-700 hover:bg-teal-50 border-slate-200'
                      }`}
                    >
                      {pop.city}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs pt-1 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setSelectedStateFilter('All')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedStateFilter === 'All'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  All States ({INDIAN_STATES_AND_CITIES.length})
                </button>
                {INDIAN_STATES_AND_CITIES.map((group) => (
                  <button
                    key={group.state}
                    type="button"
                    onClick={() => setSelectedStateFilter(group.state)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedStateFilter === group.state
                        ? 'bg-teal-700 text-white font-semibold'
                        : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                    }`}
                  >
                    {group.state}
                  </button>
                ))}
              </div>
            </div>

            {/* City List Grouped by State */}
            <div className="p-4 overflow-y-auto space-y-5 max-h-[50vh]">
              {/* Option to select user's typed custom city if not exact match */}
              {searchQuery.trim() && !isExactCityMatch && (
                <div className="p-3 bg-teal-50/90 rounded-xl border border-teal-300 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-teal-800">Enter custom city name</div>
                    <div className="text-sm font-extrabold text-teal-950">&quot;{searchQuery.trim()}&quot;</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCustomSubmit()}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs cursor-pointer"
                  >
                    Find Doctors in &quot;{searchQuery.trim()}&quot;
                  </button>
                </div>
              )}

              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <div key={group.state} className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-100/70 border border-teal-200 px-2.5 py-1 rounded-md inline-block">
                      State: {group.state} ({group.cities.length} Cities)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {group.cities.map((cityName) => {
                        const isSelected =
                          selectedLocation.city.toLowerCase() === cityName.toLowerCase() &&
                          selectedLocation.state.toLowerCase() === group.state.toLowerCase();
                        return (
                          <button
                            key={cityName}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectCity(cityName, group.state);
                            }}
                            className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border cursor-pointer ${
                              isSelected
                                ? 'bg-teal-700 text-white border-teal-700 shadow-sm font-semibold'
                                : 'bg-white text-slate-700 hover:bg-teal-50 hover:border-teal-300 border-slate-200'
                            }`}
                          >
                            <span className="truncate">{cityName}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No fed city found matching &quot;{searchQuery}&quot;. Click &quot;Find Doctors in &apos;{searchQuery}&apos;&quot; above to search your entered city name.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
