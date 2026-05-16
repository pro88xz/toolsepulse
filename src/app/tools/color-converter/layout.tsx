import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("color-converter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
