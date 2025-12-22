import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Outlet } from "react-router"
import Navbar from "./Navbar"
export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="overflow-x-hidden w-full">
                <div className="relative flex overflow-y-auto  grow flex-col h-screen ">
                    <header>
                        <Navbar />
                    </header>
                    <main className="flex-1 space-y-2  relative  p-5">
                        <div className="w-full mx-auto ">
                            <Outlet />
                        </div>
                    </main>

                </div>

            </div>

        </SidebarProvider>
    )
}