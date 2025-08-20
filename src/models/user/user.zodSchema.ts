import z from 'zod';
import { AgentStatus, Role } from './user.interface';
const pin6Strong =
  /^(?!0)(?!.*(\d)\1{5})(?!123456|234567|345678|456789)(?!987654|876543|765432|654321)\d{6}$/;

export const createUserZodSchema = z.object({
  name: z.string(),
  phone: z
    .string()
    .min(11)
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, 'Invalid Bangladesh Number'),
  email: z.string().email('Please provide a valid email'),
  password: z
    .string()
    .min(6, 'Pin must be at least 6 characters long')
    .regex(
      pin6Strong,
      'Pin must be a strong 6-digit pin without repeating digits or sequential numbers'
    ),
  role: z.enum(Role).optional(),
  isActive: z.boolean().optional(),
  agentStatus: z.enum(AgentStatus).optional(),
});
