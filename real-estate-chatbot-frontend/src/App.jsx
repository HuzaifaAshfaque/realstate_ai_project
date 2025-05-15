import React, { useState, useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import Message from './components/Message';
import QueryResult from './components/QueryResult';
import ApiService from './services/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendQuery = async (query, file) => {
    // Add user message to chat
    setMessages(prev => [...prev, { text: query, isUser: true }]);
    
    setLoading(true);
    setError(null);
    
    try {
      // Call API
      const result = await ApiService.sendQuery(query, file);
      
      // Add bot response to chat
      let responseText = '';
      
      if (result.error) {
        responseText = `Error: ${result.error}`;
        setError(result.error);
      } else {
        if (result.type === 'area_analysis') {
          responseText = `Here's the analysis for ${result.area}:`;
        } else if (result.type === 'comparison') {
          responseText = `Here's the comparison between ${result.areas.join(' and ')}:`;
        } else if (result.type === 'price_growth') {
          responseText = `Here's the price growth analysis for ${result.area} over the last ${result.years} years:`;
        }
        
        setQueryResult(result);
      }
      
      setMessages(prev => [...prev, { text: responseText, isUser: false }]);
    } catch (err) {
      console.error('Error processing query:', err);
      setError('An error occurred while processing your query. Please try again.');
      setMessages(prev => [...prev, { 
        text: 'An error occurred while processing your query. Please try again.', 
        isUser: false 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gray-600 text-white p-4 shadow">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Real Estate Analysis Chatbot</h1>
          <p className="text-sm opacity-80">Ask questions about real estate data</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 flex flex-col">
        {/* Messages Container */}
        <div className="flex-grow flex flex-col overflow-y-auto mb-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to Real Estate Analysis Chatbot!</h2>
              <p className="text-gray-600 mb-4">
                Ask me questions about real estate data. For example:
              </p>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="bg-gray-100 p-2 rounded">"Give me analysis of Wakad"</div>
                <div className="bg-gray-100 p-2 rounded">"Compare Ambegaon Budruk and Aundh demand trends"</div>
                <div className="bg-gray-100 p-2 rounded">"Show price growth for Akurdi over last 3 years"</div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-4 mt-4">
            {messages.map((message, index) => (
              <Message 
                key={index} 
                message={message.text} 
                isUser={message.isUser} 
              />
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="self-start bg-gray-100 text-gray-800 rounded-lg p-4 mb-4 flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce mr-1"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce animation-delay-200 mr-1"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="self-start bg-red-100 text-red-800 rounded-lg p-4 mb-4">
                {error}
              </div>
            )}
            
            {/* Results */}
            {queryResult && !loading && (
              <div className="self-start w-full max-w-4xl">
                <QueryResult result={queryResult} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <ChatInput onSendQuery={handleSendQuery} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-2 text-center text-sm">
        Real Estate Analysis Chatbot © 2025
      </footer>
    </div>
  );
}

export default App;