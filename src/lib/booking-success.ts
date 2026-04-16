export type BookingSuccessState = {
  providerName: string;
  dateDisplay: string;
  timeDisplay: string;
  dial: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extrasLines: { label: string; price: string }[];
  extrasTotalDisplay: string;
};

const KEY = "bookflow-booking-success";

export function saveBookingSuccess(s: BookingSuccessState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function readBookingSuccess(): BookingSuccessState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BookingSuccessState;
  } catch {
    return null;
  }
}

export function clearBookingSuccess() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
