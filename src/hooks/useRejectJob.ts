import axios from "axios";

export const useRejectJob = () => {
  const rejectJob = async (
    baseUrl: string,
    workerId: string,
    jobId: string
  ) => {
    try {
      const response = await axios.get(
        `${baseUrl}/${workerId}/job/${jobId}/reject`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { rejectJob };
};
