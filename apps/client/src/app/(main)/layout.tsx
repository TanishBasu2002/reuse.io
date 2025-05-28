import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { AuthProvider } from "@repo/ui/lib/context";
import { Asidebar } from "@repo/ui/components/main/sidebar";
import { Header } from "@repo/ui/components/main/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Asidebar />
        <SidebarInset>
          <main className="w-full">
            <Header />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
