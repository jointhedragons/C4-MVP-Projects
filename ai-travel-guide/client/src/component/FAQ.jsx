import React from 'react';

const FAQItem = ({ question, answer }) => (
  <div className="border-b border-gray-200 py-4">
    <details className="group">
      <summary className="flex justify-between items-center font-semibold text-gray-900 cursor-pointer">
        {question}
        <span className="transition group-open:rotate-180">
          <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <p className="text-gray-600 mt-2">{answer}</p>
    </details>
  </div>
);

const FAQ = () => {
  const faqs = [
    {
      question: "What is GoGuidaAi?",
      answer: "Imagine having a personal travel agent in your pocket, available anytime, anywhere. That’s what GoGuidaAi offers: a user-friendly service to ‘plan my trip’, crafting bespoke itineraries at no cost. Enjoy tailored, effortless trip planning with just a click. This is achieved through our advanced AI trip planner that builds personalized travel experiences."
    },
    {
      question: "Is GoGuidaAi free to use?",
      answer: "Yes, GoGuidaAi is free to use."
    },
    {
      question: "How does GoGuidaAi create personalized recommendations?",
      answer: "GoGuidaAi uses advanced AI algorithms to analyze your preferences and past travel data to create personalized recommendations."
    },
    {
      question: "Can I access GoGuidaAi offline?",
      answer: "GoGuidaAi requires an internet connection to function fully."
    },
    {
      question: "How do I adjust my GoGuidaAi itinerary?",
      answer: "You can adjust your itinerary by logging into your account and using the edit feature on the trip planner interface."
    },
    {
      question: "Where can I receive support for using GoGuidaAi?",
      answer: "Support is available through our help center on the  GoGuidaAi website or via email."
    }
  ];

  return (
    <div className="max-w-6xl flex flex-col md:flex-row justify-between mx-auto p-6">
    <h1 className="text-4xl font-bold text-gray-900 mb-6 md:mb-0">FAQs</h1>
    <div className="w-full md:w-3/4">
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  </div>
  );
};

export default FAQ;