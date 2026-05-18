import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("pdf-text-extractor");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
