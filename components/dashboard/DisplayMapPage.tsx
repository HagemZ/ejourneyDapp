"use client";

import React, { useState, useEffect } from "react";
import { Journey, MapViewState, LocationSuggestion } from "@/types";
import { mockJourneys, mockUsers } from "@/utils/mockData";
import { useGeolocation } from "@/hooks/useGeolocation";
import useGetUserData from "@/hooks/useAddress";
import { fetchJourneys } from "../../actions/journeyActions";

import Header from "@/components/Header";
import Map from "@/components/Map";
import JourneyModal from "@/components/JourneyModal";
import JourneyCard from "@/components/JourneyCard";
import JourneyDetailsModal from "@/components/JourneyDetailsModal";
import LocationConfirmationPopup from "@/components/LocationConfirmationPopup";
import MainSidebar from "@/components/MainSidebar";
import RecentJourneys from "@/components/RecentJourneys";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

export default function DisplayMap() {
    const router = useRouter();
    const { users } = useGetUserData();
    const {
        coordinates,
        accuracy,
        loading: gpsLoading,
        error: gpsError,
        getCurrentLocation,
    } = useGeolocation();

    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | undefined>(undefined);
    const [initialLocationSet, setInitialLocationSet] = useState(false);
    const [centerMapRequested, setCenterMapRequested] = useState(false);
    const [journeyZoomRequested, setJourneyZoomRequested] = useState<[number, number] | null>(null);
    const [showAccuracyStatus, setShowAccuracyStatus] = useState(true);
    const [accuracyStatusVisible, setAccuracyStatusVisible] = useState(true);
    const [journeysLoading, setJourneysLoading] = useState(true);

    // Modal states  
    const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
    const [isJourneyDetailsModalOpen, setIsJourneyDetailsModalOpen] = useState(false);
    const [isLocationConfirmationOpen, setIsLocationConfirmationOpen] = useState(false);
    const [pendingLocationCoordinates, setPendingLocationCoordinates] = useState<[number, number] | null>(null);

    // Main sidebar state
    const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);
    
    // Recent journeys sidebar state
    const [isRecentJourneysOpen, setIsRecentJourneysOpen] = useState(false);

    // Map state
    const [mapViewState, setMapViewState] = useState<MapViewState>({
        center: [0, 20], // Default center
        zoom: 2,
    });
    const [verificationLocation, setVerificationLocation] = useState<[number, number] | null>(null);
    
    // Function to load journeys from database
    const loadJourneys = async () => {
        try {
            setJourneysLoading(true);
            const result = await fetchJourneys({
                status: 'active', // Only fetch active journeys for public view
                limit: 50,
                offset: 0
            });

            if (result.success && result.journeys) {
                setJourneys(result.journeys);
                console.log(`Loaded ${result.journeys.length} journeys from database`);
                // Debug: Log journey images and author data
                result.journeys.forEach(journey => {
                    console.log(`Journey "${journey.title}":`, {
                        userId: journey.userId,
                        authorName: journey.authorName,
                        authorEmail: journey.authorEmail,
                        hasImages: journey.images && journey.images.length > 0,
                        imageCount: journey.images ? journey.images.length : 0
                    });
                });
            } else {
                console.error('Failed to load journeys:', result.error);
                // Fallback to mock data if database fetch fails
                setJourneys(mockJourneys);
            }
        } catch (error) {
            console.error('Error loading journeys:', error);
            // Fallback to mock data on error
            setJourneys(mockJourneys);
        } finally {
            setJourneysLoading(false);
        }
    };

    // open sidebar journey effect

    // Load journeys from database when component mounts
    useEffect(() => {
        loadJourneys();
    }, []);

    // Get user's GPS location when they log in
    useEffect(() => {
        if (users && users.id && !initialLocationSet) {
            getCurrentLocation();
        }
    }, [users, initialLocationSet, getCurrentLocation]);


    // Update map view when GPS coordinates are received
    useEffect(() => {
        if (coordinates && users) {
            if (!initialLocationSet) {
                // Initial location set
                setMapViewState({
                    center: coordinates,
                    zoom: 12,
                });
                setInitialLocationSet(true);
            } else if (centerMapRequested) {
                // Center map was requested - zoom in closer and center
                console.log('Updating map view after center map request:', coordinates);
                setMapViewState({
                    center: coordinates,
                    zoom: 15,
                });
                setCenterMapRequested(false);
            }
        }
    }, [coordinates, users, initialLocationSet, centerMapRequested]);

    // Handle journey zoom requests separately from GPS centering
    useEffect(() => {
        if (journeyZoomRequested) {
            console.log('Zooming to journey location:', journeyZoomRequested);
            setMapViewState({
                center: journeyZoomRequested,
                zoom: 15,
            });
            setJourneyZoomRequested(null); // Reset the zoom request
        }
    }, [journeyZoomRequested]);

    // Reset initial location flag when user logs out
    useEffect(() => {
        if (!users) {
            setInitialLocationSet(false);
        }
    }, [users]);

    // Auto-slideout effect for high accuracy location notification
    useEffect(() => {
        if (coordinates && accuracy && accuracy <= 100 && showAccuracyStatus && accuracyStatusVisible) {
            // Show notification immediately when high accuracy is achieved
            setAccuracyStatusVisible(true);
            
            // Start slideout animation after 3 seconds
            const slideoutTimer = setTimeout(() => {
                setAccuracyStatusVisible(false);
                
                // Completely hide after animation completes
                const hideTimer = setTimeout(() => {
                    setShowAccuracyStatus(false);
                }, 500); // Match animation duration
                
                return () => clearTimeout(hideTimer);
            }, 3000);

            return () => clearTimeout(slideoutTimer);
        }
    }, [coordinates, accuracy, showAccuracyStatus, accuracyStatusVisible]);


    const handleLocationSelect = (location: LocationSuggestion, verificationLocation?: [number, number]) => {
        // If this is a direct location selection (from search, etc.), proceed normally
        if (location.name !== `Location at ${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`) {
            setSelectedLocation(location);
            if (verificationLocation) {
                setVerificationLocation(verificationLocation);
            }
            setMapViewState({
                center: location.coordinates,
                zoom: 10,
            });

            // Open journey modal if user is logged in
            if (users) {
                setIsJourneyModalOpen(true);
            } else {
                router.push("/");
            }
            return;
        }

        // This is a map click with basic coordinates - show confirmation popup
        if (users) {
            setPendingLocationCoordinates(location.coordinates as [number, number]);
            setIsLocationConfirmationOpen(true);
        } else {
            router.push("/");
        }
    };

    const handleLocationConfirm = (enhancedLocationData: LocationSuggestion) => {
        setSelectedLocation(enhancedLocationData);
        setMapViewState({
            center: enhancedLocationData.coordinates,
            zoom: 10,
        });
        setIsLocationConfirmationOpen(false);
        setPendingLocationCoordinates(null);
        setIsJourneyModalOpen(true);
    };

    const handleLocationConfirmCancel = () => {
        setIsLocationConfirmationOpen(false);
        setPendingLocationCoordinates(null);
    };

    const handleJourneyCreate = async (
        journeyData: Omit<Journey, "id" | "userId" | "createdAt">
    ) => {
        if (!users) return;

        // Reload journeys from database to include the newly created journey
        await loadJourneys();
        
        // Reset all modal and location states after journey creation
        setIsLocationConfirmationOpen(false);
        setPendingLocationCoordinates(null);
        setSelectedLocation(undefined);
        setVerificationLocation(null);
        
        console.log("Journey created, journeys reloaded, and all modal states reset");
    };

    const handleJourneySelect = (journey: Journey | null) => {
        setSelectedJourney(journey);
        if (journey) {
            setIsJourneyDetailsModalOpen(true);
        }
    };

    const handleJourneyCardClick = (journey: Journey) => {
        setSelectedJourney(journey);
        setMapViewState({
            center: journey.location.coordinates,
            zoom: 12,
        });
        setIsJourneyDetailsModalOpen(true);
    };

    const getAuthor = (journey: Journey) => {
        // Use real author data from the journey if available
        if (journey.authorName || journey.authorEmail) {
            return {
                id: journey.userId,
                name: journey.authorName || 'Anonymous User',
                email: journey.authorEmail || 'user@example.com',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${journey.userId}`,
                verified: true
            };
        }
        
        // Fallback to mock user if no author data available
        return mockUsers.find((user) => user.id === journey.userId) || mockUsers[0];
    };

    // Listen for center map event from header button
    useEffect(() => {
        const handleCenterMap = () => {
            console.log('Center map event received');
            setCenterMapRequested(true);
            
            // If we already have coordinates, center the map immediately
            if (coordinates) {
                console.log('Centering map to existing coordinates:', coordinates);
                setMapViewState({
                    center: coordinates,
                    zoom: 15, // Zoom in closer when manually centering
                });
            }
            
            // Always try to get fresh location for better accuracy
            getCurrentLocation();
        };

        window.addEventListener('centerMap', handleCenterMap);
        return () => window.removeEventListener('centerMap', handleCenterMap);
    }, [getCurrentLocation, coordinates]);

    return (

        <div className="h-screen flex flex-col bg-[#fafafb]">
            <Header />

            <div className="flex-1 flex pt-16 max-h-[100vh]">
                {users ? (
                    <>
                        {/* Map Section */}
                        <div className="flex-1 ">
                            {gpsLoading && !initialLocationSet && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-12 h-12 border-4 border-primary-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-700 font-body">
                                            Getting your location...
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Please allow location access
                                        </p>
                                    </div>
                                </div>
                            )}

                            {gpsError && !initialLocationSet && (
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                                    <div className="bg-white border border-red-300 text-red-700 px-6 py-5 rounded-xl shadow-lg max-w-md w-full">
                                        <div className="text-center mb-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <MapPin className="w-6 h-6 text-red-600" />
                                            </div>
                                            <h3 className="font-body text-lg font-semibold mb-2">
                                                Location Access Needed
                                            </h3>
                                            <p className="text-sm mb-4 text-red-600">
                                                {gpsError}
                                            </p>
                                        </div>
                                        
                                        <div className="text-sm space-y-2 mb-5 text-gray-700">
                                            <p className="flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                Click the location icon 🌍 in your browser's address bar
                                            </p>
                                            <p className="flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                Select "Allow" to enable location access
                                            </p>
                                            <p className="flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                Or use the search bar to manually find locations
                                            </p>
                                        </div>
                                        
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => getCurrentLocation()}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium"
                                            >
                                                Try Again
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Center map to a default location (Jakarta) and clear error
                                                    setMapViewState({
                                                        center: [106.845599, -6.208763],
                                                        zoom: 10,
                                                    });
                                                    setInitialLocationSet(true); // This will hide the error
                                                }}
                                                className="flex-1 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                            >
                                                Skip & Continue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Location accuracy status */}
                            {coordinates && accuracy && !gpsLoading && showAccuracyStatus && (
                                <div className={`absolute top-20 left-4 right-4 px-4 py-3 rounded-lg z-30 text-sm shadow-lg transition-all duration-500 ease-in-out transform ${
                                    accuracyStatusVisible 
                                        ? 'translate-x-0 opacity-100' 
                                        : 'translate-x-full opacity-0'
                                } ${accuracy <= 100
                                        ? 'bg-green-100 border border-green-400 text-green-700'
                                        : accuracy <= 1000
                                        ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
                                        : 'bg-red-100 border border-red-400 text-red-700'
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {accuracy <= 100 ? (
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                    ✓ High accuracy location (±{Math.round(accuracy)}m)
                                                </span>
                                            ) : accuracy <= 1000 ? (
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                                    ⚠ Moderate accuracy: ±{Math.round(accuracy)}m
                                                </span>
                                            ) : accuracy >= 50000 ? (
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                    ⚠ Low accuracy: ±{Math.round(accuracy/1000)}km (Try moving outdoors)
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                                    ⚠ Location accuracy: ±{Math.round(accuracy)}m
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setAccuracyStatusVisible(false);
                                                setTimeout(() => setShowAccuracyStatus(false), 500);
                                            }}
                                            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                                            title="Close"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <Map
                                journeys={journeys}
                                viewState={mapViewState}
                                onViewStateChange={setMapViewState}
                                onLocationSelect={handleLocationSelect}
                                selectedJourney={selectedJourney || undefined}
                                onJourneySelect={handleJourneySelect}
                                userLocation={coordinates}
                                userLocationAccuracy={accuracy}
                            />

                            {/* Floating Add Journey Button */}
                            <button
                                onClick={() => {
                                    // Clear any previously selected location
                                    setSelectedLocation(undefined);
                                    
                                    // Use current GPS coordinates as verification location
                                    if (coordinates) {
                                        setVerificationLocation(coordinates);
                                        console.log('Opening journey modal with current location:', coordinates);
                                    } else {
                                        // If no GPS coordinates, try to get them first
                                        getCurrentLocation();
                                    }
                                    
                                    setIsJourneyModalOpen(true);
                                }}
                                className="absolute bottom-6 right-6 bg-blue-300 hover:bg-primary-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
                                title="Add a new journey"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">
                                Welcome to MyJourney
                            </h2>
                            <p className="text-lg font-body text-gray-700 mb-6">
                                Please log in to start sharing your adventures!
                            </p>
                            <button
                                onClick={() => router.push("/")}
                                className="bg-blue-300 hover:bg-primary-400 text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-300"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                )}
            </div>

             {users && (
          <>
            {/* Location Confirmation Popup */}
            <LocationConfirmationPopup
              isOpen={isLocationConfirmationOpen}
              coordinates={pendingLocationCoordinates || [0, 0]}
              onConfirm={handleLocationConfirm}
              onCancel={handleLocationConfirmCancel}
            />

            <JourneyModal
              isOpen={isJourneyModalOpen}
              onClose={() => {
                setIsJourneyModalOpen(false);
                setVerificationLocation(null);
                setSelectedLocation(undefined); // Clear selected location
              }}
              onJourneyCreate={handleJourneyCreate}
              selectedLocation={selectedLocation}
              verificationLocation={verificationLocation}
              onViewJourney={(journey) => {
                setSelectedJourney(journey);
                setIsJourneyDetailsModalOpen(true);
              }}
            />

            <JourneyDetailsModal
              journey={selectedJourney}
              author={
                selectedJourney ? getAuthor(selectedJourney) : null
              }
              allJourneys={journeys}
              isOpen={isJourneyDetailsModalOpen}
              onClose={() => {
                setIsJourneyDetailsModalOpen(false);
                setSelectedJourney(null);
              }}
              onJourneyUpdated={loadJourneys} // Reload journeys when updated
            />
          </>
        )}

        {/* Main Navigation Sidebar */}
        <MainSidebar 
          isOpen={isMainSidebarOpen}
          onToggle={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
          onRecentJourneysToggle={() => setIsRecentJourneysOpen(true)}
        />

        {/* Recent Journeys Sidebar */}
        <RecentJourneys
          isOpen={isRecentJourneysOpen}
          onClose={() => setIsRecentJourneysOpen(false)}
          journeys={journeys}
          onJourneyClick={(journey) => {
            setSelectedJourney(journey);
            setIsJourneyDetailsModalOpen(true);
          }}
          onZoomToLocation={(journey) => {
            if (journey.location) {
              console.log('Journey zoom requested for:', journey.title, journey.location.coordinates);
              setJourneyZoomRequested([journey.location.coordinates[0], journey.location.coordinates[1]]);
            }
          }}
        />

        </div>
    );
}