import { useState, useEffect } from "react";
import axios from "axios";
import { Job } from "../types/user";

export const useJobsMatches = (baseUrl: string, userId: string) => {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Job[]>(`${baseUrl}/${userId}/matches`);
        setJobs(response.data);
        setError(null);
      } catch (err) {
        setError("Error loading user data");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [baseUrl, userId]);

  return { jobs, loading, error };
};
