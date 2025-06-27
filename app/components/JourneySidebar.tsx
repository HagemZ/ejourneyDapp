import React from "react";
import JourneyCard from "./JourneyCard";

type JourneySidebarProps = {};

const JourneySidebar = (props: Props) => {
  return (
    <div className="w-80 bg-red-500 border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-heading font-semibold text-gray-900">
          Recent Journeys
        </h2>
        <p className="text-sm font-body text-gray-600 mt-1">
          {journeys.length} adventure
          {journeys.length !== 1 ? "s" : ""} shared
        </p>
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
              Click on the map or search for a location to share your first
              journey!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneySidebar;
