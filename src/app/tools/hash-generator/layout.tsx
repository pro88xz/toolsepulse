import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("hash-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
