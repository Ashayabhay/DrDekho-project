import { Doctor } from '@/components/DoctorCard';

export const INITIAL_MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma',
    speciality: 'General Physician',
    qualification: 'MBBS, MD (Internal Medicine)',
    experienceYears: 14,
    clinicName: 'Sharma Health Clinic',
    address: '12-A, Tonk Road, Near SMS Hospital',
    city: 'Jaipur',
    availabilityToday: '10:00 AM - 1:30 PM, 5:00 PM - 8:00 PM',
    consultationFee: 400,
    providesEmergency: true,
    emergencyFee: 600,
    emergencyHours: '06:00 PM - 10:00 PM',
    emergencyInstructions: 'Report to emergency counter at clinic. Urgent triage available.',
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Verma',
    speciality: 'Dermatologist',
    qualification: 'MBBS, DDVL (Skin & Hair)',
    experienceYears: 9,
    clinicName: 'Skin Care & Laser Center',
    address: '45, Vaishali Nagar, Main Market',
    city: 'Jaipur',
    availabilityToday: '11:00 AM - 3:00 PM',
    consultationFee: 500,
    providesEmergency: false,
  },
  {
    id: 'doc-3',
    name: 'Dr. Vikramaditya Singh',
    speciality: 'Pediatrician',
    qualification: 'MBBS, DCH (Child Specialist)',
    experienceYears: 11,
    clinicName: 'Little Care Children Clinic',
    address: '88, Malviya Nagar, Sector 3',
    city: 'Jaipur',
    availabilityToday: '4:00 PM - 8:30 PM',
    consultationFee: 450,
    providesEmergency: true,
    emergencyFee: 650,
    emergencyHours: '04:00 PM - 09:00 PM',
    emergencyInstructions: 'Pediatric emergencies given priority counter token.',
  },
  {
    id: 'doc-4',
    name: 'Dr. Sunita Gupta',
    speciality: 'Gynecologist',
    qualification: 'MBBS, MS (Obs & Gynae)',
    experienceYears: 16,
    clinicName: 'Womens Wellness Care',
    address: '22, Defence Colony, Ring Road',
    city: 'New Delhi',
    availabilityToday: '10:30 AM - 2:30 PM',
    consultationFee: 600,
  },
  {
    id: 'doc-5',
    name: 'Dr. Amit Mehta',
    speciality: 'Orthopedist',
    qualification: 'MBBS, MS (Ortho)',
    experienceYears: 12,
    clinicName: 'Bone & Joint Clinic',
    address: '104, Andheri West, Near Metro Station',
    city: 'Mumbai',
    availabilityToday: '5:00 PM - 9:00 PM',
    consultationFee: 700,
  },
  {
    id: 'doc-6',
    name: 'Dr. Priya Nair',
    speciality: 'Dentist',
    qualification: 'BDS, MDS (Orthodontics)',
    experienceYears: 8,
    clinicName: 'Smile Care Dental Studio',
    address: '15, Indiranagar 100ft Road',
    city: 'Bengaluru',
    availabilityToday: '10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM',
    consultationFee: 350,
  },
  {
    id: 'doc-7',
    name: 'Dr. Alok Verma',
    speciality: 'General Physician',
    qualification: 'MBBS, MD',
    experienceYears: 15,
    clinicName: 'Patna Medicare Clinic',
    address: 'Boring Road, Crossing',
    city: 'Patna',
    availabilityToday: '9:00 AM - 1:00 PM',
    consultationFee: 400,
  },
  {
    id: 'doc-8',
    name: 'Dr. Manish Kumar',
    speciality: 'Pediatrician',
    qualification: 'MBBS, DCH',
    experienceYears: 10,
    clinicName: 'Gaya Children Clinic',
    address: 'Station Road',
    city: 'Gaya',
    availabilityToday: '10:00 AM - 2:00 PM',
    consultationFee: 350,
  },
];

const STORAGE_KEY = 'drkhojo_doctors_data';

export const doctorService = {
  getAllDoctors(): Doctor[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_DOCTORS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback if localStorage unavailable
    }
    return INITIAL_MOCK_DOCTORS;
  },

  getDoctorById(id: string): Doctor | undefined {
    const doctors = this.getAllDoctors();
    return doctors.find((d) => d.id === id);
  },

  getDoctorsByFilter(filters: { city?: string; speciality?: string; query?: string }): Doctor[] {
    const doctors = this.getAllDoctors();
    return doctors.filter((doc) => {
      const matchesCity = !filters.city || doc.city.toLowerCase() === filters.city.toLowerCase();
      const matchesSpeciality =
        !filters.speciality ||
        filters.speciality === 'All Specialities' ||
        doc.speciality === filters.speciality;
      const matchesQuery =
        !filters.query ||
        doc.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(filters.query.toLowerCase()) ||
        doc.clinicName.toLowerCase().includes(filters.query.toLowerCase()) ||
        doc.city.toLowerCase().includes(filters.query.toLowerCase());

      return matchesCity && matchesSpeciality && matchesQuery;
    });
  },

  registerDoctor(doctor: Doctor): Doctor {
    const doctors = this.getAllDoctors();
    const updated = [doctor, ...doctors];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return doctor;
  },

  isEmergencyAvailableNow(
    doctor: Doctor,
    now: Date = new Date()
  ): { isAvailable: boolean; reason: string; hours?: string } {
    return isEmergencyAvailableNow(doctor, now);
  },
};

export function parseTimeToMinutes(timeStr: string): number | null {
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3];

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function isEmergencyAvailableNow(
  doctor: Doctor,
  now: Date = new Date()
): { isAvailable: boolean; reason: string; hours?: string } {
  if (!doctor.providesEmergency) {
    return {
      isAvailable: false,
      reason: 'This doctor does not provide emergency appointments.',
    };
  }

  const hoursStr = doctor.emergencyHours?.trim();
  if (!hoursStr) {
    return {
      isAvailable: true,
      reason: 'Emergency appointment available now',
    };
  }

  if (hoursStr.toLowerCase().includes('24/7') || hoursStr.toLowerCase().includes('24 hours')) {
    return {
      isAvailable: true,
      reason: 'Emergency appointment available now (24/7 Service)',
      hours: hoursStr,
    };
  }

  // Parse start and end times e.g. "6:00 PM - 10:00 PM" or "6 PM – 10 PM"
  const parts = hoursStr.split(/[-–—to]/i);
  if (parts.length >= 2) {
    const startMins = parseTimeToMinutes(parts[0]);
    const endMins = parseTimeToMinutes(parts[1]);

    if (startMins !== null && endMins !== null) {
      const currentMins = now.getHours() * 60 + now.getMinutes();
      let withinHours = false;
      if (startMins <= endMins) {
        withinHours = currentMins >= startMins && currentMins <= endMins;
      } else {
        // Overnight emergency window (e.g. 8:00 PM to 4:00 AM)
        withinHours = currentMins >= startMins || currentMins <= endMins;
      }

      if (withinHours) {
        return {
          isAvailable: true,
          reason: 'Emergency appointment available now',
          hours: hoursStr,
        };
      } else {
        return {
          isAvailable: false,
          reason: `Emergency appointments are currently unavailable (Emergency hours: ${hoursStr}).`,
          hours: hoursStr,
        };
      }
    }
  }

  return {
    isAvailable: true,
    reason: 'Emergency appointment available now',
    hours: hoursStr,
  };
}
