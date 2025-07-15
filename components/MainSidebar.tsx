"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  MapPin, 
  Award, 
  Gift, 
  HelpCircle, 
  Users, 
  Clock, 
  Calendar, 
  Radio,
  ChevronRight,
  FileText,
  Settings,
  History
} from "lucide-react";
import MissionModal from "@/components/modals/MissionModal";
import RewardModal from "@/components/modals/RewardModal";
import HowToModal from "@/components/modals/HowToModal";
import CommunityModal from "@/components/modals/CommunityModal";
import { getUserJourneyCounts, getCurrentUserId, type JourneyCounts } from "@/services/journeyService";

interface MainSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  onRecentJourneysToggle?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  submenu?: {
    id: string;
    label: string;
    icon: React.ReactNode;
    count?: number;
    status?: 'draft' | 'scheduled' | 'live';
  }[];
}

export default function MainSidebar({ isOpen, onToggle, className = "", onRecentJourneysToggle }: MainSidebarProps) {
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['my-journey']);
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [journeyCounts, setJourneyCounts] = useState<JourneyCounts>({
    live: 0,
    draft: 0,
    scheduled: 0,
    total: 0
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  
  // Modal states - only for non-journey items
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  // Load journey counts on component mount
  useEffect(() => {
    const loadJourneyCounts = async () => {
      try {
        setIsLoadingCounts(true);
        const userId = getCurrentUserId();
        const response = await getUserJourneyCounts(userId);
        if (response.success) {
          setJourneyCounts(response.data);
        }
      } catch (error) {
        console.error('Failed to load journey counts:', error);
        // Keep default counts on error
      } finally {
        setIsLoadingCounts(false);
      }
    };

    loadJourneyCounts();
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: 'my-journey',
      label: 'My Journey',
      icon: <MapPin className="w-5 h-5" />,
      submenu: [
        {
          id: 'all-journeys',
          label: 'All Journeys',
          icon: <MapPin className="w-4 h-4" />,
          count: journeyCounts?.total || 0,
          status: 'all' as any
        },
        {
          id: 'draft',
          label: 'Draft',
          icon: <FileText className="w-4 h-4" />,
          count: journeyCounts?.draft || 0,
          status: 'draft'
        },
        {
          id: 'scheduled',
          label: 'Scheduled',
          icon: <Calendar className="w-4 h-4" />,
          count: journeyCounts?.scheduled || 0,
          status: 'scheduled'
        },
        {
          id: 'live',
          label: 'Live',
          icon: <Radio className="w-4 h-4" />,
          count: journeyCounts?.live || 0,
          status: 'live'
        }
      ]
    },
    {
      id: 'recent-journeys',
      label: 'Recent Journeys',
      icon: <History className="w-5 h-5" />
    },
    {
      id: 'mission',
      label: 'Mission',
      icon: <Award className="w-5 h-5" />,
      count: 5
    },
    {
      id: 'reward',
      label: 'Reward',
      icon: <Gift className="w-5 h-5" />
    },
    {
      id: 'how-to',
      label: 'How To',
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      id: 'community',
      label: 'Community',
      icon: <Users className="w-5 h-5" />
    }
  ];

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.submenu) {
      // Special handling for "My Journey" - both toggle submenu AND navigate to overview
      if (item.id === 'my-journey') {
        // Navigate to general journeys overview
        router.push('/dashboard/journeys');
        setActiveMenu('my-journey');
        
        // Also toggle submenu for better UX
        toggleSubmenu(item.id);
        
        // On mobile, close sidebar after selection
        if (window.innerWidth < 768) {
          onToggle();
        }
        return;
      }
      
      // For other items with submenu, just toggle
      toggleSubmenu(item.id);
      setActiveMenu(expandedMenus.includes(item.id) ? '' : item.id);
    } else {
      // Set active menu for non-submenu items
      setActiveMenu(item.id);
      
      // Open corresponding modal based on menu item
      switch (item.id) {
        case 'recent-journeys':
          if (onRecentJourneysToggle) {
            onRecentJourneysToggle();
          }
          break;
        case 'mission':
          setIsMissionModalOpen(true);
          break;
        case 'reward':
          setIsRewardModalOpen(true);
          break;
        case 'how-to':
          setIsHowToModalOpen(true);
          break;
        case 'community':
          setIsCommunityModalOpen(true);
          break;
        default:
          break;
      }
      
      // On mobile, close sidebar after selection
      if (window.innerWidth < 768) {
        onToggle();
      }
    }
  };

  const handleSubmenuClick = (submenuItem: NonNullable<MenuItem['submenu']>[0]) => {
    // Navigate to dedicated pages for journey status instead of using modals
    if (submenuItem.status) {
      switch (submenuItem.status) {
        case 'all' as any:
          router.push('/dashboard/journeys');
          break;
        case 'draft':
          router.push('/dashboard/journeys/draft');
          break;
        case 'scheduled':
          router.push('/dashboard/journeys/scheduled');
          break;
        case 'live':
          router.push('/dashboard/journeys/live');
          break;
      }
    }
    
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Hamburger Button - Fixed position */}
      <button
        onClick={onToggle}
        className={`fixed top-20 right-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'bg-gray-100' : 'bg-white'
        } md:right-6`}
        title={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 shadow-xl z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-80 md:w-72 overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-semibold text-gray-900">
                Navigation
              </h2>
              <p className="text-sm font-body text-gray-600 mt-1">
                Manage your journey
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {menuItems.map((item) => (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-3 text-left rounded-lg transition-all duration-200 group ${
                    (expandedMenus.includes(item.id) && item.submenu) || activeMenu === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`transition-colors duration-200 ${
                      (expandedMenus.includes(item.id) && item.submenu) || activeMenu === item.id
                        ? 'text-blue-600'
                        : 'text-gray-500 group-hover:text-gray-700'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="font-body font-medium">{item.label}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Count Badge */}
                    {item.count !== undefined && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        (expandedMenus.includes(item.id) && item.submenu) || activeMenu === item.id
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {isLoadingCounts ? '...' : item.count}
                      </span>
                    )}
                    
                    {/* Expand Arrow */}
                    {item.submenu && (
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedMenus.includes(item.id) ? 'rotate-90' : ''
                        } ${
                          (expandedMenus.includes(item.id) && item.submenu) || activeMenu === item.id
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }`}
                      />
                    )}
                  </div>
                </button>

                {/* Submenu */}
                {item.submenu && expandedMenus.includes(item.id) && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleSubmenuClick(subItem)}
                        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200">
                            {subItem.icon}
                          </div>
                          <span className="font-body">{subItem.label}</span>
                        </div>
                        
                        {subItem.count !== undefined && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-800 transition-all duration-200">
                            {isLoadingCounts ? '...' : subItem.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs font-body text-gray-500">
              JourneyLog v1.0
            </p>
            <p className="text-xs font-body text-gray-400 mt-1">
              Share your adventures
            </p>
          </div>
        </div>
      </div>

      {/* Modals - only for non-journey items */}
      <MissionModal 
        isOpen={isMissionModalOpen} 
        onClose={() => setIsMissionModalOpen(false)} 
      />
      <RewardModal 
        isOpen={isRewardModalOpen} 
        onClose={() => setIsRewardModalOpen(false)} 
      />
      <HowToModal 
        isOpen={isHowToModalOpen} 
        onClose={() => setIsHowToModalOpen(false)} 
      />
      <CommunityModal 
        isOpen={isCommunityModalOpen} 
        onClose={() => setIsCommunityModalOpen(false)} 
      />
    </>
  );
}
