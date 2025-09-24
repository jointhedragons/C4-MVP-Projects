import React, { useEffect, useState } from "react";
import axios from "axios";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrips = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4000/api/trips?page=${pageNum}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrips(res.data.trips);
    } catch (err) {
      console.error(err);
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(page);
  }, [page]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">🧳 My Trips</h1>

      {loading && <p className="text-center">Loading trips...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && trips.length === 0 && (
        <p className="text-center">You have no trips planned yet.</p>
      )}

      {/* Trips List */}
      <div className="grid gap-6 md:grid-cols-2">
        {trips.map((trip) => (
          <div
            key={trip._id}
            className="bg-white rounded-lg shadow p-4 border"
          >
            <h2 className="text-lg font-semibold mb-2">
              ✈️ {trip.destination}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(trip.start_date).toLocaleDateString()} →{" "}
              {new Date(trip.end_date).toLocaleDateString()}
            </p>
            {trip.budget && (
              <p className="text-sm mb-2">💰 Budget: ${trip.budget}</p>
            )}

            {/* Hotels */}
            <h3 className="font-bold">🏨 Hotels:</h3>
            <ul className="list-disc list-inside text-sm mb-3">
              {trip.hotels?.map((h) => (
                <li key={h._id}>{h.name}</li>
              ))}
            </ul>

            {/* Itinerary */}
            <h3 className="font-bold">📅 Itinerary:</h3>
            <div className="text-sm">
              {trip.itinerary.map((day, idx) => (
                <div key={idx} className="mb-2">
                  <strong>Day {idx + 1}:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {day.map((act, i) => (
                      <li key={i}>
                        🕑 {act.time} - {act.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Trips;
