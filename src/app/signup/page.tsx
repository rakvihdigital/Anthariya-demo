import type { Metadata } from "next";
import { AuthLayout } from "@/components/AuthLayout";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Anthariya account to save sarees to your wishlist and get a first look at new weaves.",
  robots: { index: false },
};

export default function SignupPage() {
  return <AuthLayout mode="signup" />;
}
