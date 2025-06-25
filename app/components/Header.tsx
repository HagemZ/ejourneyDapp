"use client";
import React from "react";
import { MapPin, User, LogOut, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  onSearchClick: () => void;
  onProfileClick: () => void;
}

export default function Header({ onSearchClick, onProfileClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="fixed  top-0 left-0 right-0 z-90 bg-white/30 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-300 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-900">
              MyJourney
            </h1>
          </div>

          {/* Search Button */}
          <button
            onClick={onSearchClick}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Search className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600 font-body">Search locations...</span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="font-body font-medium text-gray-900">
                    {user.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="bg-blue-300 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onProfileClick}
                className="bg-blue-300 hover:bg-primary-400 text-white px-4 py-2 rounded-lg font-body font-medium transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
