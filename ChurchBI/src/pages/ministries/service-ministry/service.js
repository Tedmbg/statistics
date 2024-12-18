import axios from "axios";

// Base URL for the API
const BASE_URL = "https://statistics-production-032c.up.railway.app";

// Fetch Service Ministries Data
export const fetchServiceMinistries = async (year = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/service-ministries`, {
      params: { year }, // Send year as a query parameter
    });
    return response.data; // Return API response data
  } catch (error) {
    console.error("Error fetching service ministries data:", error);
    throw error;
  }
};

// Fetch Age Distribution for Service Ministries
export const fetchAgeDistribution = async (year = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/service-ministries/age-distribution`, {
      params: { year }, // Send year as a query parameter
    });
    return response.data; // Return API response data
  } catch (error) {
    console.error("Error fetching age distribution data:", error);
    throw error;
  }
};

// Fetch Work Status for Service Ministries
export const fetchWorkStatus = async (year = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/service-ministries/work-status`, {
      params: { year }, // Send year as a query parameter
    });
    return response.data; // Return API response data
  } catch (error) {
    console.error("Error fetching work status data:", error);
    throw error;
  }
};
