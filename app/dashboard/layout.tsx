'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LogOut, MessageCircle, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    title: 'Training',
    url: '/dashboard/training',
    icon: PlayCircle,
    matchPath: '/dashboard/training',
  },
  {
    title: 'Chat',
    url: '/dashboard/chat',
    icon: MessageCircle,
    matchPath: '/dashboard/chat',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-slate-200">
        {/* Header with Logo */}
        <SidebarHeader className="border-b border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#219E82]/10">
              <span className="text-xl font-bold text-[#219E82]">P</span>
            </div>
            <span className="text-xl font-bold text-[#219E82]">Pulse</span>
          </div>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = pathname.includes(item.matchPath);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={
                          isActive
                            ? 'bg-[#219E82]/10 font-semibold text-[#219E82] hover:bg-[#219E82]/15'
                            : 'text-slate-600 hover:bg-slate-100'
                        }>
                        <Link href={item.url}>
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer with Sign Out */}
        <SidebarFooter className="border-t border-slate-100 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-slate-500 hover:bg-red-50 hover:text-red-500"
                tooltip="Sign Out">
                <LogOut className="size-5" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Area */}
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3">
          <SidebarTrigger className="-ml-1" />
          <h1 className="truncate text-xl font-semibold text-slate-800">
            {pathname.includes('/training')
              ? 'Training & Development'
              : 'Dashboard'}
          </h1>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
