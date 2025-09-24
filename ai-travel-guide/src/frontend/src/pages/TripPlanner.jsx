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
//     "New York","Paris","Tokyo","Cairo","Alexandria","Luxor","Aswan","Giza",
//     "Hurghada","Sharm El Sheikh","Dubai","Istanbul","Rome","Barcelona","London",
//   ];

//   const budgets = [
//     { label: "Low", value: 1000 },
//     { label: "Medium", value: 2500 },
//     { label: "High", value: 5000 },
//   ];

//   const activities = [
//     "Beaches","City sightseeing","Outdoor adventures","Festivals/events",
//     "Food exploration","Nightlife","Shopping","Spa wellness",
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

//   const safeParse = (s) => {
//     try {
//       return JSON.parse(s);
//     } catch {
//       return null;
//     }
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

//       // محاولة قراءة رسالة الخطأ من الباك إذا في
//       const resText = await res.text();
//       let resJson = null;
//       try { resJson = resText ? JSON.parse(resText) : null; } catch { resJson = null; }

//       if (!res.ok) {
//         const msg = (resJson && resJson.message) ? resJson.message : `Request failed (${res.status})`;
//         throw new Error(msg);
//       }

//       // الباك ممكن يرجع { plan: {...} } أو يرجع الخطة مباشرة
//       const data = resJson ?? {};
//       const plan = data.plan ?? data; // لو الباك رجع data.plan استخدمه، وإلا استخدم data نفسه
//       setTrip(plan);

//       // حفظ في localStorage بأمان
//       const existing = safeParse(localStorage.getItem("trips")) || [];
//       if (Array.isArray(existing)) {
//         localStorage.setItem("trips", JSON.stringify([...existing, plan]));
//       } else {
//         localStorage.setItem("trips", JSON.stringify([plan]));
//       }
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // مساعد: جاب الـ activities من recommendations بشكل آمن
//   const recActivities = (trip?.recommendations?.activities) ?? [];

//   // دالة آمنة لبحث النشاط الكامل حسب id (تتعامل مع a.id أو a._id أو a)
//   const findFullActivity = (actRef) => {
//     if (!actRef) return null;
//     const refId = (actRef.activity ?? actRef.id ?? actRef).toString?.() ?? `${actRef}`;
//     return recActivities.find((a) => {
//       const aId = (a?.id ?? (a?._id ? a._id.toString() : null) ?? a).toString?.() ?? `${a}`;
//       return aId === refId;
//     }) ?? null;
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold mb-2 text-gray-800">
//         Tell us your travel preferences
//       </h1>
//       <p className="text-gray-600 mb-8">
//         Just provide some basic information, and our trip planner will generate
//         a customized itinerary based on your preferences.
//       </p>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-10">
//         {/* Destination */}
//         <div>
//           <label className="block font-semibold mb-2 text-gray-700">
//             What is your destination of choice?
//           </label>
//           <select
//             name="destination"
//             value={form.destination}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
//             required
//           >
//             <option value="">Select Destination</option>
//             {destinations.map((d) => (
//               <option key={d} value={d}>{d}</option>
//             ))}
//           </select>
//         </div>

//         {/* Dates */}
//         <div>
//           <label className="block font-semibold mb-2 text-gray-700">
//             When are you planning to travel?
//           </label>
//           <div className="flex gap-4">
//             <input
//               type="date"
//               name="start_date"
//               value={form.start_date}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-3 w-1/2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
//               required
//             />
//             <input
//               type="date"
//               name="end_date"
//               value={form.end_date}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-3 w-1/2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
//               required
//             />
//           </div>
//         </div>

//         {/* Budget */}
//         <div>
//           <label className="block font-semibold mb-2 text-gray-700">What is your Budget?</label>
//           <p className="text-gray-600 mb-3">
//             The budget is exclusively allocated for activities and dining purposes.
//           </p>
//           <div className="grid grid-cols-3 gap-4">
//             {budgets.map((b) => (
//               <div
//                 key={b.label}
//                 role="button"
//                 tabIndex={0}
//                 onKeyDown={() => setForm({ ...form, budget: b.value })}
//                 onClick={() => setForm({ ...form, budget: b.value })}
//                 className={`p-4 border rounded-lg cursor-pointer text-center transition-all hover:shadow-md ${
//                   Number(form.budget) === b.value
//                     ? "border-amber-500 bg-amber-50 shadow-sm"
//                     : "border-gray-300 bg-gray-50"
//                 }`}
//               >
//                 <p className="font-bold text-gray-800">{b.label}</p>
//                 <p className="text-sm text-gray-600">
//                   {b.label === "High" ? "2500+ USD" : `0 - ${b.value} USD`}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Activities */}
//         <div>
//           <label className="block font-semibold mb-2 text-gray-700">
//             Which activities are you interested in?
//           </label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {activities.map((act) => (
//               <div
//                 key={act}
//                 className={`p-3 border rounded-lg cursor-pointer text-center transition-all hover:shadow-md ${
//                   form.interests.includes(act)
//                     ? "border-amber-500 bg-amber-50 text-amber-700 font-medium"
//                     : "border-gray-300 bg-gray-50 text-gray-700"
//                 }`}
//                 onClick={() => toggleInterest(act)}
//               >
//                 {act}
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 disabled:bg-amber-300 transition-all font-semibold shadow-md hover:shadow-lg"
//           disabled={loading}
//         >
//           {loading ? "Planning..." : "Submit"}
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4 p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}

