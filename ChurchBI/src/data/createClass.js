import axios from "axios";

export const createClass = async (classData) => {
  try {
    const response = await axios.post("https://statistics-production-032c.up.railway.app/api/discipleship-classes_add", classData);
    return response.data; // Return success response
  } catch (error) {
    console.error("Error creating class:", error);
    throw error; // Propagate error to handle it in the component
  }
};
