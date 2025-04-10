import { z } from "zod";

export const invitationSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title cannot exceed 100 characters.",
    }),
  address: z
    .string()
    .min(5, {
      message: "Address must be at least 5 characters.",
    })
    .max(255, {
      message: "Address cannot exceed 255 characters.",
    }),
  activity_date: z.date({
    required_error: "Activity date is required",
  }),
  activity_time: z.string({
    required_error: "Activity time is required",
  }),
  acceptance_label: z
    .string()
    .min(2, {
      message: "Accept button text must be at least 2 characters.",
    })
    .max(100, {
      message: "Accept button text cannot exceed 100 characters.",
    })
    .default("Accept"),
  rejection_label: z
    .string()
    .min(2, {
      message: "Decline button text must be at least 2 characters.",
    })
    .max(100, {
      message: "Decline button text cannot exceed 100 characters.",
    })
    .default("Decline"),
  close_date: z.date(),
  background_color: z.string().default("#FFFFFF"),
  primary_color: z.string().default("#000000"),
  secondary_color: z.string().default("#f5f5f5"),
  font_family: z.string().default("Roboto"),
  italicize: z.boolean().default(false),
  background_gradient: z.boolean().default(false),
  secondary_gradient: z.boolean().default(false),
  style: z.string().default("DEFAULT"),
  background_image: z
    .union([
      z.instanceof(File), // For new file uploads
      z.string().url(), // For existing URLs
      z.string(), // Allow empty string
    ])
    .optional(),
  position: z
    .object({
      lat: z.string(),
      lng: z.string(),
    })
    .default({
      lat: "0",
      lng: "0",
    }),
});
