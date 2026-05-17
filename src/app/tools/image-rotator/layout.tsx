import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("image-rotator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
