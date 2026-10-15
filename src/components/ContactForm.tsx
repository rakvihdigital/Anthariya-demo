"use client";

import { useState, type FocusEvent, type FormEvent } from "react";
import { emailOk, phoneOk } from "@/lib/config";
import { Icon } from "./Icon";
import { useStore } from "./StoreProvider";

const RULES: Record<string, (v: string) => true | string> = {
  name: (v) => v.trim().length >= 2 || "Please tell us your name.",
  email: (v) => emailOk(v.trim()) || "Please enter a valid email address.",
  phone: (v) => phoneOk(v) || "Please enter a valid phone number.",
  message: (v) => v.trim().length >= 10 || "A few more words, please (at least 10 characters).",
};

export function ContactForm() {
  const { toast } = useStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const check = (name: string, value: string) => {
    const rule = RULES[name];
    if (!rule) return true;
    const res = rule(value);
    setErrors((e) => ({ ...e, [name]: res === true ? "" : res }));
    return res === true;
  };
  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => check(e.target.name, e.target.value);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.keys(RULES).map((n) => form.elements.namedItem(n) as HTMLInputElement);
    const ok = fields.map((f) => check(f.name, f.value)).every(Boolean);
    if (!ok) { fields.find((f) => RULES[f.name](f.value) !== true)?.focus(); return; }
    setSent(true);
    form.reset();
    toast("Message sent. We'll be in touch soon!");
  };

  const field = (name: string) => ({ className: `field${errors[name] ? " is-invalid" : ""}` });
  const err = (name: string) => <span className="field__err" aria-live="polite">{errors[name]}</span>;

  return (
    <form className="form" noValidate onSubmit={submit}>
      <div {...field("name")}>
        <label htmlFor="c-name">Full name *</label>
        <input id="c-name" name="name" type="text" placeholder="Your name" autoComplete="name" required onBlur={onBlur} />
        {err("name")}
      </div>
      <div {...field("phone")}>
        <label htmlFor="c-phone">Phone</label>
        <input id="c-phone" name="phone" type="tel" placeholder="+91" autoComplete="tel" onBlur={onBlur} />
        {err("phone")}
      </div>
      <div className={`${field("email").className} full`}>
        <label htmlFor="c-email">Email *</label>
        <input id="c-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required onBlur={onBlur} />
        {err("email")}
      </div>
      <div className="field full">
        <label htmlFor="c-topic">I’m writing about</label>
        <div className="select">
          <select id="c-topic" name="topic">
            <option>A saree I saw online</option>
            <option>Bridal &amp; wedding shopping</option>
            <option>Blouse stitching</option>
            <option>An existing order</option>
            <option>Something else</option>
          </select>
          <Icon name="chev" />
        </div>
      </div>
      <div className={`${field("message").className} full`}>
        <label htmlFor="c-msg">Message *</label>
        <textarea id="c-msg" name="message" placeholder="Tell us the occasion, colours you love, or your question…" required onBlur={onBlur} />
        {err("message")}
      </div>
      <div className={`form-success${sent ? " is-on" : ""}`} role="status">
        <Icon name="check" />
        <div><strong>Thank you for writing to us!</strong><br />Your message has been received. We’ll get back to you within one working day.</div>
      </div>
      <button type="submit" className="btn btn--plum">Send Message <Icon name="arrow" arrow /></button>
    </form>
  );
}
