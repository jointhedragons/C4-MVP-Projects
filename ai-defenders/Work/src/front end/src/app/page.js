"use client"
import { useState } from 'react';
import { FileText, BarChart3, MessageCircle, Check, X } from 'lucide-react';

export default function SurveyAppLayout() {
  const [activeTab, setActiveTab] = useState('generate');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedback = (isPositive) => {
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="md:text-xl text-md font-bold text-gray-900">AI Survey Consultation</h1>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex  md:space-x-8 ml-15">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex items-center md:px-4 md:py-2 px-2 md:text-sm text-xs  font-medium rounded-lg transition-colors ${
                  activeTab === 'generate'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5 mr-2"/>
                <p className='md:text-base text-[10px]'>Generate Questions</p>
                
              </button>
              
              <button
                onClick={() => setActiveTab('analyze')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'analyze'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                <p className='md:text-base text-[10px]'>Analyze Responses</p>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generate' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="md:text-3xl text-xl font-bold text-gray-900 mb-4">
                Generate Survey Questions
              </h2>
              <p className="md:text-base text-xs text-gray-600 max-w-2xl mx-auto">
                Create comprehensive survey questions tailored to your needs using AI-powered generation
              </p>
            </div>

            {/* Survey Question Generator Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="md:text-xl text-lg font-semibold  text-gray-900 mb-6">
                Survey Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Employee Satisfaction, Product Feedback"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg md:text-md text-xs text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <select className="w-full px-4 py-3 border md:text-md text-xs text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>5-10 Questions</option>
                    <option>10-15 Questions</option>
                    <option>15-20 Questions</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Types
                  </label>
                  <div className="space-y-2 text-black">
                    <label className="flex items-center md:text-md text-xs">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Multiple Choice
                    </label>
                    <label className="flex items-center md:text-md text-xs">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Likert Scale
                    </label>
                    <label className="flex items-center md:text-md text-xs">
                      <input type="checkbox" className="mr-2" />
                      Open-ended
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Employees, Customers, Students"
                    className="w-full px-4 py-3 border text-black md:text-md text-xs border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <button className="mt-6 w-full bg-blue-600 cursor-pointer text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Generate Questions
              </button>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className=" md:text-xl text-lg font-semibold text-gray-900 mb-6">
                Generated Questions
              </h3>
              <div className="text-gray-500 text-center py-12">
                <FileText className="md:w-16 md:h-16 w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className='md:text-md text-xs'>Generated questions will appear here after submission</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className=" font-bold md:text-3xl text-xl text-gray-900 mb-4">
                Analyze Survey Responses
              </h2>
              <p className="md:text-base text-xs text-gray-600 max-w-2xl mx-auto">
                Upload your survey data and get comprehensive insights and analytics
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Upload Survey Data
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-400 transition-colors">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your survey file here
                </h4>
                <p className="text-gray-600 mb-4 md:text-base text-xs">
                  Support for CSV, Excel, and JSON formats
                </p>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Browse Files
                </button>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Supported Formats</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CSV files</li>
                    <li>• Excel (.xlsx, .xls)</li>
                    <li>• JSON format</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Analysis Types</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Statistical Summary</li>
                    <li>• Sentiment Analysis</li>
                    <li>• Response Patterns</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Visualizations</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Charts & Graphs</li>
                    <li>• Word Clouds</li>
                    <li>• Correlation Maps</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Analysis Results
              </h3>
              <div className="text-gray-500 text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className='md:text-base text-xs'>Analysis results will appear here after file upload</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <p className='md:text-md text-xs'>&copy; 2025 AI Survey Consultation. All rights reserved.</p>
            </div>
            
            {/* Feedback Widget */}
            <div className="flex items-center space-x-4">
              {!showFeedback && !feedbackSubmitted && (
                <button
                  onClick={() => setShowFeedback(true)}
                  className="flex items-center md:text-sm text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Feedback
                </button>
              )}
              
              {showFeedback && !feedbackSubmitted && (
                <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback(true)}
                    className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Yes
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    No
                  </button>
                </div>
              )}
              
              {feedbackSubmitted && (
                <div className="text-green-600 text-sm flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Thanks for your feedback!
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}