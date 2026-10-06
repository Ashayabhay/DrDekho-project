'use client';

import React, { useState, useEffect } from 'react';
import { locationService, LocationItem } from '@/services/locationService';
import { MapPin, Search, Globe, ChevronRight } from 'lucide-react';

export default function AdminLocationsPage() {
  const [allStates, setAllStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('Bihar');
  const [citiesInState, setCitiesInState] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCities, setAllCities] = useState<LocationItem[]>([]);

  useEffect(() => {
    const states = locationService.getAllStates();
    setAllStates(states);
    const cities = locationService.getAllCities();
    setAllCities(cities);
  }, []);

  useEffect(() => {
    if (selectedState) {
      setCitiesInState(locationService.getCitiesByState(selectedState));
    }
  }, [selectedState]);

  const filteredAllCities = searchQuery
    ? allCities.filter(
        (c) =>
          c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Locations & Coverage Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pan-India geographic hierarchy: State / UT → District / City
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-slate-700">
          Total Coverage: <span className="font-bold text-teal-700">{allCities.length} Cities</span> across{' '}
          <span className="font-bold text-teal-700">{allStates.length} States/UTs</span>
        </div>
      </div>

      {/* Global City Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Quick search any Indian city or state..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {searchQuery ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Search Results ({filteredAllCities.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredAllCities.map((item, idx) => (
              <div
                key={`${item.city}-${idx}`}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex flex-col"
              >
                <span className="font-bold text-slate-900">{item.city}</span>
                <span className="text-[11px] text-slate-500">{item.state}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* States Sidebar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider px-2">
              Select State / UT ({allStates.length})
            </h2>
            <div className="max-h-[560px] overflow-y-auto space-y-1 pr-1">
              {allStates.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedState(st)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                    selectedState === st
                      ? 'bg-teal-700 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{st}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      selectedState === st ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Cities Grid for Selected State */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  Cities in {selectedState}
                </h2>
                <p className="text-xs text-slate-500">
                  {citiesInState.length} active cities available for doctor filtering & discovery
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {citiesInState.map((city) => (
                <div
                  key={city}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-teal-50/50 hover:border-teal-200 transition-colors"
                >
                  <div className="text-xs font-bold text-slate-900">{city}</div>
                  <div className="text-[11px] text-slate-400">{selectedState}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