//       {/* Show Trip Results */}
//       {trip && (
//         <div className="mt-10 space-y-8">
//           <h2 className="text-3xl font-bold text-amber-600 mb-6">
//             Your Trip to {form.destination}
//           </h2>

//           {/* Hotels */}
//           <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
//               <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-2">🏨</span>
//               Suggested Hotels
//             </h3>
//             <ul className="space-y-3">
//               {(trip?.recommendations?.hotels ?? []).map((hotel, index) => (
//                 <li
//                   key={hotel?.id ?? hotel?._id ?? index}
//                   className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-amber-50 hover:border-amber-200 transition-all"
//                 >
//                   {hotel?.name ?? hotel}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Activities */}
//           <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
//               <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-2">🎉</span>
//               Suggested Activities
//             </h3>
//             <ul className="space-y-3">
//               {(trip?.recommendations?.activities ?? []).map((act, index) => (
//                 <li
//                   key={act?.id ?? act?._id ?? index}
//                   className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-amber-50 hover:border-amber-200 transition-all"
//                 >
//                   {act?.name ?? act}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Daily Itinerary */}
//           <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
//               <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-2">📅</span>
//               Daily Itinerary
//             </h3>

//             {Array.isArray(trip?.recommendations?.daily_itinerary) && trip.recommendations.daily_itinerary.length > 0 ? (
//               trip.recommendations.daily_itinerary.map((day, idx) => (
//                 <div
//                   key={idx}
//                   className="mb-6 p-5 border border-gray-200 rounded-lg bg-amber-50 shadow-sm last:mb-0"
//                 >
//                   <h4 className="font-semibold text-lg text-amber-700 mb-3">
//                     Day {day?.day ?? idx + 1}: {day?.theme ?? "Plan"}
//                   </h4>

//                   <ul className="space-y-3">
//                     {(day?.activities ?? []).map((actRef, i) => {
//                       const fullActivity = findFullActivity(actRef);

//                       return (
//                         <li
//                           key={i}
//                           className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col hover:shadow-md transition-all"
//                         >
//                           <span className="font-semibold text-gray-800">
//                             {fullActivity?.name ?? (actRef?.name ?? "Activity")}
//                           </span>

//                           {actRef?.time && (
//                             <span className="text-sm text-gray-600 mt-1 flex items-center">
//                               <span className="mr-2">🕒</span> {actRef.time}
//                             </span>
//                           )}

