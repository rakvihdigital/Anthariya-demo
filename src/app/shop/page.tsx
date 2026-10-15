import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient, ShopView } from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "Shop Sarees",
  description: "Shop handpicked Kanjivaram silk, Banarasi, organza, georgette and ajrakh cotton sarees at Anthariya by Nidhi Gowda.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopView query="" />}>
      <ShopClient />
    </Suspense>
  );
}
