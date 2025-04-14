import React from "react";
import TripCard from "./TripCard";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Explore from "../../../../components/Explore";
import SavedTripsPreview from "../../../../components/SavedTripsPreview";

const ExploreSection: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { firstName } = user;

  const handleCreateNewTrip = () => {
    navigate("/tripQuestionnaire");
  };

  const upcomingTrips = [
    {
      id: 101,
      title: "Weekend in Paris",
      description: "Quick getaway to the city of lights",
      image:
        "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyaXN8ZW58MHwwfDB8fHww",
      startDate: "Nov 10, 2023",
      endDate: "Nov 13, 2023",
      companions: 2,
    },
    {
      id: 102,
      title: "Summer in Rome",
      description: "Exploring the ancient city with friends",
      image:
        "https://images.unsplash.com/photo-1542820229-081e0c12af0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cm9tZXxlbnwwfDB8MHx8fDA%3D",
      startDate: "Jul 5, 2023",
      endDate: "Jul 15, 2023",
      companions: 4,
    },
  ];

  return (
    <div className="container py-4">
      {/* Welcome section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h2 mb-1">Welcome back, {firstName || "Traveler"}</h1>
          <p className="text-muted mb-0">Ready to plan your next adventure?</p>
        </div>
        <button
          onClick={handleCreateNewTrip}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <PlusIcon size={18} />
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Upcoming trips section 
      {upcomingTrips.length > 0 && (
        <div className="mb-5">
          <h2 className="h3 mb-4">Your Upcoming Trips</h2>
          <div className="row g-4">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="col-md-6">
                <TripCard trip={trip} type="upcoming" />
              </div>
            ))}
          </div>
        </div>
      )} */}

      <SavedTripsPreview />

      {/* Popular destinations */}
      <div>
        <h2 className="h3 mb-4">Explore Popular Destinations</h2>
        <div className="row g-4">
          <Explore />

          {/* {popularDestinations.map((destination) => (
            <div key={destination.id} className="col-md-6 col-lg-4">
              <TripCard trip={destination} type="destination" />
            </div> 
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;
