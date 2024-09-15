import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Email is invalid'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password is too short')
        .max(32, 'Password is too long')
});

export const signUpSchema = loginSchema.extend({
    firstName: z
        .string({ required_error: 'First name is required' })
        .min(2, 'First name is too short'),
    lastName: z
        .string({ required_error: 'Last name is required' })
        .min(2, 'Last name is too short')
});
