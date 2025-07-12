"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  CalendarCheck,
  CalendarOff,
  Clock,
  CircleDollarSign,
  Users,
  LogOut,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    if (!role) {
      router.push('/login');
    } else {
      setUserRole(role);
      setUserName(name);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, admin: false },
    { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck, admin: false },
    { href: '/dashboard/leaves', label: 'Leaves', icon: CalendarOff, admin: false },
    { href: '/dashboard/overtime', label: 'Overtime', icon: Clock, admin: false },
    { href: '/dashboard/reimbursement', label: 'Reimbursement', icon: CircleDollarSign, admin: false },
    { href: '/dashboard/admin', label: 'Admin Panel', icon: Users, admin: true },
  ];
  
  const currentMenuItem = menuItems.find(item => pathname === item.href) || menuItems.find(item => pathname.startsWith(item.href) && item.href !== '/dashboard');


  if (!isMounted || !userRole) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-2xl font-headline font-bold">Humano</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.filter(item => !item.admin).map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  onClick={() => router.push(item.href)}
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {userRole === 'hr' && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => router.push('/dashboard/admin')}
                  isActive={pathname === '/dashboard/admin'}
                  tooltip={{ children: 'Admin Panel' }}
                >
                  <Users />
                  <span>Admin Panel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
             <Avatar>
               <AvatarImage src="https://placehold.co/40x40.png" alt={userName || 'User'} data-ai-hint="profile avatar"/>
               <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="font-semibold truncate">{userName}</span>
              <span className="text-xs text-muted-foreground">{userRole === 'hr' ? 'HR Admin' : 'Employee'}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="ml-auto">
            <LogOut />
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="md:hidden">
              <PanelLeft />
            </SidebarTrigger>
            <h1 className="text-xl font-semibold font-headline">
              {currentMenuItem?.label || 'Dashboard'}
            </h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
