import { BookedAppointment } from '@/components/AppointmentsModal';

const APPOINTMENTS_STORAGE_KEY = 'drkhojo_user_appointments';

export const appointmentService = {
  getAllAppointments(): BookedAppointment[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    // New user starts with ZERO appointments per product rules
    return [];
  },

  getAppointmentById(id: string): BookedAppointment | undefined {
    const list = this.getAllAppointments();
    return list.find((a) => a.id === id);
  },

  createAppointment(appointment: BookedAppointment): BookedAppointment {
    const list = this.getAllAppointments();
    const updated = [appointment, ...list];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return appointment;
  },

  cancelAppointment(id: string): boolean {
    const list = this.getAllAppointments();
    let found = false;
    const updated = list.map((a) => {
      if (a.id === id) {
        found = true;
        return { ...a, status: 'CANCELLED' as const };
      }
      return a;
    });

    if (found && typeof window !== 'undefined') {
      try {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return found;
  },

  rescheduleAppointment(id: string, newDate: string, newTimeSlot: string): boolean {
    const list = this.getAllAppointments();
    let found = false;
    const updated = list.map((a) => {
      if (a.id === id) {
        found = true;
        return { ...a, date: newDate, timeSlot: newTimeSlot, status: 'CONFIRMED' as const };
      }
      return a;
    });

    if (found && typeof window !== 'undefined') {
      try {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return found;
  },
};
