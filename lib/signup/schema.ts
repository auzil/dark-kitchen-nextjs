// Sign-up form: field names, the server-side schema and the action's result. Shared by the action and the form.
import { z } from "zod";

export const SIGNUP_FIELDS = { email: "email", consent: "consent", trap: "website", startedAt: "startedAt", locale: "locale" } as const;

/** Minimum time between render and submit; anything faster is treated as a bot. */
export const MIN_FILL_MS = 3000;

export const signupSchema = z.object({
  // the same rule as the browser's <input type="email"> (the prototype validated with checkValidity())
  email: z.string().trim().max(254).regex(z.regexes.html5Email),
  consent: z.literal("on"),
});

export type SignupField = keyof z.infer<typeof signupSchema>;

/** Error *keys*; the form shows the translated text (messages signup.errors.*). */
export type SignupState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; fieldErrors: Partial<Record<SignupField, true>>; message?: "server" };

export const initialSignupState: SignupState = { status: "idle" };
