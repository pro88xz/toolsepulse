import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("sharpen-image");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
