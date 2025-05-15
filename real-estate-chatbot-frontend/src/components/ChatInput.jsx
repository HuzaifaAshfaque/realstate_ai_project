import React, { useState } from 'react';

const ChatInput = ({ onSendQuery, onFileUpload }) => {
  const [query, setQuery] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSendQuery(query, file);
      setQuery('');
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-white hover:file:bg-primary"
          />
          {file && (
            <span className="text-sm text-gray-600">
              {file.name}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about real estate data (e.g., 'Analyze Wakad')"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;