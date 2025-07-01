"use client";

import React, { useState, useEffect } from "react";
import { Journey, MapViewState, LocationSuggestion } from "@/types";
import { mockJourneys, mockUsers } from "@/utils/mockData";
import { useGeolocation } from "@/hooks/useGeolocation";
import useGetUserData from "@/hooks/useAddress";

import Header from "@/components/Header";
import Map from "@/components/Map";
import JourneyModal from "@/components/JourneyModal";
import JourneyCard from "@/components/JourneyCard";
import JourneyDetailsModal from "@/components/JourneyDetailsModal";
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

    const [journeys, setJourneys] = useState<Journey[]>(mockJourneys);
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | undefined>(undefined);
    const [initialLocationSet, setInitialLocationSet] = useState(false);
    const [centerMapRequested, setCenterMapRequested] = useState(false);
    const [showAccuracyStatus, setShowAccuracyStatus] = useState(true);

    // Modal states  
    const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
    const [isJourneyDetailsModalOpen, setIsJourneyDetailsModalOpen] = useState(false);
    const [isSidebarJourneyOpen, setIsSidebarJourneyOpen] = useState(false);

    // Map state
    const [mapViewState, setMapViewState] = useState<MapViewState>({
        center: [0, 20], // Default center
        zoom: 2,
    });
    // open sidebar journey effect

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

    // Reset initial location flag when user logs out
    useEffect(() => {
        if (!users) {
            setInitialLocationSet(false);
        }
    }, [users]);


    const handleLocationSelect = (location: LocationSuggestion) => {
        setSelectedLocation(location);
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
    };

    const handleJourneyCreate = (
        journeyData: Omit<Journey, "id" | "userId" | "createdAt">
    ) => {
        if (!users) return;

        const newJourney: Journey = {
            ...journeyData,
            id: Date.now().toString(),
            userId: users.id,
            createdAt: new Date(),
        };

        setJourneys((prev) => [newJourney, ...prev]);
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

    const getAuthor = (userId: string) => {
        return mockUsers.find((user) => user.id === userId) || mockUsers[0];
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
                                <div className={`absolute top-20 left-4 right-4 px-4 py-3 rounded-lg z-30 text-sm shadow-lg ${accuracy <= 100
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
                                            onClick={() => setShowAccuracyStatus(false)}
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
                                onClick={() => setIsJourneyModalOpen(true)}
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

                        {/* Journey Cards Sidebar */}
                        <div
                            className="text-black hider flex px-1  fixed w-[55px] h-[40px] top-[200px] -right-5 bg-white shadow-lg cursor-pointer rounded-full"
                            onClick={() => setIsSidebarJourneyOpen((prev) => !prev)}
                        >
                            <svg
                                width={30}
                                clipRule="evenodd"
                                fillRule="evenodd"
                                strokeLinejoin="round"
                                strokeMiterlimit="2"
                                viewBox="0 0 22 22"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m21 15.75c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75z"
                                    fillRule="nonzero"
                                />
                            </svg>
                        </div>
                        {isSidebarJourneyOpen && (
                            <div className=" journey-sidebar w-80 bg-white border-l border-gray-200 overflow-y-auto relative z-20 transition duration-100">
                                <div className="bg-white sticky left-0 right-0 top-0 bg-whte z-80 p-4 border-b border-gray-200 flex justify-between">
                                    <div
                                        className="close text-black w-7 h-7 cursor-pointer flex justify-center items-center font-bold rounded-full shadow "
                                        onClick={() => setIsSidebarJourneyOpen((prev) => !prev)}
                                    >
                                        x
                                    </div>
                                    <div className="title">
                                        <h2 className="text-lg font-heading font-semibold text-gray-900">
                                            Recent Journeys
                                        </h2>
                                        <p className="text-sm font-body text-gray-600 mt-1">
                                            {journeys.length} adventure
                                            {journeys.length !== 1 ? "s" : ""} shared
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    {journeys.map((journey) => (
                                        <JourneyCard
                                            key={journey.id}
                                            journey={journey}
                                            author={getAuthor(journey.userId)}
                                            onClick={() => handleJourneyCardClick(journey)}
                                        />
                                    ))}

                                    {journeys.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg
                                                    className="w-8 h-8 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="font-heading font-medium text-gray-900 mb-2">
                                                No journeys yet
                                            </h3>
                                            <p className="text-sm font-body text-gray-600">
                                                Click on the map or search for a location to share
                                                your first journey!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
           

            <JourneyModal
              isOpen={isJourneyModalOpen}
              onClose={() => setIsJourneyModalOpen(false)}
              onJourneyCreate={handleJourneyCreate}
              selectedLocation={selectedLocation}
            />

            <JourneyDetailsModal
              journey={selectedJourney}
              author={
                selectedJourney ? getAuthor(selectedJourney.userId) : null
              }
              allJourneys={journeys}
              isOpen={isJourneyDetailsModalOpen}
              onClose={() => {
                setIsJourneyDetailsModalOpen(false);
                setSelectedJourney(null);
              }}
            />
          </>
        )}


        </div>
    );
}