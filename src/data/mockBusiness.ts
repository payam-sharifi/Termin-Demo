export type MockProvider = {
  id: string
  name: string
  role: string
}

export type MockLineItem = {
  id: string
  labelKey: string
  price: number
  currency: string
}

export type MockDialCode = {
  dial: string
  labelKey: string
}

export type MockAddress = {
  street: string
  city: string
  postalCode: string
  region: string
}

export type DateAvailability = 'available' | 'partial' | 'full' | 'closed'

/** Static demo data — edit here to rebrand or change options. */
export const mockBusiness = {
  brandName: 'BookFlow',
  brandSubtitle: 'Online booking demo',
  socialUrl: 'https://instagram.com',
  providers: [
    {
      id: 'vansy',
      name: 'Vansy',
      role: 'Staff',
    },
    {
      id: 'marco',
      name: 'Marco',
      role: 'Staff',
    },
    {
      id: 'leni',
      name: 'Leni',
      role: 'Staff',
    },
  ] satisfies MockProvider[],
  /** YYYY-MM-DD — not offered / closed (greyed) */
  closedDates: [
    '2026-04-05',
    '2026-04-06',
    '2026-04-12',
    '2026-04-13',
    '2026-04-19',
    '2026-04-26',
  ],
  /** YYYY-MM-DD — brown border (partially booked), still selectable */
  partialDates: ['2026-04-16', '2026-04-17'],
  /** YYYY-MM-DD — red border, not selectable */
  fullDates: ['2026-04-21'],
  /**
   * All time slots shown in the picker (30‑minute steps).
   * Match typical business hours ~10:00–19:30.
   */
  timeSlots: [
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
  ],
  /** HH:mm — shown disabled / not bookable (demo) */
  disabledTimeSlots: ['11:30', '13:30'],
  lineItems: [
    {
      id: 'service-1',
      labelKey: 'service-1',
      price: 15,
      currency: 'EUR',
    },  
    {
      id: 'service-2',
      labelKey: 'service-2',
      price: 13,
      currency: 'EUR',
    },
    {
      id: 'service-3',
      labelKey: 'service-3',
      price: 18,
      currency: 'EUR',
    },
    {
        id: 'service-4',
      labelKey: 'service-4',
      price: 49,
      currency: 'EUR',
    },
  ] satisfies MockLineItem[],
  dialCodes: [
    { dial: '+49', labelKey: 'dial_de' },
    { dial: '+43', labelKey: 'dial_at' },
    { dial: '+41', labelKey: 'dial_ch' },
    { dial: '+44', labelKey: 'dial_gb' },
    { dial: '+33', labelKey: 'dial_fr' },
    { dial: '+1', labelKey: 'dial_us' },
  ] satisfies MockDialCode[],
  /** Demo — Hamburger Rathaus area; used in UI and “Open in Google Maps”. */
  address: {
    street: 'Rathausmarkt 1',
    postalCode: '20095',
    city: 'Hamburg',
    region: 'Germany',
  } satisfies MockAddress,
}

export function getDateAvailability(iso: string): DateAvailability {
  if (mockBusiness.fullDates.includes(iso)) return 'full'
  if (mockBusiness.closedDates.includes(iso)) return 'closed'
  if (mockBusiness.partialDates.includes(iso)) return 'partial'
  return 'available'
}

const disabledTimes = new Set(mockBusiness.disabledTimeSlots)

export function isTimeSlotDisabled(slot: string): boolean {
  return disabledTimes.has(slot)
}
