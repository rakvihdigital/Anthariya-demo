"use client";

/*
 * Account pages — front-end only for now.
 * The signed-in name/email is remembered in this browser so the header can greet the customer.
 * Passwords are never stored. Connect these forms to a real backend (e.g. Supabase, Firebase, Clerk) before launch.
 */
import Link from "next/link";
import { useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { emailOk, phoneOk, waLink } from "@/lib/config";
import { Icon, type IconName } from "./Icon";
import { useStore } from "./StoreProvider";

type Mode = "login" | "signup";

function Field({ id, label, icon, error, password, ...input }: InputHTMLAttributes<HTMLInputElement> & {
  id: string; label: string; icon: IconName; error?: string; password?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className={`ifield${error ? " is-invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="ifield__box">
        <Icon name={icon} />
        <input id={id} {...input} type={password ? (show ? "text" : "password") : input.type} aria-invalid={!!error} />
        {password && (
          <button type="button" className="ifield__eye" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
            <Icon name={show ? "eye-off" : "eye"} />
          </button>
        )}
      </div>
      <span className="field__err" aria-live="polite">{error}</span>
    </div>
  );
}

const STRENGTH = ["Too short", "Weak", "Fair", "Good", "Strong"];
function strength(v: string) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
  return v.length < 8 ? Math.min(s, 1) : s;
}

const nameFromEmail = (email: string) => email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function Done({ mode, title, text }: { mode: Mode; title: string; text: string }) {
  const { signOut } = useStore();
  return (
    <div className="auth__done">
      <span className="auth__done-icon"><Icon name="check" /></span>
      <h1 className="auth__title">{title}</h1>
      <p className="auth__lead">{text}</p>
      <div className="auth__done-btns">
        {mode === "login" ? (
          <>
            <Link href="/shop" className="btn btn--plum">Continue Shopping</Link>
            <Link href="/account" className="btn btn--line">My Orders</Link>
          </>
        ) : (
          <>
            <Link href="/shop" className="btn btn--plum">Start Shopping</Link>
            <Link href="/" className="btn btn--line">Go to Home</Link>
          </>
        )}
      </div>
      <button type="button" className="auth__link" onClick={signOut}>Sign out</button>
    </div>
  );
}

function LoginForm() {
  const { user, signIn, toast } = useStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reset, setReset] = useState(false);
  const [resetMsg, setResetMsg] = useState<ReactNode>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const email = (f.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (f.elements.namedItem("password") as HTMLInputElement).value;
    const errs = {
      email: emailOk(email) ? "" : "Please enter a valid email address.",
      password: password ? "" : "Please enter your password.",
    };
    setErrors(errs);
    if (errs.email || errs.password) { (f.elements.namedItem(errs.email ? "email" : "password") as HTMLInputElement).focus(); return; }
    signIn({ name: user && user.email === email ? user.name : nameFromEmail(email), email });
    toast("Signed in");
  };

  const submitReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const email = input.value.trim();
    if (!emailOk(email)) { setErrors({ reset: "Please enter a valid email address." }); input.focus(); return; }
    setErrors({});
    setResetMsg(<>Thank you! To reset your password quickly, <a href={waLink(`Hello! Please help me reset my Anthariya password. My email is ${email}.`)} target="_blank" rel="noopener">message us on WhatsApp</a> and we’ll help you right away.</>);
  };

  if (user) return <Done mode="login" title={`Welcome back, ${user.name.split(" ")[0]}!`} text={`You’re signed in as ${user.email}.`} />;

  if (reset) return (
    <form className="auth__form" noValidate onSubmit={submitReset}>
      <div>
        <h1 className="auth__title">Reset <em>password</em></h1>
        <p className="auth__lead">Enter the email you signed up with and we’ll help you get back in.</p>
      </div>
      <Field id="r-email" name="email" type="email" label="Email address" icon="mail" placeholder="you@example.com" autoComplete="email" autoFocus error={errors.reset} />
      <button className="btn btn--plum btn--block" type="submit">Send Reset Link</button>
      {resetMsg && <p className="auth__msg" aria-live="polite">{resetMsg}</p>}
      <p className="auth__alt"><button type="button" className="auth__link" onClick={() => { setReset(false); setResetMsg(null); }}>← Back to sign in</button></p>
    </form>
  );

  return (
    <form className="auth__form" noValidate onSubmit={submit}>
      <div>
        <h1 className="auth__title">Sign <em>in</em></h1>
        <p className="auth__lead">Good to see you again. Enter your details to continue.</p>
      </div>
      <Field id="l-email" name="email" type="email" label="Email address" icon="mail" placeholder="you@example.com" autoComplete="email" error={errors.email} />
      <Field id="l-pass" name="password" password label="Password" icon="lock" placeholder="Your password" autoComplete="current-password" error={errors.password} />
      <div className="auth__row">
        <label className="check"><input type="checkbox" name="remember" defaultChecked /><span>Remember me</span></label>
        <button type="button" className="auth__link" onClick={() => setReset(true)}>Forgot password?</button>
      </div>
      <button className="btn btn--plum btn--block" type="submit">Sign In <Icon name="arrow" arrow /></button>
      <div className="auth__or"><span>or</span></div>
      <Link href="/shop" className="btn btn--line btn--block">Continue as Guest</Link>
      <p className="auth__alt">New to Anthariya? <Link href="/signup">Create an account</Link></p>
    </form>
  );
}

function SignupForm() {
  const { user, signIn, toast } = useStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pw, setPw] = useState("");
  const [justJoined, setJustJoined] = useState(false);
  const level = strength(pw);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const val = (n: string) => (f.elements.namedItem(n) as HTMLInputElement).value;
    const terms = (f.elements.namedItem("terms") as HTMLInputElement).checked;
    const errs: Record<string, string> = {
      name: val("name").trim().length >= 2 ? "" : "Please enter your full name.",
      email: emailOk(val("email").trim()) ? "" : "Please enter a valid email address.",
      phone: phoneOk(val("phone")) ? "" : "Please enter a valid mobile number.",
      password: val("password").length >= 8 ? "" : "Use at least 8 characters.",
      confirm: val("confirm") === val("password") ? "" : "Passwords don’t match.",
      terms: terms ? "" : "Please accept the terms to continue.",
    };
    setErrors(errs);
    const bad = Object.keys(errs).find((k) => errs[k]);
    if (bad) { (f.elements.namedItem(bad) as HTMLInputElement).focus(); return; }
    signIn({ name: val("name").trim(), email: val("email").trim() });
    setJustJoined(true);
    toast("Account created");
  };

  if (user) return justJoined
    ? <Done mode="signup" title={`Welcome, ${user.name.split(" ")[0]}!`} text="Your Anthariya account is ready. Start saving the sarees you love." />
    : <Done mode="signup" title={`Hi, ${user.name.split(" ")[0]}`} text={`You’re signed in as ${user.email}.`} />;

  return (
    <form className="auth__form" noValidate onSubmit={submit}>
      <div>
        <h1 className="auth__title">Create <em>account</em></h1>
        <p className="auth__lead">A few details and you’re in.</p>
      </div>
      <Field id="s-name" name="name" type="text" label="Full name" icon="user" placeholder="Your name" autoComplete="name" error={errors.name} />
      <div className="auth__grid">
        <Field id="s-email" name="email" type="email" label="Email address" icon="mail" placeholder="you@example.com" autoComplete="email" error={errors.email} />
        <Field id="s-phone" name="phone" type="tel" label="Mobile number" icon="phone" placeholder="+91" autoComplete="tel" error={errors.phone} />
      </div>
      <div className="auth__grid">
        <Field id="s-pass" name="password" password label="Password" icon="lock" placeholder="Min. 8 characters" autoComplete="new-password"
          error={errors.password} value={pw} onChange={(e) => setPw(e.target.value)} />
        <Field id="s-pass2" name="confirm" password label="Confirm password" icon="lock" placeholder="Repeat password" autoComplete="new-password" error={errors.confirm} />
      </div>
      <div className="strength" data-level={pw ? level : ""} aria-live="polite">
        <div className="strength__bars"><i /><i /><i /><i /></div>
        <span>{pw ? `Password strength: ${STRENGTH[level]}` : "Use 8+ characters with a mix of letters, numbers & symbols"}</span>
      </div>
      <div className="auth__checks">
        <label className="check"><input type="checkbox" name="terms" /><span>I agree to the <Link href="/contact#faq">terms &amp; policies</Link></span></label>
        <span className="field__err" aria-live="polite">{errors.terms}</span>
        <label className="check"><input type="checkbox" name="news" defaultChecked /><span>Send me new arrivals &amp; festive edits</span></label>
      </div>
      <button className="btn btn--plum btn--block" type="submit">Create Account <Icon name="arrow" arrow /></button>
      <p className="auth__alt">Already have an account? <Link href="/login">Sign in</Link></p>
    </form>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  return mode === "login" ? <LoginForm /> : <SignupForm />;
}
