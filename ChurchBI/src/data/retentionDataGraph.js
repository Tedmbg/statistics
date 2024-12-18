// src/data/fetchRetentionData.js
import axios from "axios";
import moment from "moment"; // For date formatting

// Base API URL
const BASE_API_URL = "https://statistics-production-032c.up.railway.app/api";

// Function to build URL with query parameters
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_API_URL}/${endpoint}`);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  return url.toString();
};

// Fetch retention data with year parameter
const fetchRetentionData = async (year) => {
  try {
    const response = await axios.get(buildUrl("retention-rate", { year }));

    const apiData = response.data.data; // Access the 'data' array

    console.log("Retention Data:", apiData); // Verify the data

    // Process the data for the chart
    const formattedData = {
      labels: apiData.map((item) =>
        moment(item.start_date).format("MMM YYYY")
      ),
      datasets: [
        {
          label: "Male",
          data: apiData.map((item) => {
            const maleRetention =
              (item.male_completed / item.total_members) * 100 || 0;
            return parseFloat(maleRetention.toFixed(2)); // Ensure numeric values
          }),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
        {
          label: "Female",
          data: apiData.map((item) => {
            const femaleRetention =
              (item.female_completed / item.total_members) * 100 || 0;
            return parseFloat(femaleRetention.toFixed(2));
          }),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };

    return formattedData;
  } catch (error) {
    console.error("Error fetching retention data:", error);
    throw new Error("Failed to fetch retention data");
  }
};

// Fetch 'Just Visiting' data with year parameter
const fetchJustVisiting = async (year) => {
  try {
    const response = await axios.get(buildUrl("just-visiting", { year }));

    const totalVisitors = response.data.data.total_visitors;
    return totalVisitors;
  } catch (error) {
    console.error("Error fetching 'Just Visiting' data:", error);
    throw new Error("Failed to fetch 'Just Visiting' data");
  }
};

// Fetch average retention rate with year parameter
const fetchAverageRetentionRate = async (year) => {
  try {
    const response = await axios.get(buildUrl("retention-rate", { year }));

    const apiData = response.data.data;

    let totalRetentionSum = 0;
    let totalEntries = apiData.length;

    apiData.forEach((item) => {
      totalRetentionSum += parseFloat(item.retention_rate) || 0;
    });

    const averageRetentionRate = totalEntries
      ? (totalRetentionSum / totalEntries).toFixed(2)
      : "0.00";

    return averageRetentionRate;
  } catch (error) {
    console.error("Error fetching average retention rate:", error);
    throw new Error("Failed to fetch average retention rate");
  }
};

// Fetch gender ratio with year parameter
const fetchGenderRatio = async (year) => {
  try {
    const response = await axios.get(buildUrl("retention-rate", { year }));

    const apiData = response.data.data;

    let totalMaleCompleted = 0;
    let totalFemaleCompleted = 0;

    apiData.forEach((item) => {
      totalMaleCompleted += item.male_completed || 0;
      totalFemaleCompleted += item.female_completed || 0;
    });

    const totalCompleted = totalMaleCompleted + totalFemaleCompleted;

    const malePercentage = totalCompleted
      ? ((totalMaleCompleted / totalCompleted) * 100).toFixed(2)
      : "0.00";
    const femalePercentage = totalCompleted
      ? ((totalFemaleCompleted / totalCompleted) * 100).toFixed(2)
      : "0.00";

    return { malePercentage, femalePercentage };
  } catch (error) {
    console.error("Error fetching gender ratio:", error);
    throw new Error("Failed to fetch gender ratio");
  }
};

// Fetch age distribution data with year parameter
const fetchAgeDistributionData = async (year) => {
  try {
    const apiUrl = buildUrl("members/age-distribution-dis", { year });

    const response = await axios.get(apiUrl);
    return response.data.data; // This is an array of objects as shown in the sample
  } catch (error) {
    console.error("Error fetching age distribution data:", error);
    throw new Error("Failed to fetch age distribution data");
  }
};

// Fetch work status data with year parameter
const fetchWorkStatusData = async (year) => {
  try {
    const apiUrl = buildUrl("members/work-status-dis", { year });

    const response = await axios.get(apiUrl);
    const apiData = response.data.data;

    // Prepare data for the chart
    const formattedData = {
      labels: apiData.map((item) => item.occupation_status),
      datasets: [
        {
          label: "Male Completed",
          data: apiData.map((item) => item.male_completed_count || 0),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
        {
          label: "Female Completed",
          data: apiData.map((item) => item.female_completed_count || 0),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
        {
          label: "Male Not Completed",
          data: apiData.map((item) => item.male_not_completed_count || 0),
          backgroundColor: "rgba(54, 162, 235, 0.3)",
        },
        {
          label: "Female Not Completed",
          data: apiData.map((item) => item.female_not_completed_count || 0),
          backgroundColor: "rgba(255, 99, 132, 0.3)",
        },
      ],
    };

    return formattedData;
  } catch (error) {
    console.error("Error fetching work status data:", error);
    throw new Error("Failed to fetch work status data");
  }
};

export {
  fetchRetentionData,
  fetchJustVisiting,
  fetchAverageRetentionRate,
  fetchGenderRatio,
  fetchWorkStatusData,
  fetchAgeDistributionData,
};
