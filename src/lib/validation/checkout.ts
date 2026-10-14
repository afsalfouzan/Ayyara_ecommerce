import { z } from 'zod';
import { site } from '@/lib/site';

// Zod speeds itself up by generating code at runtime, which the site's security
// policy forbids (and reports). The form is tiny, so plain validation is used.
z.config({ jitless: true });

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

/**
 * Guest checkout details. The backend applies the same rules; this copy only
 * gives customers instant feedback (keep in sync with Backend orders.service.ts).
 */
export const checkoutSchema = z.object({
  email: z.email('Enter a valid email address').max(254),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
    .pipe(z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')),
  fullName: z.string().trim().min(2, 'Enter your full name').max(120),
  addressLine1: z.string().trim().min(5, 'Enter your house number and street').max(200),
  addressLine2: z.string().trim().max(200).optional().default(''),
  city: z.string().trim().min(2, 'Enter your city').max(100),
  state: z.enum(INDIAN_STATES, { error: 'Select your state' }).refine((state) => (site.policies.deliveryStates as readonly string[]).includes(state), `We currently deliver only within ${site.policies.deliveryArea}`),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit PIN code'),
  notes: z.string().trim().max(500).optional().default(''),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutDetails = z.output<typeof checkoutSchema>;
