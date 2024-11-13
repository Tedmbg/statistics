import axios from "axios";

const fetchRetentionData = async () => {
  try {
    const response = await axios.get(
      "https://statistics-production-032c.up.railway.app/api/members/monthly"
    );

    const apiData = response.data;

    console.log(apiData); // check to see if data is there

    // Format the data for the BarChart component
    const formattedData = {
      labels: apiData.map((item) => item.month),
      datasets: [
        {
          label: "Male",
          data: apiData.map((item) => item.male_count || 0), // Default to 0 if no male_count
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
        {
          label: "Female",
          data: apiData.map((item) => item.female_count || 0), // Default to 0 if no female_count
          backgroundColor: "rgba(153, 102, 255, 0.7)",
        },
      ],
    };

    return formattedData;
  } catch (error) {
    console.error("Error fetching retention data:", error);
    throw new Error("Failed to fetch retention data");
  }
};

export default fetchRetentionData;
