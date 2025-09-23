"use client";
import { useState } from "react";
import Image from "next/image";
import objBall from "../public/3dObj.svg";
import { easeOut, motion } from "framer-motion";

export default function FormWithObjects() {
  const [amount, setAmount] = useState("");
  const [strategy1, setStrategy1] = useState("");
  const [strategy2, setStrategy2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const payload = {
      amount: Number(amount),
      strategy: {
        term: strategy1,
        Risk: strategy2,
      },
    };

    try {
      const res = await fetch("http://localhost:5000/api/wealth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data);
      alert("Data submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const strategyIcons = {
    "Long Term": "📈",
    "Short Term": "⚡",
    "High Risk": "🚀",
    "Low Risk": "🛡️",
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
        radial-gradient(circle at center, rgba(7,42,200,0.3) 40%, transparent 70%),
        linear-gradient(180deg, #0D0F17 0%, #0D0F17 70%)
      `,
      }}
    >
      {/* Background Objects */}
      <motion.div
        className="absolute md:-right-48 md:block hidden md:-bottom-40 transform z-5"
        initial={{ opacity: 0, right: -200 }}
        animate={{ opacity: 1, right: -192 }}
        transition={{ delay: 1, ease: easeOut }}
      >
        <Image
          src={objBall}
          alt="3dObject"
          className="xl:w-[500px] 2xl:w-[600px] lg:w-[500px] md:w-[400px] h-auto transform"
        />
      </motion.div>

      <motion.div
        className="absolute md:-left-90 hidden md:block md:-top-90 transform z-5"
        initial={{ opacity: 0, left: -400 }}
        animate={{ opacity: 1, left: -360 }}
        transition={{ delay: 1, ease: easeOut }}
      >
        <Image
          src={objBall}
          alt="3dObject"
          className="xl:w-[600px] 2xl:w-[650px] md:w-[600px] h-auto"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeOut }}
        >
          <h2 className="2xl:text-5xl xl:text-4xl lg:text-3xl md:text-4xl text-2xl font-bold text-white mb-4">
            AI Wealth Management
          </h2>
          <div className="2xl:w-4/12 lg:w-3/12 md:w-4/12 w-6/12 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto 2xl:mb-4"></div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          className="2xl:max-w-3xl xl:max-w-2xl max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: easeOut }}
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl 2xl:p-8 xl:p-6 p-6 shadow-2xl">
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              {/* Amount Input */}
              <motion.div
                className="space-y-2 flex-1 w-full border-1 border-white/20 border-dotted shadow-2xl md:p-5 p-3 rounded-2xl"
                whileHover={{ scale: 1.02 }}
              >
                <label className="block text-white font-semibold xl:text-lg md:mb-0 mb-5 md:text-md text-sm">
                  Investment Amount
                </label>
                <div className="relative md:mt-4">
                  <span className="absolute md:right-4  md:pr-4 right-2 pr-2  top-1/2 transform -translate-y-1/2 text-white/50 rounded-xl md:font-medium text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full md:pl-8 pl-4 md:text-md text-xs pr-4 py-4 no-arrows bg-white/1 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  />
                </div>
              </motion.div>

              {/* Strategy Selection */}
              <motion.div
                className="flex-1 w-full space-y-2 border-1 border-white/20 border-dotted shadow-2xl p-5 rounded-2xl"
                whileHover={{ scale: 1.01 }}
              >
                <label className="block text-white font-semibold md:mb-0 mb-5 xl:text-lg md:text-md text-sm">
                  Investment Strategy
                </label>

                {/* Term Strategy */}
                <div className="grid md:grid-cols-2 grid-cols-1 gap-3 md:mt-4">
                  {["Long Term", "Short Term"].map((opt) => (
                    <motion.label
                      key={opt}
                      className={`relative cursor-pointer transition-all duration-300 ${
                        strategy1 === opt
                          ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 shadow-lg shadow-blue-500/20"
                          : "bg-white/1 border-white/20 hover:bg-white/10"
                      } border rounded-2xl p-4 backdrop-blur-sm`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <input
                        type="radio"
                        value={opt}
                        checked={strategy1 === opt}
                        onChange={(e) => setStrategy1(e.target.value)}
                        className="sr-only"
                        required
                      />
                      <div className="text-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full mx-auto mb-2 transition-all duration-200 ${
                            strategy1 === opt
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                              : "bg-white/10"
                          }`}
                        >
                          <span className="text-xl">{strategyIcons[opt]}</span>
                        </div>
                        <span className="text-white font-medium md:text-sm text-xs">
                          {opt}
                        </span>
                      </div>
                    </motion.label>
                  ))}
                </div>

                {/* Risk Strategy */}
                <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mt-3">
                  {["High Risk", "Low Risk"].map((opt) => (
                    <motion.label
                      key={opt}
                      className={`relative cursor-pointer transition-all duration-300 ${
                        strategy2 === opt
                          ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 shadow-lg shadow-blue-500/20"
                          : "bg-white/1 border-white/20 hover:bg-white/10"
                      } border rounded-2xl p-4 backdrop-blur-sm`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <input
                        type="radio"
                        value={opt}
                        checked={strategy2 === opt}
                        onChange={(e) => setStrategy2(e.target.value)}
                        className="sr-only"
                        required
                      />
                      <div className="text-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full mx-auto mb-2 transition-all duration-200 ${
                            strategy2 === opt
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                              : "bg-white/10"
                          }`}
                        >
                          <span className="text-xl">{strategyIcons[opt]}</span>
                        </div>
                        <span className="text-white font-medium md:text-sm text-xs">
                          {opt}
                        </span>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                className="flex items-center flex-col w-full md:w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto relative group overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-900 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-blue-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="2xl:text-md md:text-sm text-xs">
                          Processing...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="2xl:text-md md:text-sm text-xs">
                          Show Result
                        </span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
