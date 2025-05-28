import { MainNav } from "@repo/ui/components/nav";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainNav />
        <main className="min-h-screen bg-background pt-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
