import type { Metadata } from "next";
import { AuthLayout } from "@/components/AuthLayout";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Anthariya account to see your wishlist and shop handpicked sarees faster.",
  robots: { index: false },
};

export default function LoginPage() {
  return <AuthLayout mode="login" />;
}
