import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Heart, MapPin, Calendar, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  image: string;
  duration: string;
  groupSize: string;
  price: string | number;
  tags: string[];
  description: string;
  raw: any;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyaXN8ZW58MHwwfDB8fHww";

const formatPrice = (value: string | number) => {
  const n = Number(String(value).replace(/[^0-9.]+/g, ""));
  return isNaN(n) || n === 0 ? value : `$${n.toLocaleString()}`;
};

const SavedTripsPreview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch the user's saved itineraries once on mount
   */
  useEffect(() => {
    const fetchSavedTrips = async () => {
      if (!user || isNaN(Number(user.userId))) {
        setError("Please log in to view saved trips.");
        setLoading(false);
        return;
      }

      try {
        const API_URL =
          import.meta.env.MODE === "development"
            ? "http://localhost:5000/api"
            : "https://travelinggenie.com/api";

        const res = await fetch(`${API_URL}/searchItinerary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: Number(user.userId),
            jwtToken: user.token,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch saved trips");

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const trips: SavedTrip[] = data.Itineraries.map((it: any) => {
          // prefer backend price if already formatted / numeric
          const rawPrice = it.Itinerary.price ?? "";
          const numericPrice = Number(
            String(rawPrice).replace(/[^0-9.]+/g, "")
          );

          return {
            id: it.ItineraryId,
            title: it.Itinerary.title,
            destination: it.Itinerary.destination,
            image: it.Itinerary.image?.trim() || FALLBACK_IMG,
            duration: it.Itinerary.duration,
            groupSize: it.Itinerary.groupSize,
            price:
              isNaN(numericPrice) || numericPrice === 0
                ? rawPrice
                : numericPrice,
            tags: it.Itinerary.tags ?? [],
            description: it.Itinerary.description ?? "",
            raw: it.Itinerary,
          };
        });

        const limited = trips.slice(0, 3);
        setSavedTrips(limited);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTrips();
  }, [user]);

  /**
   * Navigate to the detailed itinerary page
   * Pass `isSaved` so the page can hide its Save‑button.
   */
  const openItinerary = (trip: SavedTrip) => {
    navigate("/itinerary", { state: { tripData: trip.raw, isSaved: true } });
  };

  const deleteTrip = async (id: string) => {
    if (!user) return;

    try {
      const API_URL =
        import.meta.env.MODE === "development"
          ? "http://localhost:5000/api"
          : "https://travelinggenie.com/api";

      const res = await fetch(`${API_URL}/deleteItinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          itineraryId: id,
          jwtToken: user.token,
        }),
      });

      if (!res.ok) throw new Error("Failed to delete trip");

      setSavedTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    }
  };

  if (loading) {
    return (
      <div className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="h4 mb-0">Recently Saved Trips</h3>
          <Button variant="primary" onClick={() => navigate("/saved")}>
            View All Saved Trips
          </Button>
        </div>
        <Row className="g-4">
          {savedTrips.map((trip) => (
            <Col key={trip.id} md={6} lg={4}>
              <div className="card h-100 shadow-sm border-0 hover-shadow transition-all d-flex flex-column">
                <img
                  src={trip.image || FALLBACK_IMG}
                  alt={trip.title}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                />

                <div className="card-body d-flex flex-column flex-grow-1">
                  <h5 className="card-title text-truncate" title={trip.title}>
                    {trip.title}
                  </h5>

                  <div className="d-flex align-items-center text-muted mb-2">
                    <MapPin size={16} className="me-1" />
                    <small
                      className="text-truncate"
                      style={{ maxWidth: "80%" }}
                    >
                      {trip.destination}
                    </small>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <div className="d-flex align-items-center text-muted">
                      <Calendar size={16} className="me-1" />
                      <small>{trip.duration} days </small>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <Users size={16} className="me-1" />
                      <small>{trip.groupSize} travelers </small>
                    </div>
                  </div>

                  <p
                    className="card-text text-muted small mb-3 flex-grow-1 mt-auto"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {trip.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2 overflow-auto">
                      {trip.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="badge bg-light text-dark text-truncate"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-end">
                      <div className="h5 mb-0">{formatPrice(trip.price)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-3 pb-3 d-flex gap-2">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => openItinerary(trip)}
                  >
                    View Itinerary
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => deleteTrip(trip.id)}
                  >
                    <Heart size={18} fill="currentColor" />
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  if (savedTrips.length === 0) {
    return (
      <>
        <p className="text-muted">No saved trips yet.</p>
      </>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="h4 mb-0">Recently Saved Trips</h3>
        <Button variant="primary" onClick={() => navigate("/saved")}>
          View All Saved Trips
        </Button>
      </div>
      <Row className="g-4">
        {savedTrips.map((trip) => (
          <Col key={trip.id} md={6} lg={4}>
            <div className="card h-100 shadow-sm border-0 hover-shadow transition-all d-flex flex-column">
              <img
                src={trip.image || FALLBACK_IMG}
                alt={trip.title}
                style={{ height: "200px", objectFit: "cover" }}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
              />

              <div className="card-body d-flex flex-column flex-grow-1">
                <h5 className="card-title text-truncate" title={trip.title}>
                  {trip.title}
                </h5>

                <div className="d-flex align-items-center text-muted mb-2">
                  <MapPin size={16} className="me-1" />
                  <small className="text-truncate" style={{ maxWidth: "80%" }}>
                    {trip.destination}
                  </small>
                </div>

                <div className="d-flex gap-3 mb-3">
                  <div className="d-flex align-items-center text-muted">
                    <Calendar size={16} className="me-1" />
                    <small>{trip.duration} days </small>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <Users size={16} className="me-1" />
                    <small>{trip.groupSize} travelers </small>
                  </div>
                </div>

                <p
                  className="card-text text-muted small mb-3 flex-grow-1 mt-auto"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {trip.description}
                </p>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2 overflow-auto">
                    {trip.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="badge bg-light text-dark text-truncate"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-end">
                    <div className="h5 mb-0">{formatPrice(trip.price)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-auto px-3 pb-3 d-flex gap-2">
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => openItinerary(trip)}
                >
                  View Itinerary
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => deleteTrip(trip.id)}
                >
                  <Heart size={18} fill="currentColor" />
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedTripsPreview;
