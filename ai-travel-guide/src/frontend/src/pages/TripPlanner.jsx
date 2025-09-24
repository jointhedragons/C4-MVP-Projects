

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const TripPlanner = () => {
  const [form, setForm] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    budget: "",
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const destinations = [
    "New York",
    "Paris",
    "Tokyo",
    "Cairo",
    "Alexandria",
    "Luxor",
    "Aswan",
    "Giza",
    "Hurghada",
    "Sharm El Sheikh",
    "Dubai",
    "Istanbul",
    "Rome",
    "Barcelona",
    "London",
  ];

  const budgets = [
    { label: "Low", value: 1000 },
    { label: "Medium", value: 2500 },
    { label: "High", value: 5000 },
  ];
  const activities = [
    "Beaches",
    "City sightseeing",
    "Outdoor adventures",
    "Festivals/events",
    "Food exploration",
    "Nightlife",
    "Shopping",
    "Spa wellness",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleInterest = (act) => {
    setForm((prev) => {
      const exists = prev.interests.includes(act);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((a) => a !== act)
          : [...prev.interests, act],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        destination: form.destination,
        start_date: form.start_date,
        end_date: form.end_date,
        budget: form.budget,
        interests: form.interests,
      };

      const res = await fetch("http://localhost:4000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Something went wrong");
      const data = await res.json();
      setTrip(data.plan);
      const existingTrips = JSON.parse(localStorage.getItem("trips")) || [];
    localStorage.setItem("trips", JSON.stringify([...existingTrips, data.plan]));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Tell us your travel preferences
      </h1>
      <p className="text-gray-500 mb-8">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Destination */}
        <div>
          <label className="block font-semibold mb-2">
            What is your destination of choice?
          </label>
          <select
            name="destination"
            value={form.destination}
            onChange={handleChange}
            className="w-full border rounded p-3"
            required
          >
            <option value="">Select Destination</option>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div>
          <label className="block font-semibold mb-2">
            When are you planning to travel?
          </label>
          <div className="flex gap-4">
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="border p-3 rounded w-1/2"
              required
            />
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="border p-3 rounded w-1/2"
              required
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block font-semibold mb-2">What is your Budget?</label>
          <p className="text-gray-500 mb-3">
            The budget is exclusively allocated for activities and dining purposes.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {budgets.map((b) => (
              <div
                key={b.label}
                className={`p-4 border rounded cursor-pointer text-center ${
                  form.budget === b.value ? "border-blue-600 bg-blue-50" : ""
                }`}
                onClick={() => setForm({ ...form, budget: b.value })}
              >
                <p className="font-bold">{b.label}</p>
                <p className="text-sm text-gray-500">
                  {b.label === "High" ? "2500+ USD" : `0 - ${b.value} USD`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div>
          <label className="block font-semibold mb-2">
            Which activities are you interested in?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activities.map((act) => (
              <div
                key={act}
                className={`p-3 border rounded cursor-pointer text-center ${
                  form.interests.includes(act)
                    ? "border-blue-600 bg-blue-50"
                    : ""
                }`}
                onClick={() => toggleInterest(act)}
              >
                {act}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-3 px-6 rounded hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? "Planning..." : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Show Trip Results */}
      {trip && (
        <div className="mt-10 space-y-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            Your Trip to {form.destination}
          </h2>

          {/* Hotels */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              🏨 Suggested Hotels
            </h3>
            <ul className="space-y-2">
              {trip.recommendations.hotels.map((hotel, index) => (
                <li
                  key={index}
                  className="p-3 border rounded bg-gray-50 hover:shadow-md"
                >
                  {hotel.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              🎉 Suggested Activities
            </h3>
            <ul className="space-y-2">
              {trip.recommendations.activities.map((act, index) => (
                <li
                  key={index}
                  className="p-3 border rounded bg-gray-50 hover:shadow-md"
                >
                  {act.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Itinerary */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              📅 Daily Itinerary
            </h3>
            {trip.recommendations.daily_itinerary.map((day, idx) => (
              <div
                key={idx}
                className="mb-4 p-4 border rounded bg-blue-50 shadow-sm"
              >
                <h4 className="font-medium text-lg text-blue-700 mb-2">
                  Day {day.day}: {day.theme}
                </h4>
                <ul className="list-disc ml-6 space-y-1">
                  {day.activities.map((act, i) => (
                    <li key={i} className="text-gray-700">
                      {act.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const TripPlanner = () => {
//   const [form, setForm] = useState({
//     destination: "",
//     start_date: "",
//     end_date: "",
//     budget: "",
//     interests: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [trip, setTrip] = useState(null);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const destinations = [
//     "New York", "Paris", "Tokyo", "Cairo", "Alexandria", 
//     "Luxor", "Aswan", "Giza", "Hurghada", "Sharm El Sheikh", 
//     "Dubai", "Istanbul", "Rome", "Barcelona", "London"
//   ];

//   const budgets = [
//     { label: "Low", value: 1000 },
//     { label: "Medium", value: 2500 },
//     { label: "High", value: 5000 },
//   ];

//   const activities = [
//     "Beaches", "City sightseeing", "Outdoor adventures", "Festivals/events",
//     "Food exploration", "Nightlife", "Shopping", "Spa wellness",
//   ];

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const toggleInterest = (act) => {
//     setForm((prev) => {
//       const exists = prev.interests.includes(act);
//       return {
//         ...prev,
//         interests: exists
//           ? prev.interests.filter((a) => a !== act)
//           : [...prev.interests, act],
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const payload = {
//         destination: form.destination,
//         start_date: form.start_date,
//         end_date: form.end_date,
//         budget: form.budget,
//         interests: form.interests,
//       };

//       const res = await fetch("http://localhost:4000/api/trips", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Something went wrong");
//       const data = await res.json();
//       setTrip(data.plan);
//       const existingTrips = JSON.parse(localStorage.getItem("trips")) || [];
//       localStorage.setItem("trips", JSON.stringify([...existingTrips, data.plan]));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-3">
//             🌴 Plan Your Perfect Trip
//           </h1>
//           <p className="text-orange-700/80 text-lg">
//             Just provide some basic information, and our trip planner will generate
//             a customized itinerary based on your preferences.
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-orange-100">
//           {/* Destination */}
//           <div>
//             <label className="block font-semibold mb-3 text-orange-700 text-lg">
//               ✈️ What is your destination of choice?
//             </label>
//             <select
//               name="destination"
//               value={form.destination}
//               onChange={handleChange}
//               className="w-full border-2 border-orange-200 rounded-xl p-4 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
//               required
//             >
//               <option value="">Select Destination</option>
//               {destinations.map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Dates */}
//           <div>
//             <label className="block font-semibold mb-3 text-orange-700 text-lg">
//               📅 When are you planning to travel?
//             </label>
//             <div className="flex gap-4">
//               <input
//                 type="date"
//                 name="start_date"
//                 value={form.start_date}
//                 onChange={handleChange}
//                 className="border-2 border-orange-200 p-4 rounded-xl w-1/2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
//                 required
//               />
//               <input
//                 type="date"
//                 name="end_date"
//                 value={form.end_date}
//                 onChange={handleChange}
//                 className="border-2 border-orange-200 p-4 rounded-xl w-1/2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
//                 required
//               />
//             </div>
//           </div>

//           {/* Budget */}
//           <div>
//             <label className="block font-semibold mb-3 text-orange-700 text-lg">
//               💰 What is your Budget?
//             </label>
//             <p className="text-orange-600/80 mb-4">
//               The budget is exclusively allocated for activities and dining purposes.
//             </p>
//             <div className="grid grid-cols-3 gap-4">
//               {budgets.map((b) => (
//                 <div
//                   key={b.label}
//                   className={`p-5 border-2 rounded-2xl cursor-pointer text-center transition-all duration-300 transform hover:scale-105 ${
//                     form.budget === b.value 
//                       ? "border-orange-400 bg-gradient-to-r from-orange-100 to-yellow-100 shadow-lg" 
//                       : "border-orange-200 hover:border-orange-300"
//                   }`}
//                   onClick={() => setForm({ ...form, budget: b.value })}
//                 >
//                   <p className="font-bold text-orange-700">{b.label}</p>
//                   <p className="text-sm text-orange-600">
//                     {b.label === "High" ? "2500+ USD" : `0 - ${b.value} USD`}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Activities */}
//           <div>
//             <label className="block font-semibold mb-3 text-orange-700 text-lg">
//               🎯 Which activities are you interested in?
//             </label>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {activities.map((act) => (
//                 <div
//                   key={act}
//                   className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all duration-200 ${
//                     form.interests.includes(act)
//                       ? "border-orange-400 bg-gradient-to-r from-orange-100 to-yellow-100 shadow-md"
//                       : "border-orange-200 hover:border-orange-300 hover:bg-orange-50"
//                   }`}
//                   onClick={() => toggleInterest(act)}
//                 >
//                   <span className="text-orange-800 font-medium">{act}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="text-center pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-4 px-12 rounded-2xl font-semibold text-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Planning Your Trip...
//                 </span>
//               ) : (
//                 "✨ Generate My Trip Plan"
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Error Message */}
//         {error && (
//           <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
//             <p className="text-red-600 font-medium">⚠️ {error}</p>
//           </div>
//         )}

//         {/* Show Trip Results */}
//         {trip && (
//           <div className="mt-10 space-y-8 animate-fade-in">
//             <div className="text-center">
//               <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-3">
//                 🌟 Your Perfect Trip to {form.destination}
//               </h2>
//               <p className="text-orange-600/80">Here's your personalized itinerary</p>
//             </div>

//             {/* Hotels */}
//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-7 shadow-lg border border-orange-100">
//               <h3 className="text-2xl font-bold mb-5 text-orange-700 flex items-center gap-3">
//                 <span className="text-3xl">🏨</span>
//                 Recommended Hotels
//               </h3>
//               <div className="grid gap-4 md:grid-cols-2">
//                 {trip.recommendations.hotels.map((hotel, index) => (
//                   <div
//                     key={index}
//                     className="p-4 border-2 border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 hover:shadow-md transition"
//                   >
//                     <p className="font-semibold text-orange-800">{hotel.name}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Activities */}
//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-7 shadow-lg border border-orange-100">
//               <h3 className="text-2xl font-bold mb-5 text-orange-700 flex items-center gap-3">
//                 <span className="text-3xl">🎉</span>
//                 Recommended Activities
//               </h3>
//               <div className="grid gap-4 md:grid-cols-2">
//                 {trip.recommendations.activities.map((act, index) => (
//                   <div
//                     key={index}
//                     className="p-4 border-2 border-yellow-200 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 hover:shadow-md transition"
//                   >
//                     <p className="font-semibold text-orange-800">{act.name}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Daily Itinerary */}
//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-7 shadow-lg border border-orange-100">
//               <h3 className="text-2xl font-bold mb-5 text-orange-700 flex items-center gap-3">
//                 <span className="text-3xl">📅</span>
//                 Daily Itinerary
//               </h3>
//               <div className="space-y-5">
//                 {trip.recommendations.daily_itinerary.map((day, idx) => (
//                   <div
//                     key={idx}
//                     className="p-5 border-2 border-orange-200 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 hover:shadow-lg transition"
//                   >
//                     <h4 className="font-bold text-xl text-orange-700 mb-3 flex items-center gap-2">
//                       <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">
//                         {day.day}
//                       </span>
//                       Day {day.day}: {day.theme}
//                     </h4>
//                     <ul className="space-y-2">
//                       {day.activities.map((act, i) => (
//                         <li key={i} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
//                           <span className="text-yellow-500">⏰</span>
//                           <span className="text-orange-800">{act.name}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 justify-center pt-6">
//               <button
//                 onClick={() => navigate('/trips')}
//                 className="px-8 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl hover:from-orange-500 hover:to-yellow-500 transition shadow-lg"
//               >
//                 View All Trips
//               </button>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="px-8 py-3 bg-white border border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50 transition"
//               >
//                 Plan Another Trip
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TripPlanner;