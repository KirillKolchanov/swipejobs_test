import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useJobsMatches } from "../hooks/useJobsMatches";
import { API_BASE_URL, USER_ID } from "../constants";
import { useSearchParams } from "expo-router/build/hooks";
import { formatShift } from "../utils/formatShift";
import { useJobs } from "../context/JobsContext";
import { useAcceptJob } from "../hooks/useAcceptJob";
import { useRejectJob } from "../hooks/useRejectJob";

export default function JobInfo() {
  const params = useSearchParams();
  const jobId = params.get("jobId") as string;
  const { jobs, loading, error } = useJobsMatches(API_BASE_URL, USER_ID);
  const {
    setCurrentIndex,
    isJobAccepted,
    setIsJobAccepted: setContextIsJobAccepted,
  } = useJobs();
  const { acceptJob, isAcceptLoading } = useAcceptJob();
  const { rejectJob, isRejectLoading } = useRejectJob();

  const { width: screenWidth } = useWindowDimensions();
  let contentWidth;
  if (screenWidth <= 500) {
    contentWidth = screenWidth * 0.9;
  } else if (screenWidth <= 700) {
    contentWidth = 440;
  } else {
    contentWidth = 600;
  }

  if (loading) {
    return <Text style={styles.screenTitle}>Loading...</Text>;
  }
  if (error || !jobs) {
    return (
      <Text style={styles.screenTitle}>Error: {error || "No jobs found"}</Text>
    );
  }

  const job = jobs.find((j) => j.jobId === jobId);
  if (!job) {
    return <Text style={styles.screenTitle}>Job not found</Text>;
  }

  const handleJobAction = async (
    action: (
      baseUrl: string,
      userId: string,
      jobId: string
    ) => Promise<{ success: boolean; message?: string }>,
    onSuccess: () => void
  ) => {
    try {
      const res = await action(API_BASE_URL, USER_ID, job.jobId);
      if (res && res.success) {
        onSuccess();
      } else if (res && res.success === false) {
        setCurrentIndex((prev) => prev + 1);
        if (Platform.OS === "web") {
          window.alert(
            res.message || "Error. Something went wrong, Try again."
          );
        } else {
          Alert.alert(res.message || "Error. Something went wrong, Try again.");
        }
        router.replace("/");
      } else {
        if (Platform.OS === "web") {
          window.alert("Error. Something went wrong, Try again.");
        } else {
          Alert.alert("Error. Something went wrong, Try again.");
        }
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
      setCurrentIndex((prev) => prev + 1);
      router.replace("/");
    });

  const handleAcceptJob = () =>
    handleJobAction(acceptJob, () => {
      setContextIsJobAccepted(true);
    });

  return (
    <View>
      <Pressable style={styles.goBack} onPress={() => router.back()}>
        <Text style={styles.goBackText}>← Go back</Text>
      </Pressable>
      <View style={styles.root}>
        {Platform.OS === "web" ? (
          <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { width: contentWidth, maxWidth: contentWidth },
                { paddingBottom: 120 },
              ]}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.screenTitle}>All job information</Text>
              <Image
                style={[styles.image, { width: "100%", maxWidth: "100%" }]}
                source={job.jobTitle.imageUrl}
                contentFit="cover"
              />
              <View style={styles.titleBox}>
                <Text style={styles.title}>{job.jobTitle.name}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Company</Text>
                <Text style={styles.sectionText}>{job.company.name}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <Text style={styles.sectionText}>
                  {job.company.address.formattedAddress}
                </Text>
                <Text style={styles.sectionSubText}>
                  {job.company.address.zoneId}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Distance</Text>
                <Text style={styles.sectionText}>
                  {job.milesToTravel.toFixed(2)} miles from your job search
                  location
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hourly Rate</Text>
                <Text style={styles.sectionText}>
                  ${(job.wagePerHourInCents / 100).toFixed(2)}
                </Text>
              </View>

              {Array.isArray(job.requirements) &&
                job.requirements.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Requirements</Text>
                    {job.requirements.map((req, idx) => (
                      <Text style={styles.sectionText} key={idx}>
                        - {req}
                      </Text>
                    ))}
                  </View>
                )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Report To</Text>
                <Text style={styles.sectionText}>
                  {job.company.reportTo.name}
                  {job.company.reportTo.phone
                    ? ` (${job.company.reportTo.phone})`
                    : ""}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Branch Info</Text>
                <Text style={styles.sectionText}>{job.branch}</Text>
                <Text style={styles.sectionText}>{job.branchPhoneNumber}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shifts</Text>
                {job.shifts.map((shift, idx) => (
                  <Text
                    style={[styles.sectionText, { marginBottom: 8 }]}
                    key={idx}
                  >
                    {formatShift(shift)}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </div>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { width: contentWidth, maxWidth: contentWidth },
            ]}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.screenTitle}>All job information</Text>
            <Image
              style={[styles.image, { width: "100%", maxWidth: "100%" }]}
              source={job.jobTitle.imageUrl}
              contentFit="cover"
            />
            <View style={styles.titleBox}>
              <Text style={styles.title}>{job.jobTitle.name}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company</Text>
              <Text style={styles.sectionText}>{job.company.name}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.sectionText}>
                {job.company.address.formattedAddress}
              </Text>
              <Text style={styles.sectionSubText}>
                {job.company.address.zoneId}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <Text style={styles.sectionText}>
                {job.milesToTravel.toFixed(2)} miles from your job search
                location
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hourly Rate</Text>
              <Text style={styles.sectionText}>
                ${(job.wagePerHourInCents / 100).toFixed(2)}
              </Text>
            </View>

            {Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                {job.requirements.map((req, idx) => (
                  <Text style={styles.sectionText} key={idx}>
                    - {req}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Report To</Text>
              <Text style={styles.sectionText}>
                {job.company.reportTo.name}
                {job.company.reportTo.phone
                  ? ` (${job.company.reportTo.phone})`
                  : ""}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Branch Info</Text>
              <Text style={styles.sectionText}>{job.branch}</Text>
              <Text style={styles.sectionText}>{job.branchPhoneNumber}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Shifts</Text>
              {job.shifts.map((shift, idx) => (
                <Text
                  style={[styles.sectionText, { marginBottom: 8 }]}
                  key={idx}
                >
                  {formatShift(shift)}
                </Text>
              ))}
            </View>
          </ScrollView>
        )}
        <View
          style={[
            styles.bottomButtonsContainer,
            Platform.OS === "web"
              ? {
                  position: "fixed",
                  margin: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 100,
                  paddingBottom: 16,
                  width: contentWidth,
                }
              : {},
          ]}
        >
          {isJobAccepted ? (
            <View style={styles.currentJobContainer}>
              <Text style={styles.currentJobText}>It is your current job</Text>
            </View>
          ) : (
            <>
              <Pressable style={styles.rejectBtn} onPress={handleRejectJob}>
                <Text style={styles.rejectBtnText}>
                  {isRejectLoading ? "Loading..." : "Reject Job"}
                </Text>
              </Pressable>
              <Pressable style={styles.acceptBtn} onPress={handleAcceptJob}>
                <Text style={styles.acceptBtnText}>
                  {isAcceptLoading ? "Loading..." : "Accept Job"}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 60,
    paddingBottom: 16,
  },
  goBack: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 8,
  },
  goBackText: {
    color: "#007AFF",
    fontSize: 20,
    fontWeight: "500",
  },
  scrollContent: {
    marginTop: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
    width: "100%",
  },
  image: {
    width: "100%",
    maxWidth: 400,
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#218c3a",
    letterSpacing: 0.5,
    textShadowColor: "rgba(215, 51, 51, 0.08)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  section: {
    width: "100%",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#007AFF",
  },
  sectionText: {
    fontSize: 15,
    color: "#222",
    marginBottom: 2,
  },
  sectionSubText: {
    fontSize: 13,
    color: "#888",
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: "500",
    marginBottom: 12,
    marginTop: 4,
    color: "#3b3b3b",
    textAlign: "center",
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  rejectBtn: {
    minWidth: 150,
    maxWidth: 200,
    marginHorizontal: 10,
    backgroundColor: "#fff0f0",
    borderWidth: 1.5,
    borderColor: "#e74c3c",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  rejectBtnText: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  acceptBtn: {
    minWidth: 150,
    maxWidth: 200,
    marginHorizontal: 10,
    backgroundColor: "#218c3a",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#218c3a",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  acceptBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  titleBox: {
    backgroundColor: "#e6f4ea",
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minWidth: 180,
  },
  currentJobContainer: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 10,
  },
  currentJobText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
