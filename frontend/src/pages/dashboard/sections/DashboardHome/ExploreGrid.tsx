import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Explore from "../../../../components/Explore";
import SavedTripsPreview from "../../../../components/SavedTripsPreview";

const ExploreSection: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "http://travelinggenie.com:5000/api";

  useEffect(() => {
    // get user data from the backend
    const getUserData = async () => {
      try {
        // get user id
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("Local user:", user);
        const userId = user.userId;

        // send to backend
        const response = await fetch(`${API_URL}/get-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleCreateNewTrip = () => {
    navigate("/tripQuestionnaire");
  };

  return (
    <div className="container py-4">
      {/* Welcome section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h2 mb-1">
            Welcome back, {userData.firstName || "Traveler"}
          </h1>
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
