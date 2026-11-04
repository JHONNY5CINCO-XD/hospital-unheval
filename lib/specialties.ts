export const SPECIALTIES = [
  'Medicina General',
  'Psicología',
  'Odontología',
  'Nutrición',
  'Pediatría',
  'Ginecología',
  'Dermatología',
] as const
export type Specialty = (typeof SPECIALTIES)[number]