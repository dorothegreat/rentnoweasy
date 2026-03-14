import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  propertyType: z.string().min(1, "Select property type"),

  address: z.string().min(3, "Address is required"),

  rentAmount: z
  .number()
  .min(1, "Rent amount must be greater than 0"),
  serviceCharge: z.number().optional(),
cautionFee: z.number().optional(),
legalFee: z.number().optional(),

  rentDuration: z.string().min(1, "Select rent duration"),

  bedrooms: z.number().min(0),

  bathrooms: z.number().min(0),

  parking: z.number().min(0),

  payment_frequency: z.string(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  images: z.array(z.any()).optional(),

  videoUrl: z.string().optional(),

  fullName: z.string().min(2, "Full name is required"),

  email: z.string().email("Invalid email address"),

  phone: z.string().min(7, "Phone number is required"),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;