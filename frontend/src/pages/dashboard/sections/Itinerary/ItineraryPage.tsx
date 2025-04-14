import { useLocation } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import {
  Calendar as CalendarIcon,
  Users as UsersIcon,
  MapPin,
  CircleDollarSign,
  Heart,
} from "lucide-react";
import "./ItineraryPage.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyaXN8ZW58MHwwfDB8fHww";

interface Activity {
  time: string;
  activity: string;
  location: string;
  details: string;
  cost: string | number;
  tags?: string;
}

interface Day {
  day: number;
  activities: Activity[];
}

const formatPrice = (value: number | string) => {
  const n = Number(String(value).replace(/[^0-9.]+/g, ""));
  return isNaN(n) ? value : `$${n.toLocaleString()}`;
};

const ItineraryPage: React.FC = () => {
  const { state } = useLocation();
  const itinerary = state?.tripData;
  const isSaved = state?.isSaved === true;

  if (!itinerary) {
    return <div className="container py-5">No itinerary data found.</div>;
  }

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "http://travelinggenie.com/api";

  const handleSaveTrip = async () => {
    try {
      // get user id
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId;
      const jwtToken = JSON.parse(localStorage.getItem("jwtToken") || '""');

      // send to backend
      const response = await fetch(`${API_URL}/addItinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, itinerary, jwtToken }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Itinerary saved successfully:", data);
        alert("Itinerary saved successfully!");
      } else {
        console.error(data.error);
        alert(data.error || "Unable to save itinerary.");
      }
    } catch (error) {
      console.error("Error saving itinerary:", error);
      alert("Error saving itinerary. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="itinerary-header row g-4 mb-4">
        <div className="col-md-6">
          <img
            src={itinerary.image?.trim() || FALLBACK_IMG}
            alt={itinerary.title}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="itinerary-title mb-3">{itinerary.title}</h1>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <div className="d-flex align-items-center me-3">
              <MapPin size={16} className="me-1" />
              <span className="text-muted">{itinerary.destination}</span>
            </div>
            <div className="d-flex align-items-center me-3">
              <CalendarIcon size={16} className="me-1" />
              <span className="text-muted">{itinerary.duration} days</span>
            </div>
            <div className="d-flex align-items-center me-3">
              <UsersIcon size={16} className="me-1" />
              <span className="text-muted">{itinerary.groupSize} travelers</span>
            </div>
            <div className="d-flex align-items-center me-3">
              <CircleDollarSign size={16} className="me-1" />
              <span className="text-muted">{formatPrice(itinerary.price)}</span>
            </div>
          </div>
          <p className="text-muted">{itinerary.description}</p>

          {itinerary.tags && (
            <div className="tags-container mb-3">
              {itinerary.tags.map((tag: string, index: number) => (
                <span key={index} className="tags">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {!isSaved && (
            <Button
              variant="primary"
              className="w-100"
              onClick={handleSaveTrip}
            >
              <Heart className="me-1" size={16} /> Save Itinerary
            </Button>
          )}
        </div>
      </div>

      {/* Daily Breakdown Section */}
      <Container className="py-4">
        <h3 className="mb-4">Daily Breakdown</h3>
        {itinerary.dailyBreakdown.map((dayObj: Day, index: number) => (
          <div key={index} className="mb-4">
            <h4 className="day-header mb-3">Day {dayObj.day}</h4>
            <div className="itinerary">
              {dayObj.activities.map((activity: Activity, i: number) => (
                <div
                  key={i}
                  id={`day-${dayObj.day}`}
                  className="itinerary-activity mb-3"
                >
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-content">
                    <div className="activity-name fw-semibold">
                      {activity.activity}
                    </div>
                    <em>{activity.location}</em>
                    <br />
                    <span>{activity.details}</span>
                    <hr className="activity-divider my-2" />
                    <span className="cost">
                      <strong>Cost:</strong> {formatPrice(activity.cost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default ItineraryPage;
