'use client';

import React from 'react';
import { AuthSession } from '@/types';

interface SidebarProps {
  session: AuthSession;
  activeTab: string;
  onTabChange: (tab: 'overview' | 'search' | 'analytics') => void;
  onLogout: () => void;
}

export default function Sidebar({ session, activeTab, onTabChange, onLogout }: SidebarProps) {
  const menuItems = [
    {
      id: 'overview',
      name: 'Evidence Overview',
      icon: '📊',
      description: 'View all evidence records',
    },
    {
      id: 'search',
      name: 'Evidence Search',
      icon: '🔍',
      description: 'Search and filter evidence',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📈',
      description: 'Insights and patterns',
    },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔒</span>
            <span className="font-semibold">Evidence Portal</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {session.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.department}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {session.role.charAt(0).toUpperCase() + session.role.slice(1)}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as any)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <div>
                <div>{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="mr-3 text-lg">🚪</span>
            <div>
              <div>Sign Out</div>
              <div className="text-xs text-gray-500">Secure logout</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}