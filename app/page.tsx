'use client';

import ChatBot from "@/components/ChatBot";
import { LogOut, Settings, User } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Top Navbar */}
      <div className="bg-gray-900 text-white px-6 py-4 shadow flex items-center justify-between">
        <h1 className="text-2xl font-semibold">ERP Dashboard</h1>

        {/* Profile Section */}
        <div className="flex items-center gap-4 relative group cursor-pointer">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
            U
          </div>

          {/* Username */}
          <span className="hidden sm:block">Username</span>

          {/* Settings Dropdown */}
          <div className="absolute top-12 right-0 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-150 z-50">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600">
                <LogOut className="w-4 h-4" />
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
        <ChatBot />
    </div>
  );
}
