import { INDIAN_STATES_AND_CITIES } from '@/data/indianCities';

export interface LocationItem {
  city: string;
  state: string;
}

const LOCATION_STORAGE_KEY = 'drkhojo_user_location';

export const locationService = {
  getAllStates(): string[] {
    return INDIAN_STATES_AND_CITIES.map((g) => g.state);
  },

  getCitiesByState(stateName: string): string[] {
    const group = INDIAN_STATES_AND_CITIES.find(
      (g) => g.state.toLowerCase() === stateName.toLowerCase()
    );
    return group ? group.cities : [];
  },

  getCurrentLocation(): LocationItem {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return { city: 'Jaipur', state: 'Rajasthan' };
  },

  setCurrentLocation(loc: LocationItem): LocationItem {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
      } catch {
        // ignore
      }
    }
    return loc;
  },

  searchLocations(query: string, stateFilter: string = 'All'): LocationItem[] {
    const q = query.trim().toLowerCase();
    const results: LocationItem[] = [];

    INDIAN_STATES_AND_CITIES.forEach((group) => {
      if (stateFilter !== 'All' && group.state !== stateFilter) return;

      const stateMatches = group.state.toLowerCase().includes(q);
      group.cities.forEach((city) => {
        if (!q || stateMatches || city.toLowerCase().includes(q)) {
          results.push({ city, state: group.state });
        }
      });
    });

    return results;
  },

  getAllCities(): LocationItem[] {
    const list: LocationItem[] = [];
    INDIAN_STATES_AND_CITIES.forEach((group) => {
      group.cities.forEach((city) => {
        list.push({ city, state: group.state });
      });
    });
    return list;
  },
};

