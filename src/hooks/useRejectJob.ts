import axios from "axios";
import { useState } from "react";

export const useRejectJob = () => {
  const [isRejectLoading, setIsRejectLoading] = useState(false);

  const rejectJob = async (
    baseUrl: string,
    workerId: string,
    jobId: string
  ) => {
    try {
      setIsRejectLoading(true);
      const response = await axios.get(
        `${baseUrl}/${workerId}/job/${jobId}/reject`
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsRejectLoading(false);
    }
  };

  return { rejectJob, isRejectLoading };
};
