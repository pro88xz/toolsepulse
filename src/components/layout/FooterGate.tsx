"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

/** Hides the site footer across the games section so games own the screen. */
export default function FooterGate() {
  const pathname = usePathname();
  const isGames = /^\/games(\/|$)/.test(pathname ?? "");
  if (isGames) return null;
  return <Footer />;
}
