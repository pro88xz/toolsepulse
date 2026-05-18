import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("pdf-crop");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
