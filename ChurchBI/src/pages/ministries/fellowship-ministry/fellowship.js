// fellowship.js
import axios from "axios";

// Define the API URLs (Ensure these are correct)
const TOTAL_MEMBERS_API = "https://statistics-production-032c.up.railway.app/api/members-fellowship/total-count";
const FELLOWSHIP_MINISTRIES_API = "https://statistics-production-032c.up.railway.app/api/fellowship-ministries/gender-distribution";
const AGE_DISTRIBUTION_API = "https://statistics-production-032c.up.railway.app/api/fellowship-ministries/age-distribution";
const WORK_STATUS_API = "https://statistics-production-032c.up.railway.app/api/fellowship-ministries/work-status";
const GENDER_DISTRIBUTION_API = "https://statistics-production-032c.up.railway.app/api/fellowship-ministries/overall-gender-ratio";
const FELLOWSHIP_MINISTRIES_LIST = "https://statistics-production-032c.up.railway.app/api/fellowship-ministries";
// const FELLOWSHIP_TOTAL_NUMBER = "https://statistics-production-032c.up.railway.app/api/ministries/count";


/**
 * Fetch fellowship total members data.
 * @returns {Promise<{ totalMembers: number, monthlyBreakdown: { month: string, count: number }[] }>}
 */
export const fetchFellowshipTotalMembers = async () => {
  try {
    const response = await axios.get(TOTAL_MEMBERS_API);
    if (response.data.status === "success") {
      const { total_members, monthly_breakdown } = response.data.data;

      return {
        totalMembers: total_members,
        monthlyBreakdown: monthly_breakdown.map((item) => ({
          month: item.month,
          count: item.count,
        })),
      };
    } else {
      throw new Error("Failed to fetch fellowship total members data");
    }
  } catch (error) {
    console.error("Error fetching fellowship total members data:", error);
    throw error;
  }
};

/**
 * Fetch fellowship ministries data.
 * @returns {Promise<{ ministryName: string, instructor: string, totalMembers: number }[]>}
 */
export const fetchFellowshipMinistries = async () => {
    try {
      const response = await axios.get(FELLOWSHIP_MINISTRIES_API);
  
      if (response.data.status === "success") {
        // Return ministries data directly with correct keys
        return response.data.data.map((item) => ({
          ministry_name: item.ministry_name, // Keep original keys
          male_count: item.male_count,
          female_count: item.female_count,
        }));
      } else {
        throw new Error("Failed to fetch fellowship ministries data");
      }
    } catch (error) {
      console.error("Error fetching fellowship ministries data:", error);
      throw error;
    }
  };

/**
 * Fetch fellowship age distribution data.
 * @returns {Promise<{ ministryName: string, ageRange: string, total: number }[]>}
 */
export const fetchFellowshipAgeDistribution = async () => {
  try {
    const response = await axios.get(AGE_DISTRIBUTION_API);
    if (response.data.status === "success") {
      return response.data.data.map((item) => ({
        ministryName: item.ministry_name,
        ageRange: item.age_range,
        total: item.total,
      }));
    } else {
      throw new Error("Failed to fetch fellowship age distribution data");
    }
  } catch (error) {
    console.error("Error fetching fellowship age distribution data:", error);
    throw error;
  }
};

/**
 * Fetch fellowship work status data.
 * @returns {Promise<{ ministryName: string, occupationStatus: string, maleCount: number, femaleCount: number, totalCount: number }[]>}
 */
export const fetchFellowshipWorkStatus = async () => {
  try {
    const response = await axios.get(WORK_STATUS_API);
    if (response.data.status === "success") {
      return response.data.data.map((item) => ({
        ministryName: item.ministry_name,
        occupationStatus: item.occupation_status,
        maleCount: item.male_count,
        femaleCount: item.female_count,
        totalCount: item.total_count,
      }));
    } else {
      throw new Error("Failed to fetch fellowship work status data");
    }
  } catch (error) {
    console.error("Error fetching fellowship work status data:", error);
    throw error;
  }
};

/**
 * Fetch gender distribution data from the API.
 * @param {string} year - Optional year filter
 * @returns {Promise<{ malePercentage: number, femalePercentage: number, totalMale: number, totalFemale: number }>}
 */
export const fetchGenderDistribution = async (year = null) => {
    try {
      const response = await axios.get(GENDER_DISTRIBUTION_API, {
        params: year ? { year } : {}, // Add year query parameter if provided
      });
  
      if (response.data.status === "success") {
        const { male_percentage, female_percentage, total_male, total_female } = response.data.data;
  
        // Return data in a clean format
        return {
          malePercentage: male_percentage,
          femalePercentage: female_percentage,
          totalMale: total_male,
          totalFemale: total_female,
        };
      } else {
        throw new Error("Failed to fetch gender distribution data");
      }
    } catch (error) {
      console.error("Error fetching gender distribution:", error);
      throw error;
    }
  };

  /**
 * Fetch fellowship ministries data.
 * @param {string} year - Optional year to filter data.
 * @returns {Promise<{ ministry_name: string, instructor: string, total_members: number }[]>}
 */
export const fetchFellowshipMinistriesList = async (year = null) => {
    try {
      const response = await axios.get(FELLOWSHIP_MINISTRIES_LIST, {
        params: year ? { year } : {}, // Add year query parameter if provided
      });
  
      if (response.data.status === "success") {
        return response.data.data.map((item) => ({
          ministryName: item.ministry_name,
          instructor: item.instructor,
          totalMembers: item.total_members,
        }));
      } else {
        throw new Error("Failed to fetch fellowship ministries data.");
      }
    } catch (error) {
      console.error("Error fetching fellowship ministries data:", error);
      throw error;
    }
  };
