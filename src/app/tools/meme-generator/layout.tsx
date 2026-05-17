import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("meme-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
