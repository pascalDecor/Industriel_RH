"use client";

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

export const AddApplicationFormSchema = z.object({
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .trim(),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  phone: z
    .string()
    .min(7, { message: "Be at least 10 characters long" })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .trim(),
  adresse: z
    .string()
    .min(2, { message: "Be at least 2 characters long" })
    .trim(),
  year_of_experience: z.number(),
  cv: z
    .string()
    .min(2, { message: "Please chose a document at least 5 MO." })
    .trim(),
  coverLetter: z
    .string()
    .min(2, { message: "Please chose a document at least 5 MO." })
    .trim(),
  state: z.string().trim(),
  sectorId: z.string(),
  functionId: z.string(),
  civilityId: z.string(),
  cityId: z.string()
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

export type FormStateAddApplication =
  | {
      errors?: {
        lastName?: string[];
        firstName?: string[];
        email?: string[];
        phone?: string[];
        adresse?: string[];
        cv?: string[];
        coverLetter?: string[];
        state?: string[];
        sectorId?: string[];
        functionId?: string[];
        civilityId?: string[];
        cityId?: string[];
      };
      message?: string;
    }
  | undefined;

export type FormStateAddConntact =
  | {
      errors?: {
        firstName: string[];
        lastName: string[];
        companyName?: string[];
        jobTitle?: string[];
        workEmail: string[];
        workPhone: string[];
        postalCode?: string[];
        message: string[];
        status: string[];
        priority: string[];
      };
      message?: string;
    }
  | undefined;
