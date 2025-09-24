import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const limit = 5;

  const fetchTrips = async (pageNum = 1, newTrip = null) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4000/api/trips?page=${pageNum}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { trips: fetchedTrips = [], count = 0 } = res.data;
      const finalTrips = newTrip ? [newTrip, ...fetchedTrips] : fetchedTrips;
      setTrips(finalTrips);
      setTotalPages(Math.max(1, Math.ceil(count / limit)));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  // تحميل الرحلات عند تغيير الصفحة أو عند وجود newTrip
  useEffect(() => {
    fetchTrips(page, location.state?.newTrip || null);
  }, [page, location.state?.newTrip]);

  return (
    <div className="max-w-8xl mx-auto p-6 min-h-screen bg-gradient-to-br ">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r text-black bg-clip-text mb-3">
          My Travel Adventures
        </h1>
        <p className="text-orange-700/80">
          Manage and view all your sunny trip plans
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm animate-pulse rounded-2xl p-6 h-64 shadow-lg border border-orange-100"
            >
              <div className="h-6 bg-orange-200 rounded mb-4"></div>
              <div className="h-4 bg-orange-200 rounded mb-2"></div>
              <div className="h-4 bg-orange-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-orange-200 rounded mb-2"></div>
              <div className="h-4 bg-orange-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-orange-700 font-medium">⚠️ {error}</p>
          <button
            onClick={() => fetchTrips(page, location.state?.newTrip || null)}
            className="mt-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && trips.length === 0 && !error && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-orange-700 mb-2">
            No trips planned yet
          </h3>
          <p className="text-orange-600/80 mb-6">
            Start planning your next sunny adventure!
          </p>
          <button
            onClick={() => navigate("/tripplanner")}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl hover:from-orange-500 hover:to-yellow-500 transition shadow-lg hover:shadow-orange-200"
          >
            Create Your First Trip
          </button>
        </div>
      )}

      {/* Trips Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {trips.map((trip) => (
          <div
            key={trip._id}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100 hover:border-orange-200"
          >
            {/* Trip Header */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-t-2xl p-4 text-white">
              <h2 className="text-xl font-bold truncate">
                ✈️ {trip.destination}
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                {new Date(trip.start_date).toLocaleDateString()} -{" "}
                {new Date(trip.end_date).toLocaleDateString()}
              </p>
            </div>

            <div className="p-5">
              {/* Budget */}
              {trip.budget && (
                <div className="flex items-center mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <span className="text-2xl">💰</span>
                  <div className="ml-3">
                    <p className="text-sm text-orange-700">Budget</p>
                    <p className="font-semibold text-orange-600">
                      ${trip.budget}
                    </p>
                  </div>
                </div>
              )}

              {/* Hotels Section */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">🏨</span>
                  <h3 className="font-semibold text-orange-700">Hotels</h3>
                </div>
                {trip.hotels?.length > 0 ? (
                  <div className="space-y-2">
                    {trip.hotels.slice(0, 2).map((h) => (
                      <div
                        key={h._id}
                        className="flex items-center text-sm bg-orange-50 p-2 rounded-lg border border-orange-100"
                      >
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                        <span className="truncate text-orange-800">{h.name}</span>
                      </div>
                    ))}
                    {trip.hotels.length > 2 && (
                      <p className="text-xs text-orange-600 text-center">
                        +{trip.hotels.length - 2} more hotels
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-orange-400 bg-orange-50 p-2 rounded-lg text-center border border-orange-100">
                    No hotels added
                  </p>
                )}
              </div>

              {/* Itinerary Section */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">📅</span>
                  <h3 className="font-semibold text-orange-700">Itinerary</h3>
                </div>
                {trip.itinerary?.length > 0 ? (
                  <div className="space-y-3">
                    {trip.itinerary.slice(0, 2).map((day, idx) => (
                      <div
                        key={idx}
                        className="bg-yellow-50 p-3 rounded-lg border border-yellow-100"
                      >
                        <div className="flex items-center mb-1">
                          <span className="w-6 h-6 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center mr-2">
                            {idx + 1}
                          </span>
                          <strong className="text-sm text-orange-700">
                            Day {idx + 1}
                          </strong>
                        </div>
                        <ul className="text-xs space-y-1">
                          {day.slice(0, 2).map((act, i) => (
                            <li
                              key={i}
                              className="flex items-center text-orange-800"
                            >
                              <span className="text-yellow-500 mr-1">⏰</span>
                              {act.time} - {act.name}
                            </li>
                          ))}
                          {day.length > 2 && (
                            <li className="text-orange-600 text-center">
                              +{day.length - 2} more activities
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                    {trip.itinerary.length > 2 && (
                      <p className="text-xs text-orange-600 text-center">
                        +{trip.itinerary.length - 2} more days
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-orange-400 bg-orange-50 p-2 rounded-lg text-center border border-orange-100">
                    No itinerary available
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && trips.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-6 py-3 bg-white border border-orange-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition shadow-lg flex items-center gap-2 text-orange-700 hover:text-orange-800"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-orange-200">
            <span className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {page}
            </span>
            <span className="font-medium text-orange-700">
              Page {page} of {totalPages}
            </span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3 bg-white border border-orange-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition shadow-lg flex items-center gap-2 text-orange-700 hover:text-orange-800"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Trips;
