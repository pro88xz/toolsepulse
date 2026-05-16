import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("slug-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
