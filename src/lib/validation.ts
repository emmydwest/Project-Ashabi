import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name must be under 50 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  termsAccepted: z.literal(true, {
    error: "Please accept the Terms and Privacy Policy to continue.",
  }),
});

export const reportContentSchema = z.object({
  storySlug: z.string().min(1),
  chapterSlug: z.string().optional(),
  reason: z.enum([
    "rights_or_attribution",
    "age_suitability",
    "formatting_or_broken_page",
    "other",
  ]),
  details: z
    .string()
    .trim()
    .max(500, "Please keep details under 500 characters.")
    .optional(),
});
