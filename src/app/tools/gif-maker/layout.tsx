import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("gif-maker");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
