// import {
//     FilePlus,
//     Files,
//     ChevronLeft,
// } from "lucide-react"
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarGroup,
//     SidebarGroupLabel,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     SidebarHeader,
//     SidebarTrigger,
// } from "@/components/ui/sidebar"
// import { ScrollArea } from "../ui/scroll-area";
// import { Link, useLocation } from "react-router";
// import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";

// const mainItems = [
//     {
//         title: "Add Document",
//         url: "/documents/add",
//         icon: FilePlus,
//         description: "",
//         badge: "New"
//     },
//     {
//         title: "All Documents",
//         url: "/documents/list",
//         icon: Files,
//         description: "",
//         badge: null
//     },

// ]
// export function AppSidebar() {
//     const location = useLocation();
//     const currentPath = location.pathname;

//     return (
//         <Sidebar className=" relative w-72 border-r border-gray-200 bg-gradient-to-b from-white to-gray-50">
//             <ScrollArea className="h-screen">
//                 {/* Header */}
//                 <SidebarHeader className="p-6 pb-4">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div className="relative">
//                                 <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
//                                     <img src="/logo-image.png" className="h-8 w-8 text-white" />
//                                 </div>
//                             </div>
//                             <div className="flex flex-col">
//                                 <p className="text-2xl font-bold text-gray-900 tracking-tight">
//                                     कागजातSack
//                                 </p>
//                                 <p className="text-xs text-gray-500 font-medium mt-0.5">
//                                     Secure Document Vault
//                                 </p>
//                             </div>
//                         </div>
//                         <SidebarTrigger className="h-8 w-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm hidden md:flex absolute top-15 right-1">
//                             <ChevronLeft className="h-4 w-4" />
//                         </SidebarTrigger>
//                     </div>
//                 </SidebarHeader>

//                 {/* Navigation Menu */}
//                 <SidebarContent className="px-4">
//                     {/* Main Navigation */}
//                     <SidebarGroup>
//                         <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
//                             Navigation
//                         </SidebarGroupLabel>
//                         <SidebarMenu className="space-y-1">
//                             {mainItems.map((item) => {
//                                 const isActive = currentPath === item.url;
//                                 const Icon = item.icon;

//                                 return (
//                                     <SidebarMenuItem key={item.title}>
//                                         <SidebarMenuButton asChild isActive={isActive}>
//                                             <Link
//                                                 to={item.url}
//                                                 className={cn(
//                                                     "group relative px-3 py-3 rounded-xl transition-all duration-200",
//                                                     isActive
//                                                         ? "bg-primary text-white shadow-md"
//                                                         : "hover:bg-gray-100 text-gray-700"
//                                                 )}
//                                             >
//                                                 <div className="flex items-center justify-between w-full">
//                                                     <div className="flex items-center gap-3">
//                                                         <div className={cn(
//                                                             "p-2 rounded-lg transition-colors",
//                                                             isActive
//                                                                 ? "bg-white/20"
//                                                                 : "bg-gray-100 group-hover:bg-gray-200"
//                                                         )}>
//                                                             <Icon className={cn(
//                                                                 "h-4 w-4",
//                                                                 isActive ? "text-white" : "text-gray-600"
//                                                             )} />
//                                                         </div>
//                                                         <div className="flex flex-col">
//                                                             <span className="text-sm font-medium">
//                                                                 {item.title}
//                                                             </span>
//                                                             <span className={cn(
//                                                                 "text-xs mt-0.5",
//                                                                 isActive ? "text-white/90" : "text-gray-500"
//                                                             )}>
//                                                                 {item.description}
//                                                             </span>
//                                                         </div>
//                                                     </div>

//                                                     {item.badge && (
//                                                         <Badge
//                                                             variant={isActive ? "secondary" : "outline"}
//                                                             className={cn(
//                                                                 "text-xs font-medium",
//                                                                 isActive
//                                                                     ? "bg-white text-indigo-600"
//                                                                     : "bg-indigo-50 text-indigo-700 border-indigo-200"
//                                                             )}
//                                                         >
//                                                             {item.badge}
//                                                         </Badge>
//                                                     )}

//                                                     {/* Active indicator */}
//                                                     {isActive && (
//                                                         <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
//                                                             <div className="h-2 w-2 bg-white rounded-full" />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 );
//                             })}
//                         </SidebarMenu>
//                     </SidebarGroup>
//                 </SidebarContent>
//             </ScrollArea>

//         </Sidebar>
//     );
// }


