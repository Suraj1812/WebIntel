import type { Plan } from "@prisma/client";

export type SessionSnapshot = {
  id: string;
  email: string;
  name: string;
  company: string | null;
  avatarUrl: string | null;
  plan: Plan;
  role: string;
};
