import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("batch-image-converter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
