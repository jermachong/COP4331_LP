import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import PopularTripsSection from "./PopularTripsSection";
import CTASection from "./CTASection";

interface UserData {
  userId: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface LandingPageProps {
  onLogin: (username: string, userData: UserData) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div>
      <div id="hero">
        <HeroSection onLogin={onLogin} />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="popular-trips">
        <PopularTripsSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <CTASection onLogin={onLogin} />
    </div>
  );
};

export default LandingPage;
