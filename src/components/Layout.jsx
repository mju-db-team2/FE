import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardCheck,
  Menu,
  Bell,
  Search,
} from "lucide-react";
import { clsx } from "clsx";

const SidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
        active
          ? "bg-primary-50 text-primary-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <Icon size={20} />
      {label}
    </Link>
  );
};

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 font-bold text-xl text-primary-700">
            <Briefcase className="w-8 h-8" />
            <span>SI Manager</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Overview
          </div>
          <SidebarItem
            icon={LayoutDashboard}
            label="대시보드"
            to="/dashboard"
            active={location.pathname === "/dashboard"}
          />

          <div className="mt-8 px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Management
          </div>
          <SidebarItem
            icon={Briefcase}
            label="프로젝트 관리"
            to="/projects"
            active={location.pathname.startsWith("/projects")}
          />
          <SidebarItem
            icon={Users}
            label="인력 관리"
            to="/employees"
            active={location.pathname.startsWith("/employees")}
          />
          <SidebarItem
            icon={ClipboardCheck}
            label="평가 관리"
            to="/evaluations"
            active={location.pathname.startsWith("/evaluations")}
          />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              A
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Admin User</p>
              <p className="text-gray-500 text-xs">admin@company.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="검색..."
                className="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
