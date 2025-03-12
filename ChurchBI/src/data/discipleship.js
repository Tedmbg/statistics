import axios from "axios";

// Function to fetch discipleship classes
export const fetchDiscipleshipClasses = async () => {
  try {
    const response = await axios.get(
      "https://statistics-production-032c.up.railway.app/api/discipleship-classes2"
    );
    return response.data.data; // Return the array of classes
  } catch (error) {
    console.error("Error fetching discipleship classes:", error);
    throw error; // Propagate error for handling in the component
  }
};

// Function to fetch absentee data
export const fetchAbsenteesList = async () => {
    try {
      const response = await axios.get(
        "https://statistics-production-032c.up.railway.app/api/absentees-list"
      );
      return response.data.data; // Return the absentee data
    } catch (error) {
      console.error("Error fetching absentees list:", error);
      throw error; // Propagate error for handling in the component
    }
  };

  // Function to fetch monthly completed stats
export const fetchMonthlyCompletedStats = async (year) => {
    try {
      const response = await axios.get(
        `https://statistics-production-032c.up.railway.app/api/monthly-completed-stats`,
        { params: { year } } // Pass year as query parameter
      );
      return response.data.data; // Return the data from the API response
    } catch (error) {
      console.error("Error fetching monthly completed stats:", error);
      throw error; // Propagate error for handling in the component
    }
  };
  
