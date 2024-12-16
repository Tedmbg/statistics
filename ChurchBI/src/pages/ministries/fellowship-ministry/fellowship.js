// fellowship.js
import axios from "axios";

// Define the API URLs (Ensure these are correct)
const TOTAL_MEMBERS_API = "https://statistics-production-032c.up.railway.app/api/members-fellowship/total-count";
const FELLOWSHIP_MINISTRIES_API = "https://statistics-production-032c.up.railway.app/api/fellowship-ministries";
const AGE_DISTRIBUTION_API = "https://statistics-production-032c.up.railway.app/api/fellowship-ministries/age-distribution";
const WORK_STATUS_API = "https://statistics-production-032c.up.railway.app/api/fellowship-ministries/work-status";

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
      return response.data.data.map((item) => ({
        ministryName: item.ministry_name,
        instructor: item.instructor,
        totalMembers: item.total_members,
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
