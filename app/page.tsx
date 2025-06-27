"use client";

import React, { createContext, useState, useEffect } from "react";
import { AuthContext, useAuthProvider } from "./hooks/useAuth";
import { Journey, MapViewState, LocationSuggestion } from "./types";
import { mockJourneys, mockUsers } from "./utils/mockData";
import { useGeolocation } from "./hooks/useGeolocation";

import Header from "./components/Header";
import Map from "./components/Map";
import AuthModal from "./components/AuthModal";
import SearchModal from "./components/SearchModal";
import JourneyModal from "./components/JourneyModal";
import JourneyCard from "./components/JourneyCard";
import JourneyDetailsModal from "./components/JourneyDetailsModal";
import LoginPrompt from "./components/LoginPrompt";

export default function Home() {
  const authContextValue = useAuthProvider();
  const {
    coordinates,
    loading: gpsLoading,
    error: gpsError,
    getCurrentLocation,
  } = useGeolocation();
  const [journeys, setJourneys] = useState<Journey[]>(mockJourneys);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [isJourneyDetailsModalOpen, setIsJourneyDetailsModalOpen] =
    useState(false);
  const [isSidebarJourneyOpen, setIsSidebarJourneyOpen] = useState(false);

  // Map state
  const [mapViewState, setMapViewState] = useState<MapViewState>({
    center: [0, 20], // Default center
    zoom: 2,
  });
  // open sidebar journey effect

  // Get user's GPS location when they log in
  useEffect(() => {
    if (authContextValue.user && !initialLocationSet) {
      getCurrentLocation();
    }
  }, [authContextValue.user, initialLocationSet, getCurrentLocation]);

  // Update map view when GPS coordinates are received
  useEffect(() => {
    if (coordinates && authContextValue.user && !initialLocationSet) {
      setMapViewState({
        center: coordinates,
        zoom: 12,
      });
      setInitialLocationSet(true);
    }
  }, [coordinates, authContextValue.user, initialLocationSet]);

  // Reset initial location flag when user logs out
  useEffect(() => {
    if (!authContextValue.user) {
      setInitialLocationSet(false);
    }
  }, [authContextValue.user]);

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setMapViewState({
      center: location.coordinates,
      zoom: 10,
    });

    // Open journey modal if user is logged in
    if (authContextValue.user) {
      setIsJourneyModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleJourneyCreate = (
    journeyData: Omit<Journey, "id" | "userId" | "createdAt">
  ) => {
    if (!authContextValue.user) return;

    const newJourney: Journey = {
      ...journeyData,
      id: Date.now().toString(),
      userId: authContextValue.user.id,
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

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="h-screen flex flex-col bg-[#fafafb]">
        <Header
          onSearchClick={() => setIsSearchModalOpen(true)}
          onProfileClick={() => setIsAuthModalOpen(true)}
        />

        <div className="flex-1 flex pt-16 max-h-[100vh]">
          {authContextValue.user ? (
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
                  <div className="absolute top-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg z-10">
                    <p className="font-body text-sm">
                      <strong>Location access denied:</strong> {gpsError}
                    </p>
                    <p className="text-xs mt-1">
                      You can still use the map, but we'll start with a world
                      view.
                    </p>
                  </div>
                )}

                <Map
                  journeys={journeys}
                  viewState={mapViewState}
                  onViewStateChange={setMapViewState}
                  onLocationSelect={handleLocationSelect}
                  selectedJourney={selectedJourney}
                  onJourneySelect={handleJourneySelect}
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
            <LoginPrompt onLoginClick={() => setIsAuthModalOpen(true)} />
          )}
        </div>

        {/* Modals */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />

        {authContextValue.user && (
          <>
            <SearchModal
              isOpen={isSearchModalOpen}
              onClose={() => setIsSearchModalOpen(false)}
              onLocationSelect={handleLocationSelect}
            />

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
    </AuthContext.Provider>
  );
}
