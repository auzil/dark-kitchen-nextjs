"use client";
/*
 * E-mail + marketing consent → gift code (was js/signup-form.js). Checks on submit exactly like the prototype
 * (messages next to the field, announced, focus to the first problem); a valid form posts to the
 * `signup` Server Action, which validates again and delivers. Without JS the form still posts and the
 * page re-renders with the action's result.
 */
import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { signup } from "@/app/actions/signup";
import { Button } from "@/components/ui/Button/Button";
import { Checkbox, FieldError, FieldLabel, TextInput } from "@/components/ui/Field/Field";
import { initialSignupState, SIGNUP_FIELDS, type SignupField } from "@/lib/signup/schema";
import styles from "./SignupForm.module.scss";

export type SignupCopy = {
  emailLabel: string;
  emailPlaceholder: string;
  consent: string;
  privacyLink: string;
  submit: string;
  terms: string;
  done: string;
  errors: Record<SignupField | "server", string>;
};

type Errors = Partial<Record<SignupField, true>>;

export function SignupForm({ copy, locale }: { copy: SignupCopy; locale: string }) {
  const [state, formAction] = useActionState(signup, initialSignupState);
  const [clientErrors, setClientErrors] = useState<Errors | null>(null);
  const [checked, setChecked] = useState(false);
  const successRef = useRef<HTMLParagraphElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // the bot check measures from when the form became usable, not from the build
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status === "ok") successRef.current?.focus();
  }, [state]);

  const done = state.status === "ok";
  const errors: Errors = clientErrors ?? (state.status === "error" ? state.fieldErrors : {});
  const shown = checked || state.status !== "idle";
  const invalid = (field: SignupField) => (shown ? String(Boolean(errors[field])) : undefined) as "true" | "false" | undefined;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const email = form.elements.namedItem(SIGNUP_FIELDS.email) as HTMLInputElement;
    const consent = form.elements.namedItem(SIGNUP_FIELDS.consent) as HTMLInputElement;
    const emailOk = email.value.trim() !== "" && email.checkValidity();
    const found: Errors = {};
    if (!emailOk) found.email = true;
    if (!consent.checked) found.consent = true;
    setChecked(true);

    if (found.email || found.consent) {
      event.preventDefault();
      setClientErrors(found);
      if (found.email) email.focus();
      else consent.focus();
      return;
    }
    setClientErrors(null); // valid: the action runs and its result decides what shows
  }

  return (
    <form className={styles.root} action={formAction} onSubmit={onSubmit} noValidate data-signup="">
      <div className={styles.fields} data-fields="" hidden={done}>
        <div>
          <FieldLabel htmlFor="signup-email">{copy.emailLabel}</FieldLabel>
          <TextInput
            id="signup-email"
            name={SIGNUP_FIELDS.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder={copy.emailPlaceholder}
            aria-describedby="err-email"
            aria-invalid={invalid("email")}
          />
        </div>
        <FieldError id="err-email" name="email" message={errors.email ? copy.errors.email : null} />
        <Checkbox name={SIGNUP_FIELDS.consent} aria-describedby="err-consent" aria-invalid={invalid("consent")}>
          <span>
            <span>{copy.consent}</span>{" "}
            <a href="#privacy" data-no-scroll="">
              {copy.privacyLink}
            </a>
          </span>
        </Checkbox>
        <FieldError id="err-consent" name="consent" message={errors.consent ? copy.errors.consent : null} />
        <Button variant="fire" type="submit" className={styles.submit}>
          {copy.submit}
        </Button>
        <p className="t-fine">{copy.terms}</p>
        <FieldError id="err-form" name="form" message={state.status === "error" && state.message ? copy.errors.server : null} />
        <div className={styles.trap} aria-hidden="true">
          <input type="text" name={SIGNUP_FIELDS.trap} tabIndex={-1} autoComplete="off" />
        </div>
        <input ref={startedAtRef} type="hidden" name={SIGNUP_FIELDS.startedAt} defaultValue="" />
        <input type="hidden" name={SIGNUP_FIELDS.locale} value={locale} />
      </div>
      <p ref={successRef} className={styles.success} tabIndex={-1} data-success="" hidden={!done}>
        {copy.done}
      </p>
    </form>
  );
}
