import React from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { API_BASE_URL, USER_ID } from "../constants";
import { useJobsMatches } from "../hooks/useJobsMatches";
import { useRejectJob } from "../hooks/useRejectJob";
import JobCard from "./JobCard";
import { useAcceptJob } from "../hooks/useAcceptJob";
import { useJobs } from "../context/JobsContext";

type JobActionResult = { success: boolean; message?: string };
type JobAction = (
  baseUrl: string,
  userId: string,
  jobId: string
) => Promise<JobActionResult>;

const Jobs = () => {
  const { jobs, error, loading } = useJobsMatches(API_BASE_URL, USER_ID);
  const { currentIndex, setCurrentIndex, isJobAccepted, setIsJobAccepted } =
    useJobs();
  const { rejectJob, isRejectLoading } = useRejectJob();
  const { acceptJob, isAcceptLoading } = useAcceptJob();

  if (loading) {
    return <Text style={styles.text}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.text}>Error: {error}</Text>;
  }

  if (!jobs || jobs.length === 0) {
    return <Text style={styles.text}>No jobs found</Text>;
  }

  const handleJobAction = async (action: JobAction, onSuccess: () => void) => {
    try {
      const job = jobs[currentIndex];
      const res = await action(API_BASE_URL, USER_ID, job.jobId);
      if (res && res.success) {
        onSuccess();
      } else if (res && res.success === false) {
        setCurrentIndex((prev: number) => prev + 1);
        const message =
          res.message || "Error. Something went wrong, Try again.";
        if (Platform.OS === "web") {
          window.alert(message);
        } else {
          Alert.alert(message);
        }
      } else {
        Alert.alert("Error. Something went wrong, Try again.");
      }
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Error. Something went wrong, Try again.";
      if (Platform.OS === "web") {
        window.alert(message);
      } else {
        Alert.alert(message);
      }
    }
  };

  const handleRejectJob = () =>
    handleJobAction(rejectJob, () => {
      if (Platform.OS === "web") {
        window.alert("Rejected!");
      } else {
        Alert.alert("Rejected!");
      }

      setCurrentIndex((prev: number) => prev + 1);
    });

  const handleAcceptJob = () =>
    handleJobAction(acceptJob, () => {
      setIsJobAccepted(true);
      Alert.alert("Accepted!");
    });

  if (currentIndex >= jobs.length) {
    return (
      <Text style={styles.text}>
        No more jobs at the moment (reload the app)
      </Text>
    );
  }

  return (
    <View>
      <JobCard
        job={jobs[currentIndex]}
        isJobAccepted={isJobAccepted}
        onAcceptJob={handleAcceptJob}
        onRejectJob={handleRejectJob}
        isRejectLoading={isRejectLoading}
        isAcceptLoading={isAcceptLoading}
      />
    </View>
  );
};

export default Jobs;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    display: "flex",
    margin: "auto",
  },
});
