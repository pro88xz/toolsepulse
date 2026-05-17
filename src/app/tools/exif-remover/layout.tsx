import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("exif-remover");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
