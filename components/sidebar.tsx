"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Calendar,
  DollarSign,
  CreditCard,
  Settings,
  TrendingUp,
  Shield,
  LogOut,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useI18n();
  const router = useRouter();
  const supabase = createClient();

  const navigationItems = [
    {
      name: t.nav.overview,
      href: "/admin",
      icon: TrendingUp,
    },
    {
      name: t.nav.userProductivity,
      href: "/admin/users",
      icon: Users,
    },
    {
      name: t.nav.taskAnalytics,
      href: "/admin/tasks",
      icon: Calendar,
    },
    {
      name: t.nav.financial,
      href: "/admin/financial",
      icon: DollarSign,
    },
    {
      name: t.nav.supportPayments,
      href: "/admin/support",
      icon: CreditCard,
    },
    {
      name: t.nav.categories,
      href: "/admin/categories",
      icon: Settings,
    },
    {
      name: t.nav.adminUsers,
      href: "/admin/admin-users",
      icon: Shield,
    },
    {
      name: t.nav.departments,
      href: "/admin/departments",
      icon: Building2,
    },
  ];

  const NavigationItems = ({ onItemClick }: { onItemClick?: () => void }) => {
    const pathname = usePathname();

    return (
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href} onClick={onItemClick}>
              <Button
                variant="ghost"
                className={`w-full justify-start transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    window.location.reload();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r border-white/20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen shadow-2xl fixed left-0 top-0 z-30">
        <div className="p-4 lg:p-6 border-b border-slate-700/50">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white">
                Startup Hub
              </h2>
              <p className="text-xs lg:text-sm text-slate-400">
                Management Dashboard
              </p>
            </div>
          </Link>
        </div>
        <div className="px-4 py-2 border-b border-slate-700/50">
          <LanguageSwitcher
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer"
          />
        </div>
        <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-120px)] relative">
          <NavigationItems />

          <div className="absolute bottom-20">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start transition-all duration-200 bg-slate-700 hover:bg-slate-600 cursor-pointer text-white"
            >
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetTitle className="hidden">Startup Hub</SheetTitle>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700"
        >
          <div className="p-6 border-b border-slate-700/50">
            <Link
              href="/admin"
              className="flex items-center space-x-3"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Startup Hub</h2>
                <p className="text-sm text-slate-400">Management Dashboard</p>
              </div>
            </Link>
          </div>
          <div className="px-4 py-2 border-b border-slate-700/50">
            <LanguageSwitcher
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer"
            />
          </div>
          <div className="px-4 py-6">
            <NavigationItems onItemClick={() => setSidebarOpen(false)} />

            <div className="absolute bottom-20">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start transition-all duration-200 bg-slate-700 hover:bg-slate-600 cursor-pointer text-white"
              >
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
