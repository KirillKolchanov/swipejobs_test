import { View, Text, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { API_BASE_URL, USER_ID } from "../constants";
import { useJobsMatches } from "../hooks/useJobsMatches";
import { useRejectJob } from "../hooks/useRejectJob";
import JobCard from "./JobCard";

const Jobs = () => {
  const { jobs, error, loading } = useJobsMatches(API_BASE_URL, USER_ID);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { rejectJob } = useRejectJob();
  const [isRejecting, setIsRejecting] = useState(false);

  if (loading) {
    return <Text style={styles.text}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.text}>Error: {error}</Text>;
  }

  if (!jobs || jobs.length === 0) {
    return <Text style={styles.text}>No jobs found</Text>;
  }

  const handleNoThanks = async () => {
    if (isRejecting) return;
    setIsRejecting(true);
    try {
      const job = jobs[currentIndex];
      const res = await rejectJob(API_BASE_URL, USER_ID, job.jobId);
      if (res && res.success) {
        Alert.alert("Rejected!");
        setCurrentIndex((prev) => prev + 1);
      } else if (res && res.success === false) {
        Alert.alert(res.message || "Error. Something went wrong, Try again.");
      } else {
        Alert.alert("Error. Something went wrong, Try again.");
      }
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Error. Something went wrong, Try again.";
      Alert.alert(message);
    } finally {
      setIsRejecting(false);
    }
  };

  if (currentIndex >= jobs.length) {
    return (
      <Text style={styles.text}>
        No more jobs at the moment (reload an app)
      </Text>
    );
  }

  return (
    <View>
      <JobCard job={jobs[currentIndex]} onNoThanks={handleNoThanks} />
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
