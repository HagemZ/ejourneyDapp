"use client";

import React, { useEffect, useRef, useState } from "react";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Circle from "ol/geom/Circle";
import { Style, Icon, Fill, Stroke, Text } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";
import { Journey, MapViewState, LocationSuggestion } from "../types";
import { Overlay } from "ol";
import { Modify, Select } from "ol/interaction";
import { click } from "ol/events/condition";
import { useGeolocation } from "../hooks/useGeolocation";

interface MapProps {
  journeys: Journey[];
  viewState: MapViewState;
  onViewStateChange: (viewState: MapViewState) => void;
  onLocationSelect: (location: LocationSuggestion) => void;
  selectedJourney?: Journey;
  onJourneySelect: (journey: Journey | null) => void;
}

export default function Map({
  journeys,
  viewState,
  onViewStateChange,
  onLocationSelect,
  selectedJourney,
  onJourneySelect,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OLMap | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const userLocationLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const userLocationFeatureRef = useRef<Feature | null>(null);
  const accuracyCircleFeatureRef = useRef<Feature | null>(null);
  const [isUpdatingView, setIsUpdatingView] = useState(false);
  const [userLocationCoords, setUserLocationCoords] = useState<
    [number, number] | null
  >(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number>(0);

  const { coordinates, getCurrentLocation } = useGeolocation();

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map
    const map = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(viewState.center),
        zoom: viewState.zoom,
        enableRotation: false,
      }),
    });

    // Create popup overlay
    if (popupRef.current) {
      const overlay = new Overlay({
        element: popupRef.current,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      map.addOverlay(overlay);
      overlayRef.current = overlay;
    }

    mapInstanceRef.current = map;

    // Handle view state changes with debouncing
    let viewChangeTimeout: NodeJS.Timeout;

    const handleViewChange = () => {
      if (isUpdatingView) return;

      clearTimeout(viewChangeTimeout);
      viewChangeTimeout = setTimeout(() => {
        const center = toLonLat(map.getView().getCenter()!);
        const zoom = map.getView().getZoom()!;
        onViewStateChange({ center: [center[0], center[1]], zoom });
      }, 100);
    };

    map.getView().on("change:center", handleViewChange);
    map.getView().on("change:resolution", handleViewChange);

    // Handle map clicks
    map.on("singleclick", (event) => {
      const coordinate = toLonLat(event.coordinate);
      const location: LocationSuggestion = {
        name: `Location at ${coordinate[1].toFixed(4)}, ${coordinate[0].toFixed(
          4
        )}`,
        coordinates: [coordinate[0], coordinate[1]],
        country: "Unknown",
        city: "Unknown",
      };
      onLocationSelect(location);
    });

    return () => {
      clearTimeout(viewChangeTimeout);
      map.setTarget(undefined);
    };
  }, []);

  // Update user location when GPS coordinates change
  useEffect(() => {
    if (coordinates) {
      setUserLocationCoords(coordinates);
      // Get current location with accuracy info
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationAccuracy(position.coords.accuracy);
          },
          null,
          { enableHighAccuracy: true }
        );
      }
    }
  }, [coordinates]);

  // Create/update user location layer
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocationCoords) return;

    const map = mapInstanceRef.current;

    // Remove existing user location layer
    if (userLocationLayerRef.current) {
      map.removeLayer(userLocationLayerRef.current);
    }

    // Create user location feature
    const userLocationFeature = new Feature({
      geometry: new Point(fromLonLat(userLocationCoords)),
      type: "userLocation",
    });

    userLocationFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: `data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#4285F4" stroke="white" stroke-width="3"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `)}`,
          scale: 1,
        }),
        text: new Text({
          text: `${userLocationCoords[1].toFixed(
            6
          )}, ${userLocationCoords[0].toFixed(6)}`,
          offsetY: -35,
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
          font: "12px Arial",
          textAlign: "center",
          backgroundFill: new Fill({ color: "rgba(255, 255, 255, 0.8)" }),
          padding: [2, 4, 2, 4],
        }),
      })
    );

    // Create accuracy circle
    const accuracyCircle = new Feature({
      geometry: new Circle(fromLonLat(userLocationCoords), locationAccuracy),
      type: "accuracyCircle",
    });

    accuracyCircle.setStyle(
      new Style({
        fill: new Fill({
          color: "rgba(66, 133, 244, 0.1)",
        }),
        stroke: new Stroke({
          color: "#4285F4",
          width: 1,
          lineDash: [5, 5],
        }),
      })
    );

    // Create vector source and layer
    const userLocationSource = new VectorSource({
      features: [accuracyCircle, userLocationFeature],
    });

    const userLocationLayer = new VectorLayer({
      source: userLocationSource,
      zIndex: 1000,
    });

    userLocationLayer.set("name", "userLocation");
    map.addLayer(userLocationLayer);

    // Store references
    userLocationLayerRef.current = userLocationLayer;
    userLocationFeatureRef.current = userLocationFeature;
    accuracyCircleFeatureRef.current = accuracyCircle;

    // Add modify interaction for dragging user location
    const select = new Select({
      condition: click,
      filter: (feature) => feature.get("type") === "userLocation",
    });

    const modify = new Modify({
      features: select.getFeatures(),
      pixelTolerance: 20,
    });

    map.addInteraction(select);
    map.addInteraction(modify);

    // Handle drag end - constrain movement within accuracy radius
    modify.on("modifyend", (event) => {
      const modifiedFeature = event.features.getArray()[0];
      if (modifiedFeature && modifiedFeature.get("type") === "userLocation") {
        const newCoords = toLonLat(
          modifiedFeature.getGeometry()!.getCoordinates()
        );
        const originalCoords = userLocationCoords;

        // Calculate distance from original position
        const distance = calculateDistance(
          originalCoords[1],
          originalCoords[0],
          newCoords[1],
          newCoords[0]
        );

        // If moved more than accuracy radius (max 60m), snap back to edge
        const maxDistance = Math.min(locationAccuracy, 60); // Max 60m as requested

        if (distance > maxDistance) {
          // Calculate direction and snap to edge
          const bearing = calculateBearing(
            originalCoords[1],
            originalCoords[0],
            newCoords[1],
            newCoords[0]
          );

          const constrainedCoords = calculateDestination(
            originalCoords[1],
            originalCoords[0],
            bearing,
            maxDistance
          );

          // Update feature position
          modifiedFeature
            .getGeometry()!
            .setCoordinates(
              fromLonLat([constrainedCoords[1], constrainedCoords[0]])
            );
          setUserLocationCoords([constrainedCoords[1], constrainedCoords[0]]);
        } else {
          setUserLocationCoords(newCoords);
        }

        // Update coordinate display
        const currentCoords = toLonLat(
          modifiedFeature.getGeometry()!.getCoordinates()
        );
        modifiedFeature.setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 0.5],
              src: `data:image/svg+xml;utf8,${encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#4285F4" stroke="white" stroke-width="3"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `)}`,
              scale: 1,
            }),
            text: new Text({
              text: `${currentCoords[1].toFixed(6)}, ${currentCoords[0].toFixed(
                6
              )}`,
              offsetY: -35,
              fill: new Fill({ color: "#000" }),
              stroke: new Stroke({ color: "#fff", width: 2 }),
              font: "12px Arial",
              textAlign: "center",
              backgroundFill: new Fill({ color: "rgba(255, 255, 255, 0.8)" }),
              padding: [2, 4, 2, 4],
            }),
          })
        );
      }
    });

    return () => {
      map.removeInteraction(select);
      map.removeInteraction(modify);
    };
  }, [userLocationCoords, locationAccuracy]);

  // Update journey markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing journey layer
    const existingLayer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.get("name") === "journeys");
    if (existingLayer) {
      map.removeLayer(existingLayer);
    }

    // Create features for journeys
    const features = journeys.map((journey) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(journey.location.coordinates)),
        journey: journey,
        type: "journey",
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: `data:image/svg+xml;utf8,${encodeURIComponent(`
              <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.2 0 0 7.2 0 16c0 16 16 24 16 24s16-8 16-24C32 7.2 24.8 0 16 0z" fill="${
                  selectedJourney?.id === journey.id ? "#42A5F5" : "#64B5F6"
                }"/>
                <path d="M16 0C7.2 0 0 7.2 0 16c0 16 16 24 16 24s16-8 16-24C32 7.2 24.8 0 16 0z" fill="${
                  selectedJourney?.id === journey.id ? "#42A5F5" : "#64B5F6"
                }" stroke="#1976D2" stroke-width="1"/>
                <circle cx="16" cy="16" r="8" fill="white"/>
                <text x="16" y="20" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#1976D2">${
                  journey.rating
                }</text>
              </svg>
            `)}`,
            scale: selectedJourney?.id === journey.id ? 1.2 : 1,
          }),
          text: new Text({
            text: `${
              journey.location.name
            }\n${journey.location.coordinates[1].toFixed(
              4
            )}, ${journey.location.coordinates[0].toFixed(4)}`,
            offsetY: 45,
            fill: new Fill({ color: "#000" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
            font: "11px Arial",
            textAlign: "center",
            backgroundFill: new Fill({ color: "rgba(255, 255, 255, 0.8)" }),
            padding: [2, 4, 2, 4],
          }),
        })
      );

      return feature;
    });

    // Create vector layer
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
      zIndex: 500,
    });
    vectorLayer.set("name", "journeys");

    map.addLayer(vectorLayer);

    // Handle marker clicks
    const clickHandler = (event: any) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature.get("type") === "journey") return feature;
        return null;
      });

      if (feature && feature.get("journey")) {
        const journey = feature.get("journey") as Journey;
        onJourneySelect(journey);

        // Show popup
        if (overlayRef.current && popupRef.current) {
          overlayRef.current.setPosition(event.coordinate);
        }
      } else {
        onJourneySelect(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    };

    map.on("click", clickHandler);

    return () => {
      map.un("click", clickHandler);
    };
  }, [journeys, selectedJourney]);

  // Update view when viewState changes externally
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const view = map.getView();
    const currentCenter = toLonLat(view.getCenter()!);
    const currentZoom = view.getZoom()!;

    const centerDiff =
      Math.abs(currentCenter[0] - viewState.center[0]) +
      Math.abs(currentCenter[1] - viewState.center[1]);
    const zoomDiff = Math.abs(currentZoom - viewState.zoom);

    if (centerDiff > 0.001 || zoomDiff > 0.1) {
      setIsUpdatingView(true);

      view.animate(
        {
          center: fromLonLat(viewState.center),
          zoom: viewState.zoom,
          duration: 500,
        },
        () => {
          setIsUpdatingView(false);
        }
      );
    }
  }, [viewState]);

  return (
    <div className="relative w-full h-full ">
      <div ref={mapRef} className="w-full h-full" />

      {/* User Location Info Panel */}
      {userLocationCoords && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-10">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">
              Your Location
            </span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Lat: {userLocationCoords[1].toFixed(6)}</div>
            <div>Lng: {userLocationCoords[0].toFixed(6)}</div>
            <div>Accuracy: ±{locationAccuracy.toFixed(0)}m</div>
            <div className="text-xs text-blue-600 mt-2">
              📍 Drag to adjust (max {Math.min(locationAccuracy, 60)}m)
            </div>
          </div>
        </div>
      )}

      {/* Refresh Location Button */}
      <button
        onClick={getCurrentLocation}
        className="absolute bottom-4 left-4 bg-white hover:bg-gray-50 p-3 rounded-lg shadow-lg border border-gray-200 z-10 transition-colors duration-200"
        title="Refresh your location"
      >
        <svg
          className="w-5 h-5 text-gray-700"
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
      </button>

      {/* Popup */}
      <div
        ref={popupRef}
        className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs transform -translate-x-1/2 -translate-y-full"
        style={{ display: selectedJourney ? "block" : "none" }}
      >
        {selectedJourney && (
          <div>
            <h3 className="font-heading font-semibold text-gray-900 mb-1">
              {selectedJourney.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {selectedJourney.location.name}
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < selectedJourney.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {selectedJourney.rating}/5
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions for distance and bearing calculations
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

  return Math.atan2(y, x);
}

function calculateDestination(
  lat: number,
  lon: number,
  bearing: number,
  distance: number
): [number, number] {
  const R = 6371000; // Earth's radius in meters
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(distance / R) +
      Math.cos(latRad) * Math.sin(distance / R) * Math.cos(bearing)
  );

  const newLonRad =
    lonRad +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distance / R) * Math.cos(latRad),
      Math.cos(distance / R) - Math.sin(latRad) * Math.sin(newLatRad)
    );

  return [(newLatRad * 180) / Math.PI, (newLonRad * 180) / Math.PI];
}
