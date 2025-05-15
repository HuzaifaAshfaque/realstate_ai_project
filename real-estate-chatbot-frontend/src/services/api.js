import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ApiService = {
  // Send query to backend
  sendQuery: async (query, file = null) => {
    const formData = new FormData();
    formData.append('query', query);
    
    if (file) {
      formData.append('file', file);
    }
    
    try {
      const response = await axios.post(`${API_URL}/query/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default ApiService;