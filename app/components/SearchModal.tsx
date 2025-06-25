"use client";
import React, { useState, useEffect } from "react";
import { Search, X, MapPin } from "lucide-react";
import { LocationSuggestion } from "../types";
import { locationSuggestions } from "../utils/mockData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationSuggestion) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onLocationSelect,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = locationSuggestions.filter(
        (location) =>
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          location.country.toLowerCase().includes(query.toLowerCase()) ||
          location.city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(locationSuggestions);
    }
  }, [query]);

  const handleLocationClick = (location: LocationSuggestion) => {
    onLocationSelect(location);
    onClose();
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-heading font-semibold text-gray-900">
            Search Locations
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for cities, countries, or landmarks..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent font-body"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            <div className="p-2">
              {filteredSuggestions.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationClick(location)}
                  className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-left"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-body font-medium text-gray-900">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600">{location.country}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 font-body">
                No locations found for "{query}"
              </p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 font-body">
                Start typing to search for locations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
