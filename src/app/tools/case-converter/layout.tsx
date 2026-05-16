import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("case-converter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
