import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("lorem-ipsum-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
