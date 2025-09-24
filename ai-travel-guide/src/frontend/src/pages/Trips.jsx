import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTrips, setTotalTrips] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const limit = 6;

  const fetchTrips = useCallback(
    async (pageNum = 1, newTrip = null) => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:4000/api/trips?page=${pageNum}&limit=${limit}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // backend might return { count, trips } or { total, trips } or other shapes
        const fetchedTrips = res.data?.trips ?? [];
        const countFromCount = typeof res.data?.count === "number" ? res.data.count : null;
        const countFromTotal = typeof res.data?.total === "number" ? res.data.total : null;
        const countFromTotalTrips = typeof res.data?.totalTrips === "number" ? res.data.totalTrips : null;
        const totalCount = countFromCount ?? countFromTotal ?? countFromTotalTrips ?? fetchedTrips.length;

        const finalTrips = newTrip ? [newTrip, ...fetchedTrips] : fetchedTrips;

        setTrips(finalTrips);
        setTotalTrips(totalCount);

        const pages = Math.max(1, Math.ceil(totalCount / limit));
        setTotalPages(pages);

        // if requested pageNum is out of range, correct it (this will trigger useEffect to refetch)
        if (pageNum > pages) {
          setPage(pages);
        }
      } catch (err) {
        // Show backend-provided message if exists (e.g. "total is not defined")
        const backendMessage = err.response?.data?.message;
        if (backendMessage) {
          setError(backendMessage);
        } else {
          setError(err.message || "Failed to load trips");
        }

        // fallback: if error occurred but we have partial data, try to show that
        const fallbackTrips = err.response?.data?.trips ?? [];
        if (Array.isArray(fallbackTrips) && fallbackTrips.length > 0) {
          setTrips(fallbackTrips);
          setTotalTrips(fallbackTrips.length);
          setTotalPages(Math.max(1, Math.ceil(fallbackTrips.length / limit)));
        }
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Load trips on page change or when a newTrip is supplied via location.state
  useEffect(() => {
    if (location.state?.newTrip) {
      fetchTrips(page, location.state.newTrip);
      // remove newTrip from history state so it won't duplicate on next render
      navigate(location.pathname, { replace: true });
    } else {
      fetchTrips(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="max-w-8xl mx-auto p-6 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-black mb-2">My Travel Adventures</h1>
        <p className="text-orange-700/80 mb-2">Manage and view all your sunny trip plans</p>

      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 animate-pulse rounded-2xl p-6 h-64 shadow-lg border border-orange-100"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-orange-700 font-medium">⚠️ {error}</p>
          <button
            onClick={() => fetchTrips(page)}
            className="mt-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && trips.length === 0 && !error && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-orange-700 mb-2">No trips planned yet</h3>
          <p className="text-orange-600/80 mb-6">Start planning your next sunny adventure!</p>
          <button
            onClick={() => navigate("/tripplanner")}
            className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-400 text-white rounded-xl hover:from-orange-500 hover:to-yellow-500 transition shadow-lg"
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
            className="group bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100"
          >
            <div className="rounded-t-2xl p-4 text-black">
              <h2 className="text-xl font-bold truncate">✈️ {trip.destination}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : "—"} -{" "}
                {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : "—"}
              </p>
            </div>

            <div className="p-5">
              {/* Budget */}
              {trip.budget ? (
                <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="ml-3">
                    <p className="text-sm text-black">Budget</p>
                    <p className="font-semibold text-amber-500">${Number(trip.budget).toLocaleString()}</p>
                  </div>
                </div>
              ) : null}

              {/* Hotels */}
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Hotels</h3>
                {Array.isArray(trip.hotels) && trip.hotels.length > 0 ? (
                  <div className="space-y-2">
                    {trip.hotels.slice(0, 2).map((h) => (
                      <div key={h._id || h} className="flex items-center text-sm bg-gray-50 p-2 rounded-lg border border-orange-100">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                        <span className="truncate text-orange-800">{h.name ?? h}</span>
                      </div>
                    ))}
                    {trip.hotels.length > 2 && <p className="text-xs text-orange-600 text-center">+{trip.hotels.length - 2} more hotels</p>}
                  </div>
                ) : (
                  <p className="text-sm text-orange-400 bg-gray-50 p-2 rounded-lg text-center border border-orange-100">No hotels added</p>
                )}
              </div>

              {/* Itinerary */}
              {Array.isArray(trip.itinerary) && trip.itinerary.length > 0 ? (
                <div className="space-y-3">
                  {trip.itinerary.slice(0, 2).map((day, idx) => (
                    <div key={day._id || `day-${day.day || idx}`} className="bg-gray-50 p-3 rounded-lg border border-yellow-100">
                      <div className="flex items-center mb-1">
                        <span className="w-6 h-6 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center mr-2">
                          {day.day || idx + 1}
                        </span>
                        <strong className="text-sm text-amber-500">Day {day.day || idx + 1}</strong>
                      </div>

                      <ul className="text-xs space-y-1">
                        {Array.isArray(day.activities) && day.activities.slice(0, 2).map((act, i) => (
                          <li key={act._id || `act-${i}`} className="flex items-center text-amber-500">
                            <span className="text-yellow-500 mr-1">⏰</span>
                            {act.time ? `${act.time} - ` : ""}
                            {act.activity?.name ?? (act.activity ? act.activity : "Unknown activity")}
                          </li>
                        ))}

                        {Array.isArray(day.activities) && day.activities.length > 2 && (
                          <li className="text-amber-500 text-center">+{day.activities.length - 2} more activities</li>
                        )}
                      </ul>
                    </div>
                  ))}

                  {trip.itinerary.length > 2 && <p className="text-xs text-amber-500 text-center">+{trip.itinerary.length - 2} more days</p>}
                </div>
              ) : (
                <p className="text-sm text-amber-500 bg-orange-50 p-2 rounded-lg text-center border border-orange-100">No itinerary available</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && trips.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-6 py-3 bg-white border border-orange-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition shadow-lg text-orange-700"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-orange-200">
            <span className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {page}
            </span>
            <span className="font-medium text-orange-700">Page {page} of {totalPages}</span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-6 py-3 bg-white border border-orange-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition shadow-lg text-orange-700"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Trips;
