import React, { useState } from "react";

const TripPlanner = () => {
  const [form, setForm] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    budget: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // عشان auth middleware
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Something went wrong");
      const data = await res.json();
      setTrip(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Plan Your Trip</h1>

      {/* Trip Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 bg-white shadow-md p-4 rounded"
      >
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={form.budget}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="interests"
          placeholder="Interests (comma separated)"
          value={form.interests}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Planning..." : "Generate Trip"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Trip Results */}
      {trip && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">
            Trip to {trip.destination}
          </h2>

          {/* Hotels */}
          <h3 className="font-semibold mt-4">Suggested Hotels:</h3>
          <ul className="list-disc ml-6">
            {trip.hotels.map((hotel) => (
              <li key={hotel._id}>{hotel.name}</li>
            ))}
          </ul>

          {/* Itinerary */}
          <h3 className="font-semibold mt-4">Itinerary:</h3>
          {trip.itinerary.map((day, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="underline">Day {idx + 1}</h4>
              <ul className="list-disc ml-6">
                {day.map((act, i) => (
                  <li key={i}>
                    <strong>{act.time}</strong> – {act.name} ({act.description})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
