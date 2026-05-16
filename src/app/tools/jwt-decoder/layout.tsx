import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("jwt-decoder");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
