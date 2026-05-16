import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("url-encoder");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
