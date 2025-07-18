"use client";

import React, { useState, useEffect } from "react";
import { Award, Target, CheckCircle, Clock, Star, Users, Trophy, Shield, User, ArrowLeft } from "lucide-react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";
import Header from "@/components/Header";
import useGetUserData from "@/hooks/useAddress";

// Types for mission data
interface Mission {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  target_value: number;
  reward_points: number;
  icon: string;
  category: string;
  user_status: string;
  current_progress: number;
  target_progress: number;
  started_at?: string;
  completed_at?: string;
  expires_at?: string;
  reward_claimed: boolean;
}

interface UserStats {
  total_points: number;
  journeys_created: number;
  reviews_given: number;
  locations_visited: number;
  missions_completed: number;
  achievement_level: number;
  mission_breakdown: {
    total_missions: number;
    completed_missions: number;
    in_progress_missions: number;
    not_started_missions: number;
  };
}

export default function MissionsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { users: userData, loading: userDataLoading } = useGetUserData();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user ID with proper priority: registered user ID first, then wallet address
  const getUserId = () => {
    // If userData is still loading, don't return anything yet
    if (userDataLoading) {
      console.log('getUserId - userData still loading, waiting...');
      return null;
    }
    
    // Priority: registered user ID, then wallet address
    const userId = userData?.id || address;
    
    console.log('getUserId - userData?.id:', userData?.id);
    console.log('getUserId - address:', address);
    console.log('getUserId - selected userId:', userId);
    
    return userId || null;
  };

  const userId = getUserId();

  // Get current user ID for display
  const currentUserId = userData?.id || address || 'Unknown User';

  // Fetch user missions and stats
  useEffect(() => {
    const fetchMissionData = async () => {
      // Don't fetch if userData is still loading or no valid userId
      if (userDataLoading || !userId) {
        console.log('Not fetching mission data yet - userDataLoading:', userDataLoading, 'userId:', userId);
        if (!userDataLoading && !userId) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3033';
        
        console.log('Fetching mission data for userId:', userId);
        console.log('API URLs:');
        console.log('- Missions:', `${baseUrl}/api/users/${userId}/missions`);
        console.log('- Stats:', `${baseUrl}/api/users/${userId}/mission-stats`);
        
        // Fetch missions and stats in parallel
        const [missionsResponse, statsResponse] = await Promise.all([
          fetch(`${baseUrl}/api/users/${userId}/missions`),
          fetch(`${baseUrl}/api/users/${userId}/mission-stats`)
        ]);

        console.log('Response status - Missions:', missionsResponse.status);
        console.log('Response status - Stats:', statsResponse.status);

        if (!missionsResponse.ok || !statsResponse.ok) {
          console.error('API Error - Missions OK:', missionsResponse.ok, 'Stats OK:', statsResponse.ok);
          throw new Error('Failed to fetch mission data');
        }

        const missionsData = await missionsResponse.json();
        const statsData = await statsResponse.json();

        console.log('Missions data:', missionsData);
        console.log('Stats data:', statsData);

        setMissions(missionsData.data || []);
        setUserStats(statsData.data);
      } catch (err) {
        console.error('Error fetching mission data:', err);
        setError('Failed to load mission data');
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, [userId, userDataLoading]); // Re-fetch when userId changes or userDataLoading completes

  // Redirect to dashboard if wallet not connected
  useEffect(() => {
    if (!isConnected || !address) {
      router.push('/dashboard');
    }
  }, [isConnected, address, router]);

  // Start a mission
  const startMission = async (missionId: string) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3033';
      
      const response = await fetch(`${baseUrl}/api/users/${userId}/missions/${missionId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Mission started successfully!');
        // Refresh mission data
        const missionsResponse = await fetch(`${baseUrl}/api/users/${userId}/missions`);
        const missionsData = await missionsResponse.json();
        setMissions(missionsData.data || []);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to start mission');
      }
    } catch (err) {
      console.error('Error starting mission:', err);
      toast.error('Failed to start mission');
    }
  };

  // Claim reward for a completed mission
  const claimReward = async (missionId: string) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3033';
      
      const response = await fetch(`${baseUrl}/api/users/${userId}/missions/${missionId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const rewardData = await response.json();
        toast.success(`Reward claimed successfully! You earned ${rewardData.data.rewardAmount} XP`);
        // Refresh mission data
        const missionsResponse = await fetch(`${baseUrl}/api/users/${userId}/missions`);
        const missionsData = await missionsResponse.json();
        setMissions(missionsData.data || []);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to claim reward');
      }
    } catch (err) {
      console.error('Error claiming reward:', err);
      toast.error('Failed to claim reward');
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  // Filter missions by status
  const activeMissions = missions.filter(m => m.user_status === 'in_progress');
  const completedMissions = missions.filter(m => m.user_status === 'completed');
  const availableMissions = missions.filter(m => m.user_status === 'not_started');

  // If wallet not connected, show connection prompt instead of redirecting immediately
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </button>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Wallet Required</span>
                </div>
              </div>
              <ConnectButtonCustom />
            </div>
          </div>

          {/* Connection Required Message */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
              <p className="text-gray-600 max-w-md">
                To access your missions and track your progress, please connect your wallet using the button above.
              </p>
              <ConnectButtonCustom />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Use the same Header component as dashboard */}
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Missions
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Complete challenges and earn rewards for your travel adventures
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Missions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.mission_breakdown?.in_progress_missions || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.missions_completed || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.total_points?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Achievement Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.achievement_level || 1}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Active Missions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Active Missions</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {activeMissions.length > 0 ? (
                activeMissions.map((mission) => (
                  <div key={mission.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{mission.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {mission.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(mission.difficulty)}`}>
                            {mission.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {mission.description}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(mission.user_status)}`}>
                        In Progress
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{mission.current_progress}/{mission.target_progress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{width: `${getProgressPercentage(mission.current_progress, mission.target_progress)}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Reward: {mission.reward_points} points
                      </span>
                      {mission.current_progress >= mission.target_progress ? (
                        <button 
                          onClick={() => claimReward(mission.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Claim Reward
                        </button>
                      ) : (
                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No active missions yet</p>
                  <p className="text-sm">Start some missions below to begin your journey!</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Missions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Completions</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {completedMissions.length > 0 ? (
                completedMissions.slice(0, 3).map((mission) => (
                  <div key={mission.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{mission.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {mission.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {mission.description}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(mission.user_status)}`}>
                        Completed
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Earned: {mission.reward_points} points
                      </span>
                      <span className="text-sm text-gray-500">
                        {mission.completed_at ? 
                          new Date(mission.completed_at).toLocaleDateString() : 
                          'Recently'
                        }
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No completed missions yet</p>
                  <p className="text-sm">Complete your first mission to see it here!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Available Missions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Available Missions</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMissions.length > 0 ? (
                availableMissions.map((mission) => (
                  <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg">{mission.icon}</span>
                      <h4 className="font-semibold text-gray-900">{mission.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(mission.difficulty)}`}>
                        {mission.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {mission.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">
                        {mission.reward_points} points
                      </span>
                      <button 
                        onClick={() => startMission(mission.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>All missions are either started or completed!</p>
                  <p className="text-sm">Great job on your progress!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Progress Summary */}
        {userStats && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Your Journey Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="opacity-80">Journeys Created</p>
                    <p className="text-lg font-bold">{userStats.journeys_created}</p>
                  </div>
                  <div>
                    <p className="opacity-80">Reviews Given</p>
                    <p className="text-lg font-bold">{userStats.reviews_given}</p>
                  </div>
                  <div>
                    <p className="opacity-80">Locations Visited</p>
                    <p className="text-lg font-bold">{userStats.locations_visited}</p>
                  </div>
                  <div>
                    <p className="opacity-80">Achievement Level</p>
                    <p className="text-lg font-bold">Level {userStats.achievement_level}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Trophy className="w-16 h-16 opacity-80 mx-auto mb-2" />
                <p className="text-sm opacity-80">Total Points</p>
                <p className="text-2xl font-bold">{userStats.total_points.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
