import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/user";

export const useUser = (baseUrl: string, userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get<User>(`${baseUrl}/${userId}/profile`);
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError("Error loading user data");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [baseUrl, userId]);

  return { user, loading, error };
};
