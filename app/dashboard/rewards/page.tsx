"use client";

import React, { useState, useEffect } from "react";
import { Gift, Star, Trophy, Coins, Package, Calendar, Target, Map, CheckCircle, Users, Compass, ArrowLeft, Shield } from "lucide-react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";
import Header from "@/components/Header";
import useGetUserData from "@/hooks/useAddress";
import { rewardsAPI, formatTimeAgo, formatPoints, getColorClasses, handleAPIError } from "../../../lib/rewardsAPI";

interface UserBalance {
  total_points: number;
  rank: string;
  next_rank: string | null;
  points_to_next_rank: number;
  achievement_level: number;
  missions_completed: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost_points: number;
  category: string;
  type: string;
  icon: string;
  color: string;
  is_available: boolean;
  is_repeatable: boolean;
  user_redemption_count?: number;
  last_redeemed_at?: string;
  has_been_claimed?: boolean;
  can_claim?: boolean;
  claim_block_reason?: string;
  remaining_claims?: number;
  metadata: any;
}

interface RedemptionHistory {
  id: string;
  title: string;
  cost_points: number;
  redeemed_at: string;
  icon: string;
  color: string;
}

interface EarningTip {
  action: string;
  points: string;
  description: string;
  category: string;
  icon: string;
}

interface RankProgress {
  current_rank: {
    name: string;
    description: string;
    min_points: number;
    max_points: number | null;
  };
  next_rank: {
    name: string;
    description: string;
    min_points: number;
    points_needed: number;
  } | null;
  progress: {
    current_points: number;
    progress_percentage: number;
    is_max_rank: boolean;
  };
}

