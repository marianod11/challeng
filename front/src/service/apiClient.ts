import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:3000/",
    headers: {
        "Content-Type": "application/json",
    },
});

export const handleError = (error: unknown) => {
    console.error("API error:", error);
    throw error;
};


