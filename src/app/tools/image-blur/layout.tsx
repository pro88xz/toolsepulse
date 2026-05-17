import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("image-blur");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
