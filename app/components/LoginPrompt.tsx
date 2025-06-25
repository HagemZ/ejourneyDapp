import React from "react";
import { MapPin, Globe, Users, Star } from "lucide-react";
import Homepage from "./Homepage";
import Service from "./Service";
import TransparencySection from "./TransparencySection";
import Question from "./Question";

interface LoginPromptProps {
  onLoginClick: () => void;
}

export default function LoginPrompt({ onLoginClick }: LoginPromptProps) {
  return (
    <div className="overflow-hidden  bg-[#fafafb]">
      <Homepage onLoginClick={onLoginClick} />
      <Service />
      <TransparencySection />
      <Question />

      <div className="mt-6 p-4 bg-warning/30 rounded-lg">
        <p className="text-sm font-body text-gray-700">
          <strong>Demo:</strong> Use any email with password "password123" to
          explore the app
        </p>
      </div>
    </div>
  );
}
