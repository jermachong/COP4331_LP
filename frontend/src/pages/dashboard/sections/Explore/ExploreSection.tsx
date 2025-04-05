import React, { useState } from "react";
import { Search, Filter, MapPin, Calendar, Clock, Users } from "lucide-react";
import { SampleItinerary } from "../../../../types/itinerary";

const ExploreSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const itineraries: SampleItinerary[] = [
    {
      id: 1,
      title: "Tokyo Adventure",
      destination: "Tokyo, Japan",
      duration: "7 days",
      groupSize: "2-4 people",
      description:
        "Experience the perfect blend of traditional culture and modern technology in Japan's vibrant capital.",
      image:
        "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "$2,499",
      rating: 4.9,
      tags: ["Culture", "Food", "Technology", "Shopping"],
    },
    {
      id: 2,
      title: "Greek Island Hopping",
      destination: "Santorini & Mykonos",
      duration: "10 days",
      groupSize: "2-6 people",
      description:
        "Discover the stunning beauty of the Greek islands with this comprehensive island-hopping itinerary.",
      image:
        "https://images.unsplash.com/photo-1688664562000-4c1f7cdb48f8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FudG9yaW5pJTIwZ3JlZWNlfGVufDB8MHwwfHx8MA%3D%3D0",
      price: "$3,299",
      rating: 4.8,
      tags: ["Beach", "Culture", "Romance", "Food"],
    },
    {
      id: 3,
      title: "Bali Wellness Retreat",
      destination: "Bali, Indonesia",
      duration: "8 days",
      groupSize: "1-4 people",
      description:
        "Rejuvenate your mind and body with this wellness-focused journey through Bali's most peaceful spots.",
      image:
        "https://images.unsplash.com/photo-1591206521749-6f6f8ead79c1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJhcmNlbG9uYSUyMHNwYWlufGVufDB8MHwwfHx8MA%3D%3D",
      price: "$1,999",
      rating: 4.7,
      tags: ["Wellness", "Nature", "Culture", "Relaxation"],
    },
  ];

  const filters = [
    { id: "all", label: "All Itineraries" },
    { id: "adventure", label: "Adventure" },
    { id: "culture", label: "Culture" },
    { id: "relaxation", label: "Relaxation" },
    { id: "food", label: "Food & Dining" },
  ];

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="mb-5">
        <h1 className="h2 mb-3">Explore Itineraries</h1>
        <p className="text-muted">
          Discover curated travel plans from around the world
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={20} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search itineraries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="d-flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`btn ${
                  selectedFilter === filter.id
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Itineraries Grid */}
      <div className="row g-4">
        {itineraries.map((itinerary) => (
          <div key={itinerary.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <img
                src={itinerary.image}
                className="card-img-top"
                alt={itinerary.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{itinerary.title}</h5>
                <div className="d-flex align-items-center text-muted mb-2">
                  <MapPin size={16} className="me-1" />
                  <small>{itinerary.destination}</small>
                </div>
                <div className="d-flex gap-3 mb-3">
                  <div className="d-flex align-items-center text-muted">
                    <Calendar size={16} className="me-1" />
                    <small>{itinerary.duration}</small>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <Users size={16} className="me-1" />
                    <small>{itinerary.groupSize}</small>
                  </div>
                </div>
                <p className="card-text text-muted small mb-3">
                  {itinerary.description}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    {itinerary.tags.map((tag) => (
                      <span key={tag} className="badge bg-light text-dark">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-end">
                    <div className="h5 mb-0">{itinerary.price}</div>
                    <div className="d-flex align-items-center">
                      <span className="text-warning me-1">★</span>
                      <small>{itinerary.rating}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSection;
