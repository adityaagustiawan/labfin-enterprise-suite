import { TerminalLayout } from "@/components/terminal-layout";

export default function TerminalRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <TerminalLayout>
      {children}
    </TerminalLayout>
  );
}
