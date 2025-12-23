import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Outlet } from "react-router"
import Navbar from "./Navbar"
import { useSidebar } from "@/components/ui/sidebar"

function LayoutContent() {
    const { open } = useSidebar();
    
    return (
        <div className={`overflow-x-hidden w-full transition-all duration-300 ease-in-out ${
            open ? "lg:ml-0" : "lg:ml-0"
        }`}>
            <div className="relative flex overflow-y-auto  grow flex-col h-screen">
                <header className="max-h-14 h-full border-b sticky top-0 z-11  md:block">
                    <Navbar />
                </header>
                <main className="flex-1 space-y-2  relative  p-5">
                    <div className="w-full mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <LayoutContent />
        </SidebarProvider>
    )
}