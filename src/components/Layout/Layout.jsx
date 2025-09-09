import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const Layout = ({ user, onLogout }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/market", icon: TrendingUp, label: "Market" },
    { path: "/portfolio", icon: Wallet, label: "Portfolio" },
  ];

  if (user.role === "admin") {
    navItems.push({ path: "/admin", icon: Shield, label: "Admin" });
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-800 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 z-50 lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-primary-500">
            Horizon Crypto
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white border-r-2 border-primary-500"
                    : ""
                }`}
                onClick={() => setSidebarOpen(false)} // close sidebar on mobile nav click
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user.email[0].toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-white text-sm font-medium">{user.email}</p>
              <p className="text-gray-400 text-xs">
                Balance: ${user.balance?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

{/* Main Content */}
<div className="flex-1 flex flex-col overflow-hidden">
  {/* Top Bar (mobile only) */}
  <header className="flex items-center justify-between bg-gray-800 p-4 lg:hidden">
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="text-gray-300 hover:text-white text-2xl"
    >
      ☰
    </button>
    <h1 className="text-lg font-bold">Dashboard</h1>
  </header>

  <main className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
    <Outlet />
  </main>
</div>

    </div>
  );
};

export default Layout;
