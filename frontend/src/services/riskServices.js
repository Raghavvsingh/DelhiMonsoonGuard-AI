import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const fetchRiskData = async () => {
  const response = await axios.get(`${API_BASE}/risk-data`);
  return response.data; // FULL backend response
};
