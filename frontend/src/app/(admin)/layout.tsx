import Header from "@/components/admin/header";
import AppSidebar from "@/components/admin/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth-provider";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Header />
                    <div className="px-2 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    );
}
