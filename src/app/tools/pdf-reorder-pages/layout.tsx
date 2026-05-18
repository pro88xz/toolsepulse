import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("pdf-reorder-pages");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
