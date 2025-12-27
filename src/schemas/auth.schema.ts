import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter" }),
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Konfirmasi password wajib diisi" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;