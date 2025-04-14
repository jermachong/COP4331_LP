import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Search, Heart, MapPin, Calendar, Users } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";

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
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const formatPrice = (value: string | number) => {
  const n = Number(String(value).replace(/[^0-9.]+/g, ""));
  return isNaN(n) || n === 0 ? value : `$${n.toLocaleString()}`;
};

const SavedTrips: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [search, setSearch] = useState("");
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
            : "http://travelinggenie.com/api";

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

        setSavedTrips(trips);
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

  /**
   * Delete a saved itinerary
   */
  const deleteTrip = async (id: string) => {
    if (!user) return;

    try {
      const API_URL =
        import.meta.env.MODE === "development"
          ? "http://localhost:5000/api"
          : "http://travelinggenie.com/api";

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

  const filtered = savedTrips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="h1 fw-bold mb-2">Saved Trips</h2>
          <p className="text-muted mb-0">Your favourite travel destinations</p>
        </div>
      </div>

      {/* search bar */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Search size={20} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search saved trips…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* grid */}
      {filtered.length > 0 ? (
        <Row className="g-4">
          {filtered.map((trip) => (
            <Col key={trip.id} md={6} lg={4}>
              <div className="card h-100 shadow-sm border-0 hover-shadow transition-all d-flex flex-column">
                <img
                  src={trip.image || FALLBACK_IMG}
                  alt={trip.title}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                />

                <div className="card-body d-flex flex-column flex-grow-1">
                  <h5 className="card-title" title={trip.title}>
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
                      <small>{trip.duration}</small>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <Users size={16} className="me-1" />
                      <small>{trip.groupSize}</small>
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
      ) : (
        <div className="text-center py-5">
          <Heart size={48} className="text-muted mb-3" />
          <h3 className="h4 mb-2">No Saved Trips Yet</h3>
          <p className="text-muted mb-4">
            Start exploring destinations and save your favourite trips.
          </p>
          <Button variant="primary" href="/tripquestionnaire">
            Plan New Trip
          </Button>
        </div>
      )}
    </Container>
  );
};

export default SavedTrips;