export default function RewardsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { users: userData, loading: userDataLoading } = useGetUserData();
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionHistory[]>([]);
  const [earningTips, setEarningTips] = useState<EarningTip[]>([]);
  const [rankProgress, setRankProgress] = useState<RankProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState<string | null>(null);

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

  // Icon mapping for dynamic icons
  const getIconComponent = (iconName: string, className: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className: string }> } = {
      gift: Gift,
      star: Star,
      trophy: Trophy,
      coins: Coins,
      package: Package,
      calendar: Calendar,
      target: Target,
      map: Map,
      'check-circle': CheckCircle,
      users: Users,
      compass: Compass,
      book: Gift, // Fallback for book icon
    };
    
    const IconComponent = iconMap[iconName] || Gift;
    return <IconComponent className={className} />;
  };

  // Note: getColorClasses is imported from rewardsAPI utility

  // Fetch user balance and rank
  const fetchUserBalance = async () => {
    if (!userId) return;
    try {
      console.log('Fetching user balance for userId:', userId);
      const data = await rewardsAPI.getUserBalance(userId);
      console.log('User balance response:', data);
      setUserBalance(data.data.balance);
    } catch (error) {
      console.error('Error fetching user balance:', handleAPIError(error));
      // Try to initialize user if they don't exist
      if (error instanceof Error && error.message?.includes('not found')) {
        console.log('User not found, attempting to initialize...');
        try {
          await rewardsAPI.initializeUser(userId);
          console.log('User initialized successfully, retrying fetch...');
          // Retry fetching user balance after initialization
          const retryData = await rewardsAPI.getUserBalance(userId);
          setUserBalance(retryData.data.balance);
        } catch (initError) {
          console.error('Failed to initialize user:', initError);
          // Set default values as fallback
          setUserBalance({
            total_points: 0,
            rank: 'Explorer',
            next_rank: 'Adventurer',
            points_to_next_rank: 1000,
            achievement_level: 1,
            missions_completed: 0
          });
        }
      }
    }
  };

  // Fetch available rewards
  const fetchRewards = async () => {
    if (!userId) return;
    try {
      const data = await rewardsAPI.getUserRewards(userId, { available_only: true });
      setRewards(data.data);
    } catch (error) {
      console.error('Error fetching rewards:', handleAPIError(error));
      // Fallback to general rewards if user-specific fetch fails
      try {
        const fallbackData = await rewardsAPI.getRewards({ available_only: true });
        setRewards(fallbackData.data);
      } catch (fallbackError) {
        console.error('Error fetching fallback rewards:', handleAPIError(fallbackError));
      }
    }
  };

  // Fetch redemption history
  const fetchRedemptionHistory = async () => {
    if (!userId) return;
    try {
      const data = await rewardsAPI.getRedemptionHistory(userId, { limit: 5 });
      setRedemptionHistory(data.data);
    } catch (error) {
      console.error('Error fetching redemption history:', handleAPIError(error));
    }
  };

  // Fetch earning tips
  const fetchEarningTips = async () => {
    try {
      const data = await rewardsAPI.getEarningTips();
      setEarningTips(data.data);
    } catch (error) {
      console.error('Error fetching earning tips:', handleAPIError(error));
    }
  };

  // Fetch rank progress
  const fetchRankProgress = async () => {
    if (!userId) return;
    try {
      console.log('Fetching rank progress for userId:', userId);
      const data = await rewardsAPI.getRankProgress(userId);
      console.log('Rank progress response:', data);
      setRankProgress(data.data);
    } catch (error: any) {
      console.error('Error fetching rank progress:', handleAPIError(error));
      // If user not found, try to initialize them
      if (error instanceof Error && error.message?.includes('not found')) {
        try {
          await rewardsAPI.initializeUser(userId);
          // Retry after initialization
          const retryData = await rewardsAPI.getRankProgress(userId);
          setRankProgress(retryData.data);
        } catch (initError) {
          console.error('Failed to initialize user for rank progress:', initError);
        }
      }
    }
  };

  // Redeem reward
  const handleRedeem = async (rewardId: string) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    setRedeeming(rewardId);
    try {
      const data = await rewardsAPI.redeemReward(userId, rewardId);
      
      // Enhanced success message with token information
      let successMessage = 'Successfully redeemed!';
      
      if (data.data.voucher_code) {
        successMessage += ` Voucher code: ${data.data.voucher_code}`;
      }
      
      if (data.data.token_reward && data.data.token_reward.attempted) {
        if (data.data.token_reward.success) {
          successMessage += ` 🎉 ${data.data.token_reward.token_amount} JTN tokens transferred to your wallet!`;
        } else {
          successMessage += ` (Note: Token transfer failed - ${data.data.token_reward.error})`;
        }
      }
      
      toast.success(successMessage, {
        duration: 5000, // Show longer for token information
      });
      
      // Show detailed token info in console for debugging
      if (data.data.token_reward) {
        console.log('Token reward details:', data.data.token_reward);
      }
      
      // Refresh data
      await Promise.all([
        fetchUserBalance(),
        fetchRewards(),
        fetchRedemptionHistory(),
      ]);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      toast.error(`Error: ${errorMessage}`);
      
      // Show specific error codes for better UX
      if (error instanceof Error) {
        if (error.message.includes('Already claimed')) {
          toast.error('This badge has already been claimed!', { duration: 4000 });
        } else if (error.message.includes('Usage limit exceeded')) {
          toast.error('You have reached the maximum number of redemptions for this reward', { duration: 4000 });
        }
      }
    } finally {
      setRedeeming(null);
    }
  };

  // Fetch rewards data
  useEffect(() => {
    const fetchRewardsData = async () => {
      // Don't fetch if userData is still loading or no valid userId
      if (userDataLoading || !userId) {
        console.log('Not fetching rewards data yet - userDataLoading:', userDataLoading, 'userId:', userId);
        if (!userDataLoading && !userId) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        
        console.log('Fetching rewards data for userId:', userId);
        
        // Fetch all data in parallel
        await Promise.all([
          fetchUserBalance(),
          fetchRewards(),
          fetchRedemptionHistory(),
          fetchEarningTips(),
          fetchRankProgress(),
        ]);
      } catch (err) {
        console.error('Error fetching rewards data:', err);
        setError('Failed to load rewards data');
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsData();
  }, [userId, userDataLoading]); // Re-fetch when userId changes or userDataLoading completes

  // Redirect to dashboard if wallet not connected
  useEffect(() => {
    if (!isConnected || !address) {
      router.push('/dashboard');
    }
  }, [isConnected, address, router]);

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
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
              <p className="text-gray-600 max-w-md">
                To access your rewards and redeem points, please connect your wallet using the button above.
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
          <p className="text-gray-600">Loading rewards...</p>
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
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Gift className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                Rewards
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Redeem your points for exciting rewards and exclusive benefits
            </p>
          </div>

          {/* Points Balance */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Points Balance</h2>
                <div className="flex items-center space-x-2">
                  <Coins className="w-8 h-8" />
                  <span className="text-4xl font-bold">{userBalance?.total_points?.toLocaleString() || '0'}</span>
                  <span className="text-xl">points</span>
                </div>
                <p className="mt-2 opacity-90">Keep exploring to earn more points!</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-75">Rank</p>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6" />
                  <span className="text-xl font-semibold">{userBalance?.rank || 'Explorer'}</span>
                </div>
                <p className="text-sm opacity-75 mt-1">
                  {userBalance?.next_rank 
                    ? `${userBalance.points_to_next_rank} points to next rank`
                    : 'Max rank achieved!'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Reward Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Rewards */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Available Rewards</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rewards.map((reward) => {
                      const colorClasses = getColorClasses(reward.color);
                      const canAfford = userBalance ? userBalance.total_points >= reward.cost_points : false;
                      const isRedeeming = redeeming === reward.id;
                      const canClaim = reward.can_claim !== undefined ? reward.can_claim : true;
                      const hasClaimed = reward.has_been_claimed || false;
                      const isBadgeOrFeature = reward.type === 'badge' || reward.type === 'feature';
                      
                      // Determine button state and text
                      let buttonText = 'Redeem';
                      let buttonDisabled = false;
                      let buttonClass = colorClasses.button;
                      
                      if (isRedeeming) {
                        buttonText = 'Redeeming...';
                        buttonDisabled = true;
                      } else if (isBadgeOrFeature && hasClaimed) {
                        // Check if already claimed FIRST (highest priority)
                        buttonText = 'Already Claimed';
                        buttonDisabled = true;
                        buttonClass = 'bg-green-500 cursor-not-allowed';
                      } else if (!canClaim && reward.claim_block_reason) {
                        buttonText = reward.claim_block_reason;
                        buttonDisabled = true;
                        buttonClass = 'bg-gray-400 cursor-not-allowed';
                      } else if (!reward.is_available) {
                        buttonText = 'Out of Stock';
                        buttonDisabled = true;
                        buttonClass = 'bg-gray-400 cursor-not-allowed';
                      } else if (!canAfford) {
                        buttonText = 'Insufficient Points';
                        buttonDisabled = true;
                        buttonClass = 'bg-gray-400 cursor-not-allowed';
                      }
                      
                      return (
                        <div key={reward.id} className={`border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md ${colorClasses.hover} ${hasClaimed && isBadgeOrFeature ? 'bg-green-50 border-green-200' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 ${colorClasses.bg} rounded-lg relative`}>
                              {getIconComponent(reward.icon, `w-6 h-6 ${colorClasses.text}`)}
                              {hasClaimed && isBadgeOrFeature && (
                                <CheckCircle className="w-4 h-4 text-green-600 absolute -top-1 -right-1 bg-white rounded-full" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {reward.title}
                                </h3>
                                {isBadgeOrFeature && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {reward.type === 'badge' ? 'Badge' : 'Feature'}
                                  </span>
                                )}
                                {reward.is_repeatable && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Repeatable
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {reward.description}
                              </p>
                              
                              {/* Show claim count for repeatable rewards */}
                              {reward.is_repeatable && reward.user_redemption_count !== undefined && reward.user_redemption_count > 0 && (
                                <p className="text-xs text-gray-500 mb-2">
                                  Claimed {reward.user_redemption_count} time{reward.user_redemption_count > 1 ? 's' : ''}
                                  {reward.remaining_claims !== undefined && reward.remaining_claims > 0 && (
                                    <span> • {reward.remaining_claims} remaining</span>
                                  )}
                                </p>
                              )}
                              
                              {hasClaimed && reward.last_redeemed_at && (
                                <p className="text-xs text-green-600 mb-2">
                                  Last claimed: {formatTimeAgo(reward.last_redeemed_at)}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <Coins className="w-4 h-4 text-yellow-600" />
                                  <span className="font-semibold text-gray-900">
                                    {reward.cost_points.toLocaleString()} points
                                  </span>
                                </div>
                                <button 
                                  onClick={() => handleRedeem(reward.id)}
                                  disabled={buttonDisabled}
                                  className={`px-3 py-1 text-white text-sm rounded transition-colors ${buttonClass}`}
                                  title={buttonDisabled ? buttonText : ''}
                                >
                                  {buttonText}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {rewards.length === 0 && (
                      <div className="col-span-2 text-center py-8">
                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No rewards available at the moment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Redemption History */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Redemptions</h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {redemptionHistory.length > 0 ? (
                    redemptionHistory.map((item) => {
                      const colorClasses = getColorClasses(item.color);
                      return (
                        <div key={item.id} className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
                              {getIconComponent(item.icon, `w-4 h-4 ${colorClasses.text}`)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.title}</p>
                              <p className="text-xs text-gray-500">{formatTimeAgo(item.redeemed_at)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center">
                      <Gift className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No redemptions yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Point Earning Tips */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Earn More Points</h3>
                </div>
                
                <div className="p-6 space-y-3">
                  {earningTips.map((tip, index) => {
                    const colorMap = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-orange-500'];
                    const color = colorMap[index % colorMap.length];
                    
                    return (
                      <div key={tip.category} className="flex items-center space-x-3 text-sm">
                        <div className={`w-2 h-2 ${color} rounded-full`}></div>
                        <span className="text-gray-700">{tip.action}: {tip.points}</span>
                      </div>
                    );
                  })}
                  
                  {earningTips.length === 0 && (
                    <div className="text-center py-4">
                      <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Loading earning tips...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Rank Progress */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Rank Progress</h3>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-4">
                    <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">{rankProgress?.current_rank.name || 'Explorer'}</p>
                    <p className="text-sm text-gray-500">Current Rank</p>
                  </div>
                  
                  {rankProgress?.next_rank ? (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress to {rankProgress.next_rank.name}</span>
                          <span>{rankProgress.progress.current_points.toLocaleString()}/{rankProgress.next_rank.min_points.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{width: `${rankProgress.progress.progress_percentage}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 text-center">
                        {rankProgress.next_rank.points_needed.toLocaleString()} more points to unlock exclusive {rankProgress.next_rank.name} rewards!
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="w-full bg-blue-600 rounded-full h-2"></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        🎉 Congratulations! You've reached the maximum rank!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
