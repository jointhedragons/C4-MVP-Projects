"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { easeOut, motion } from "framer-motion";
import objBall from "../public/3dObj.svg";

export default function ResultsPage() {
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedData = sessionStorage.getItem('investmentResult');
        if (storedData) {
            setResultData(JSON.parse(storedData));
            setLoading(false);
        } else {
            router.push('/');
        }
    }, [router]);

    const handleBackToForm = () => {
        sessionStorage.removeItem('investmentResult');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!resultData) {
        return null;
    }

    const { answer } = resultData;
    const { amount, strategy1, strategy2 } = resultData.formData || {};

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

            <div className="relative z-10 container mx-auto px-4 py-16">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: easeOut }}
                >
                    <h2 className="2xl:text-5xl xl:text-4xl lg:text-3xl md:text-4xl text-2xl font-bold text-white mb-4">
                        Your Investment Recommendation
                    </h2>
                    <div className="2xl:w-4/12 lg:w-3/12 md:w-4/12 w-6/12 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto 2xl:mb-4"></div>
                </motion.div>

                <motion.div
                    className="max-w-4xl mx-auto mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: easeOut }}
                >
                    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-2xl mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Investment Summary</h3>
                        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 text-center">
                            <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-white/70 text-sm">Investment Amount</p>
                                <p className="text-white font-bold text-lg">${amount?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-white/70 text-sm">Time Horizon</p>
                                <p className="text-white font-bold text-lg">{strategy1}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-white/70 text-sm">Risk Tolerance</p>
                                <p className="text-white font-bold text-lg">{strategy2}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="max-w-4xl mx-auto mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: easeOut }}
                >
                    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-white mb-6">Recommended Asset Distribution</h3>
                        <div className="space-y-4">
                            {/* Example asset distribution - you can update this with real data if needed */}
                            {[
                                { assets: "Stocks", percentage: 40, amount: Number(amount) * 0.40 },
                                { assets: "USD/Bonds", percentage: 30, amount: Number(amount) * 0.30 },
                                { assets: "Real Estate", percentage: 20, amount: Number(amount) * 0.20 },
                                { assets: "Gold", percentage: 10, amount: Number(amount) * 0.10 },
                            ]?.map((asset, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/5 rounded-2xl p-4"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-white font-semibold">{asset.assets}</h4>
                                        <span className="text-white font-bold">{asset.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                                        <motion.div
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${asset.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                                        ></motion.div>
                                    </div>
                                    <p className="text-white/70 text-sm">${asset.amount?.toLocaleString()}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* AI Investment Recommendation */}
                <motion.div
                    className="max-w-4xl mx-auto mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: easeOut }}
                >
                    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-white mb-6">AI Investment Recommendation</h3>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div
                                className="text-white/90 leading-relaxed prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: answer
                                        ?.replace(/### (.*)/g, '<h3 class="text-xl font-bold text-white mb-4 mt-6">$1</h3>')
                                        ?.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                                        ?.replace(/^\* (.*)/gm, '<li class="mb-2 ml-4">$1</li>')
                                        ?.replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-2 mb-4 ml-4">$1</ul>')
                                        ?.replace(/\n\n/g, '<br><br>')
                                        ?.replace(/\n/g, '<br>')
                                }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Back Button */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1, ease: easeOut }}
                >
                    <button
                        onClick={handleBackToForm}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-900 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-blue-500/25"
                    >
                        Create New Investment Plan
                    </button>
                </motion.div>
            </div>
        </div>
    );
}