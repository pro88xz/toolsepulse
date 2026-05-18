import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("pdf-password-protector");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
