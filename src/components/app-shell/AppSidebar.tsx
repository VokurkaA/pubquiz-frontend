"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, PlusCircle, QrCode } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppSidebar() {
  const pathname = usePathname();

  const items = [
    { href: "/scan", label: "Scanner", icon: QrCode },
    { href: "/add-quiz", label: "Add quiz", icon: PlusCircle },
    { href: "/stats", label: "Stats", icon: BarChart3 },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1 text-sm font-semibold tracking-tight">PubQuiz</div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href} className="flex items-center">
                        <Icon className="mr-2" aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="ml-auto">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
