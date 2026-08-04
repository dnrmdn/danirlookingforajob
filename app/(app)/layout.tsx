import { AppShell } from "@/components/layout/AppShell";

export default function AppLayoutGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
