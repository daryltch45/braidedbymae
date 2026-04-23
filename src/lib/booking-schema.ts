import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Veuillez sélectionner un service"),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/, "Heure invalide"),
  location: z.enum(["HOME", "TRAVEL"]),
  travelCity: z.string().optional(),
  clientName: z.string().min(2, "Minimum 2 caractères").max(100),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z.string().optional(),
  paymentMethod: z.enum(["CASH", "ONLINE"]),
  inspirationUrl: z.string().url().optional().or(z.literal("")),
}).refine(
  (data) => data.location === "HOME" || (data.travelCity && data.travelCity.length > 0),
  { message: "Veuillez indiquer votre ville", path: ["travelCity"] }
);

export type BookingFormData = z.infer<typeof bookingSchema>;

export interface ServiceData {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameDe: string;
  descFr: string;
  descEn: string;
  descDe: string;
  priceMin: number;
  priceMax: number;
  durationMin: number;
  durationMax: number;
  imageUrl?: string | null;
}
