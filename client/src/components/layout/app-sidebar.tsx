import {
  FilePlus,
  Files,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { ScrollArea } from "../ui/scroll-area";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const mainItems = [
  {
    title: "Add Document",
    url: "/documents/add",
    icon: FilePlus,
    description: "Upload new document",
    badge: "New",
  },
  {
    title: "All Documents",
    url: "/documents/list",
    icon: Files,
    description: "View all documents",
    badge: null,
  },
];

const MobileHeader = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/documents/add") return "Add Document";
    if (path === "/documents/list") return "All Documents";
    return "कागजातSack";
  };

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1 justify-between">
          <div className=" flex items-center gap-1">
            <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center">
              <img
                src="/logo-image.png"
                className="h-5 w-5  text-white rounded-2xl"
                alt="Logo"
              />
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary tracking-tight">
              कागजातSack
            </p>
          </div>
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-primary">
              {getPageTitle()}
            </h1>
          </div>
        </div>

      </div>
    </div>
  );
};

const MobileNavMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { setOpen } = useSidebar();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
      <div className="flex items-center justify-around px-2 py-3">
        {mainItems.slice(0, 2).map((item) => {
          const isActive = currentPath === item.url;
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              to={item.url}
              onClick={() => setOpen(false)}
              className="flex flex-col items-center justify-center p-2 flex-1 min-w-0"
            >
              <div
                className={cn(
                  "p-2 rounded-full mb-1",
                  isActive ? "bg-primary/10 text-primary" : "text-gray-500"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "text-xs font-medium truncate w-full text-center",
                  isActive ? "text-primary" : "text-gray-600"
                )}
              >
                {item.title.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { open, setOpen } = useSidebar();

  return (
    <>
      <MobileHeader />

      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
     
      >
        <ScrollArea className="flex h-screen flex-col">
          {/* Header */}
          <SidebarHeader>
            <div className="flex items-center gap-3 px-1 ">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
                  <img
                    src="/logo-image.png"
                    className="h-6 w-6 sm:h-8 sm:w-8 text-white rounded-2xl"
                    alt="Logo"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary/80 tracking-tight">
                    कागजातSack
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Secure Document Vault
                  </p>
                </div>
              </div>
            </div>
          </SidebarHeader>

          {/* Navigation Menu */}
          <SidebarContent className="px-2 py-4">
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
                          onClick={() => {
                            // Close sidebar on mobile/tablet when clicking a link
                            if (window.innerWidth < 1024) {
                              setOpen(false);
                            }
                          }}
                          className={cn(
                            "group relative px-6 py-6 rounded-xl transition-all duration-200 border",
                            isActive
                              ? "bg-primary text-white shadow-md"
                              : "hover:bg-primary text-gray-700"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-2 rounded-lg transition-colors",
                                  isActive
                                    ? "bg-primary"
                                    : "bg-primary/20  group-hover:bg-gray-200"
                                )}
                              >
                                <Icon
                                  className={cn(
                                    "h-4 w-4",
                                    isActive ? "text-white" : "text-primary-foreground"
                                  )}
                                />
                              </div>
                              <div className="flex flex-col justify-center items-center">
                                <span className="text-sm font-medium ">
                                  {item.title}
                                </span>
                                <span
                                  className={cn(
                                    "text-xs mt-0.5",
                                    isActive
                                      ? "text-white/90"
                                      : "text-gray-500"
                                  )}
                                >
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </ScrollArea>

        <SidebarTrigger
          className="hover:bg-primary/90 hover:text-white absolute top-1/2 -right-3 z-50 size-6 -translate-y-1/2 bg-primary hidden md:flex text-white"
        />

      </Sidebar>

      <MobileNavMenu />

      {/* Backdrop for mobile/tablet sidebar */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}