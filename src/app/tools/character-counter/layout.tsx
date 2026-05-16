import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("character-counter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
