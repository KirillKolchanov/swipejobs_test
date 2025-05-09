import axios from "axios";
import { useState } from "react";

export const useAcceptJob = () => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);

  const acceptJob = async (
    baseUrl: string,
    workerId: string,
    jobId: string
  ) => {
    try {
      setIsAcceptLoading(true);
      const response = await axios.get(
        `${baseUrl}/${workerId}/job/${jobId}/accept`
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsAcceptLoading(false);
    }
  };

  return { acceptJob, isAcceptLoading };
};
