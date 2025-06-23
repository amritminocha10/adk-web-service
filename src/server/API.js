import axios from "axios";

// const SERVER_URL =  window.location.origin;
// const SERVER_URL =  "https://autoclaim-711485936165.us-central1.run.app";
const SERVER_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default {
  post: {
    // Uploads the claim and returns the session ID
    uploadClaimData: async (formData) => {
      try {
        const response = await api.post('/upload-claim', formData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
};