//                           {fullActivity?.destination && (
//                             <span className="text-sm text-gray-500 mt-1 flex items-center">
//                               <span className="mr-2">📍</span> {fullActivity.destination}
//                             </span>
//                           )}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-600">No itinerary available</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TripPlanner;
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
    "New York","Paris","Tokyo","Cairo","Alexandria","Luxor","Aswan","Giza",
    "Hurghada","Sharm El Sheikh","Dubai","Istanbul","Rome","Barcelona","London",
  ];

  const budgets = [
    { label: "Low", value: 1000 },
    { label: "Medium", value: 2500 },
    { label: "High", value: 5000 },
  ];

  const activities = [
    "Beaches","City sightseeing","Outdoor adventures","Festivals/events",
    "Food exploration","Nightlife","Shopping","Spa wellness",
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

  const safeParse = (s) => {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
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

      const resText = await res.text();
      let resJson = null;
      try { resJson = resText ? JSON.parse(resText) : null; } catch { resJson = null; }

      if (!res.ok) {
        const msg = (resJson && resJson.message) ? resJson.message : `Request failed (${res.status})`;
        throw new Error(msg);
      }

      const data = resJson ?? {};
      const plan = data.plan ?? data;
      setTrip(plan);

      const existing = safeParse(localStorage.getItem("trips")) || [];
      if (Array.isArray(existing)) {
        localStorage.setItem("trips", JSON.stringify([...existing, plan]));
      } else {
        localStorage.setItem("trips", JSON.stringify([plan]));
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const recActivities = (trip?.recommendations?.activities) ?? [];

  const findFullActivity = (actRef) => {
    if (!actRef) return null;
    const refId = (actRef.activity ?? actRef.id ?? actRef).toString?.() ?? `${actRef}`;
    return recActivities.find((a) => {
      const aId = (a?.id ?? (a?._id ? a._id.toString() : null) ?? a).toString?.() ?? `${a}`;
      return aId === refId;
    }) ?? null;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Tell us your travel preferences
      </h1>
      <p className="text-gray-600 mb-8">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Destination */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            What is your destination of choice?
          </label>
          <select
            name="destination"
            value={form.destination}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            required
          >
            <option value="">Select Destination</option>
            {destinations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            When are you planning to travel?
          </label>
          <div className="flex gap-4">
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-1/2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              required
            />
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-1/2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">What is your Budget?</label>
          <p className="text-gray-600 mb-3">
            The budget is exclusively allocated for activities and dining purposes.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {budgets.map((b) => (
              <div
                key={b.label}
                role="button"
                tabIndex={0}
                onKeyDown={() => setForm({ ...form, budget: b.value })}
                onClick={() => setForm({ ...form, budget: b.value })}
                className={`p-4 border rounded-lg cursor-pointer text-center transition-all hover:shadow-md ${
                  Number(form.budget) === b.value
                    ? "border-amber-500 bg-amber-50 shadow-sm"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <p className="font-bold text-gray-800">{b.label}</p>
                <p className="text-sm text-gray-600">
                  {b.label === "High" ? "2500+ USD" : `0 - ${b.value} USD`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Which activities are you interested in?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activities.map((act) => (
              <div
                key={act}
                className={`p-3 border rounded-lg cursor-pointer text-center transition-all hover:shadow-md ${
                  form.interests.includes(act)
                    ? "border-amber-500 bg-amber-50 text-amber-700 font-medium"
                    : "border-gray-300 bg-gray-50 text-gray-700"
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
          className="bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 disabled:bg-amber-300 transition-all font-semibold shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? "Planning..." : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}

      {/* Show Trip Results */}
      {trip && (
        <div className="mt-10 space-y-8">
          <h2 className="text-3xl font-bold text-amber-600 mb-6">
            Your Trip to {form.destination}
          </h2>

          {/* Hotels */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-2">🏨</span>
              Suggested Hotels
            </h3>
            <ul className="space-y-3">
              {(trip?.recommendations?.hotels ?? []).map((hotel, index) => (
                <li
                  key={hotel?.id ?? hotel?._id ?? index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-amber-50 hover:border-amber-200 transition-all"
                >
                  {hotel?.name ?? hotel}
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-2">🎉</span>
              Suggested Activities
            </h3>
            <ul className="space-y-3">
              {(trip?.recommendations?.activities ?? []).map((act, index) => (
                <li
                  key={act?.id ?? act?._id ?? index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-amber-50 hover:border-amber-200 transition-all"
                >
                  {act?.name ?? act}
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Itinerary */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-2">📅</span>
              Daily Itinerary
            </h3>

            {Array.isArray(trip?.recommendations?.daily_itinerary) &&
            trip.recommendations.daily_itinerary.length > 0 ? (
              trip.recommendations.daily_itinerary.map((day, idx) => (
                <div
                  key={idx}
                  className="mb-6 p-5  border border-gray-200 rounded-lg bg-amber-50 shadow-sm last:mb-0"
                >
                  <h4 className="font-semibold text-lg text-amber-700 mb-3">
                    Day {day?.day ?? idx + 1}: {day?.theme ?? "Plan"}
                  </h4>

                  <div className="space-y-4">
                    {(day?.activities ?? []).map((actRef, i) => {
                      const fullActivity = findFullActivity(actRef);

                      return (
                        <div
                          key={i}
                          className="flex  items-start gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                        >
                          {/* صورة النشاط */}
                          {fullActivity?.image ? (
                            <img
                              src={fullActivity.image}
                              alt={fullActivity.name}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-lg text-gray-500 text-sm">
                              No Image
                            </div>
                          )}

                          {/* تفاصيل النشاط */}
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-800">
                              {fullActivity?.name ?? (actRef?.name ?? "Activity")}
                            </h5>

                            {actRef?.time && (
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                🕒 {actRef.time}
                              </p>
                            )}

                            {fullActivity?.destination && (
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                📍 {fullActivity.destination}
                              </p>
                            )}

                            {fullActivity?.rating && (
                              <p className="text-sm text-yellow-500 flex items-center mt-1">
                                ⭐ {fullActivity.rating.toFixed(1)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No itinerary available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
