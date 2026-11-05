"use server";
// Sign-up for the gift code: parse → spam checks → validate → deliver → typed result (references/forms.md).
// Works without JS (the form posts here and the page re-renders with the result).
import { headers } from "next/headers";
import { deliver } from "@/lib/delivery/newsletter";
import { features } from "@/lib/features";
import { MIN_FILL_MS, SIGNUP_FIELDS, signupSchema, type SignupState } from "@/lib/signup/schema";

const RATE = { max: 5, windowMs: 10 * 60_000 };
const hits = new Map<string, number[]>(); // per-IP timestamps; one Node instance (use a KV store on serverless)

function rateLimited(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE.max;
}

export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  if (!features.signup) return { status: "error", fieldErrors: {}, message: "server" };
  const now = Date.now();
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // bots: a filled trap field or a submit faster than a person can type → quietly accept, deliver nothing
  const trap = formData.get(SIGNUP_FIELDS.trap);
  const startedAt = Number(formData.get(SIGNUP_FIELDS.startedAt));
  if ((typeof trap === "string" && trap !== "") || (startedAt > 0 && now - startedAt < MIN_FILL_MS)) {
    console.warn("[signup] dropped as spam");
    return { status: "ok" };
  }
  if (rateLimited(ip, now)) return { status: "error", fieldErrors: {}, message: "server" };

  const parsed = signupSchema.safeParse({
    email: formData.get(SIGNUP_FIELDS.email) ?? "",
    consent: formData.get(SIGNUP_FIELDS.consent) ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Extract<SignupState, { status: "error" }>["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "email" || field === "consent") fieldErrors[field] = true;
    }
    return { status: "error", fieldErrors };
  }

  const locale = String(formData.get(SIGNUP_FIELDS.locale) ?? "cs");
  const result = await deliver({ email: parsed.data.email, locale, consentAt: new Date(now).toISOString() });
  if (!result.ok) {
    console.error("[signup] delivery failed:", result.reason);
    return { status: "error", fieldErrors: {}, message: "server" };
  }
  return { status: "ok" };
}
