const API = axios.create({ baseURL: "http://localhost:8000" });

export const sendMessage = async (message) => {
  try {
    const response = await API.post("/chatbot", { message });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
