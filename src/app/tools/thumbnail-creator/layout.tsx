import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("thumbnail-creator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
