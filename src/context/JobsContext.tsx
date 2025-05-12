import React, { createContext, useContext, useState } from "react";

interface JobsContextType {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isJobAccepted: boolean;
  setIsJobAccepted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const JobsContext = createContext<JobsContextType | undefined>(
  undefined
);

export const JobsProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isJobAccepted, setIsJobAccepted] = useState(false);

  return (
    <JobsContext.Provider
      value={{ currentIndex, setCurrentIndex, isJobAccepted, setIsJobAccepted }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within a JobsProvider");
  return ctx;
};
