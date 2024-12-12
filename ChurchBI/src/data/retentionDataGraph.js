// fetchRetentionData.js
import axios from "axios";
import moment from "moment"; // For date formatting

// Existing function to fetch retention data for the chart
const fetchRetentionData = async (year = new Date().getFullYear()) => {
  try {
    // Build the API URL with the year parameter
    const apiUrl = `https://statistics-production-032c.up.railway.app/api/retention-rate?year=${year}`;

    const response = await axios.get(apiUrl);

    const apiData = response.data.data; // Access the 'data' array

    console.log(apiData); // Verify the data

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

// Function to fetch 'Just Visiting' data
const fetchJustVisiting = async () => {
  try {
    const response = await axios.get(
      "https://statistics-production-032c.up.railway.app/api/just-visiting"
    );

    const totalVisitors = response.data.data.total_visitors;
    return totalVisitors;
  } catch (error) {
    console.error("Error fetching 'Just Visiting' data:", error);
    throw new Error("Failed to fetch 'Just Visiting' data");
  }
};

// New function to fetch average retention rate
const fetchAverageRetentionRate = async () => {
  try {
    const response = await axios.get(
      "https://statistics-production-032c.up.railway.app/api/retention-rate"
    );

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

// New function to fetch gender ratio
const fetchGenderRatio = async () => {
  try {
    const response = await axios.get(
      "https://statistics-production-032c.up.railway.app/api/retention-rate"
    );

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

export {
  fetchRetentionData,
  fetchJustVisiting,
  fetchAverageRetentionRate,
  fetchGenderRatio,
};
