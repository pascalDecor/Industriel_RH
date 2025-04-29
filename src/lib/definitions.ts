import { z } from "zod";

export const SignUpFormSchema = z.object({
  // name: z
  //   .string()
  //   .min(2, { message: 'Name must be at least 2 characters long.' })
  //   .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    // .regex(/[0-9]/, { message: 'Contain at least one number.' })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'Contain at least one special character.',
    // })
    .trim()
});

export const AddArticleFormSchema = z.object({
  titre: z
    .string()
    .min(2, { message: "Le titre doit contenir au moins 2 caractères." })
    .trim(),

  contenu: z.object({}),
  image: z.string(),

  published: z.boolean(),

  tags: z
    .object({
      connect: z
        .array(z.object({ id: z.string() }))
        .optional()
        .default([])
    })
    .optional()
    .default({ connect: [] }),

  specialites: z
    .object({
      connect: z
        .array(z.object({ id: z.string() }))
        .optional()
        .default([])
    })
    .optional()
    .default({ connect: [] }),

  authorId: z.string(),

  author: z
    .object({
      connect: z.object({
        id: z.string()
      })
    })
    .optional()
});

export const SignUpOTPFormSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Code OTP must be at least 6 characters long" })
    .trim()
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type FormStateOTP =
  | {
      errors?: {
        otp?: string[];
      };
      message?: string;
    }
  | undefined;