import {
    FilePlus,
    Files,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "../ui/scroll-area";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

// Mobile Navigation Menu
const MobileNavMenu = () => {
    const { open, setOpen } = useSidebar();
    const location = useLocation();
    const currentPath = location.pathname;

    const mainItems = [
        {
            title: "Add Document",
            url: "/documents/add",
            icon: FilePlus,
            description: "Upload new",
            badge: "New"
        },
        {
            title: "All Documents",
            url: "/documents/list",
            icon: Files,
            description: "View all",
            badge: null
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
            <div className="flex items-center justify-around px-2 py-3">
                {mainItems.slice(0, 5).map((item) => {
                    const isActive = currentPath === item.url;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            to={item.url}
                            onClick={() => setOpen(false)}
                            className="flex flex-col items-center justify-center p-2 flex-1 min-w-0"
                        >
                            <div className={cn(
                                "p-2 rounded-full mb-1",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-500"
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className={cn(
                                "text-xs font-medium truncate w-full text-center",
                                isActive ? "text-primary" : "text-gray-600"
                            )}>
                                {item.title.split(' ')[0]}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

const DesktopSidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { open } = useSidebar();

    const mainItems = [
        {
            title: "Add Document",
            url: "/documents/add",
            icon: FilePlus,
            description: "Upload new document",
            badge: "New"
        },
        {
            title: "All Documents",
            url: "/documents/list",
            icon: Files,
            description: "View all documents",
            badge: null
        },

    ];
    return (
        <Sidebar
            className={cn(
                "border-r border-gray-200 bg-gradient-to-b from-white to-gray-50",
                "w-full md:w-72", // Responsive width
                "fixed md:relative inset-y-0 left-0 z-40", // Fixed for mobile
                "transform transition-transform duration-300 ease-in-out",
                open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}
        >
            <ScrollArea className="h-screen">
                {/* Header */}
                <SidebarHeader className="p-4 md:p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
                                    <img
                                        src="/logo-image.png"
                                        className="h-6 w-6 md:h-8 md:w-8 text-white"
                                        alt="Logo"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                    कागजातSack
                                </p>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                    Secure Document Vault
                                </p>
                            </div>
                        </div>
                        <SidebarTrigger className="h-8 w-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm md:flex absolute top-4 right-4">
                            {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </SidebarTrigger>
                    </div>
                </SidebarHeader>

                {/* Navigation Menu */}
                <SidebarContent className="px-2 md:px-4">
                    {/* Main Navigation */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                            Navigation
                        </SidebarGroupLabel>
                        <SidebarMenu className="space-y-1">
                            {mainItems.map((item) => {
                                const isActive = currentPath === item.url;
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link
                                                to={item.url}
                                                className={cn(
                                                    "group relative px-3 py-3 rounded-xl transition-all duration-200",
                                                    "flex items-center justify-between",
                                                    isActive
                                                        ? "bg-primary text-white shadow-md"
                                                        : "hover:bg-gray-100 text-gray-700"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={cn(
                                                        "p-2 rounded-lg transition-colors flex-shrink-0",
                                                        isActive
                                                            ? "bg-white/20"
                                                            : "bg-gray-100 group-hover:bg-gray-200"
                                                    )}>
                                                        <Icon className={cn(
                                                            "h-4 w-4",
                                                            isActive ? "text-white" : "text-gray-600"
                                                        )} />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-medium truncate">
                                                            {item.title}
                                                        </span>
                                                        <span className={cn(
                                                            "text-xs mt-0.5 truncate",
                                                            isActive ? "text-white/90" : "text-gray-500"
                                                        )}>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                </div>

                                                {item.badge && (
                                                    <Badge
                                                        variant={isActive ? "secondary" : "outline"}
                                                        className={cn(
                                                            "text-xs font-medium ml-2 flex-shrink-0",
                                                            isActive
                                                                ? "bg-white text-primary"
                                                                : "bg-primary/10 text-primary border-primary/20"
                                                        )}
                                                    >
                                                        {item.badge}
                                                    </Badge>
                                                )}

                                                {/* Active indicator */}
                                                {isActive && (
                                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                        <div className="h-2 w-2 bg-white rounded-full" />
                                                    </div>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </ScrollArea>
        </Sidebar>
    );
};

// Mobile Header Component
const MobileHeader = () => {
    const { open, setOpen } = useSidebar();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === "/") return "Dashboard";
        if (path === "/documents/add") return "Add Document";
        if (path === "/documents/list") return "All Documents";
        if (path === "/documents/categories") return "Categories";
        if (path === "/settings") return "Settings";
        if (path === "/help") return "Help";
        return "कागजातSack";
    };

    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(!open)}
                    className="h-10 w-10"
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                <div className="flex items-center gap-3 flex-1 justify-center">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <img
                            src="/logo-image.png"
                            className="h-4 w-4 text-white"
                            alt="Logo"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg font-bold text-gray-900">
                            {getPageTitle()}
                        </h1>
                    </div>
                </div>

                <Avatar className="h-10 w-10">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                    <AvatarFallback className="bg-primary text-white">
                        JD
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
};

// Main AppSidebar Component
export function AppSidebar() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            <MobileHeader />

            {/* Desktop Sidebar */}
            <DesktopSidebar />

            {/* Mobile Navigation Menu */}
            <MobileNavMenu />

            {/* Backdrop for mobile sidebar */}
            <div className="md:hidden">
                {useSidebar().open && (
                    <div
                        onClick={() => useSidebar().setOpen(false)}
                    />
                )}
            </div>

            <div className={cn(
                "min-h-screen transition-all duration-300",
                "pt-16 md:pt-0", // Padding for mobile header
                "pb-16 md:pb-0"  // Padding for mobile bottom nav
            )} />
        </>

    );
}