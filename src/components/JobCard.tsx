import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { Image } from "expo-image";
import { Job } from "../types/user";
import { router } from "expo-router";
import { formatShift } from "../utils/formatShift";

interface JobCardProps {
  job: Job;
  isJobAccepted: boolean;
  onAcceptJob: () => void;
  onRejectJob: () => void;
}

const JobCard = ({
  job,
  isJobAccepted,
  onAcceptJob,
  onRejectJob,
}: JobCardProps) => {
  const [showAllShifts, setShowAllShifts] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let cardWidth;
  if (screenWidth <= 500) {
    cardWidth = screenWidth * 0.9;
  } else if (screenWidth <= 700) {
    cardWidth = 440;
  } else {
    cardWidth = 600;
  }

  const BUTTONS_HEIGHT = 80;
  const IMAGE_HEIGHT = 160;

  const CONTENT_MAX_HEIGHT = screenHeight * 0.9 - IMAGE_HEIGHT - BUTTONS_HEIGHT;

  const shiftsToShow = showAllShifts ? job.shifts : job.shifts.slice(0, 2);
  const hasMoreShifts = Array.isArray(job.shifts) && job.shifts.length > 2;

  const handleCardPress = () => {
    router.push({
      pathname: "/jobInfo",
      params: { jobId: job.jobId, isJobAccepted: String(isJobAccepted) },
    });
  };

  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          borderRadius: 12,
          alignSelf: "center",
          maxHeight: screenHeight * 0.8,
        },
      ]}
    >
      <View
        style={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          overflow: "hidden",
        }}
      >
        <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
          <Image
            style={styles.image}
            source={job.jobTitle.imageUrl}
            contentFit="cover"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ maxHeight: CONTENT_MAX_HEIGHT }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
          <View style={styles.content}>
            <Text style={styles.title}>{job.jobTitle.name}</Text>
            <Text style={styles.company}>{job.company.name}</Text>

            <View style={styles.rowGreen}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Distance</Text>
                <Text style={styles.distance}>
                  {job.milesToTravel.toFixed(1)} miles
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.label}>Hourly Rate</Text>
                <Text style={styles.rate}>
                  ${(job.wagePerHourInCents / 100).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🗓 Shift Dates</Text>
              <View style={{ marginTop: 6 }}>
                {shiftsToShow.map((shift, idx) => (
                  <Text
                    style={[styles.sectionText, { marginBottom: 8 }]}
                    key={idx}
                  >
                    {formatShift(shift)}
                  </Text>
                ))}
              </View>
              {hasMoreShifts && !showAllShifts && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setShowAllShifts(true);
                  }}
                  style={styles.showMoreButton}
                >
                  <Text style={styles.showMoreText}>Show more shifts</Text>
                </TouchableOpacity>
              )}
              {hasMoreShifts && showAllShifts && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setShowAllShifts(false);
                  }}
                  style={styles.showMoreButton}
                >
                  <Text style={styles.showMoreText}>Hide shifts</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Location</Text>
              <Text style={styles.sectionText}>
                {job.company.address.formattedAddress}
              </Text>
              <Text style={styles.sectionSubText}>
                {job.milesToTravel.toFixed(2)} miles from your job search
                location
              </Text>
            </View>

            {Array.isArray(job?.requirements) &&
              job.requirements.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🛠 Requirements</Text>
                  {job.requirements.map((req, idx) => (
                    <Text style={styles.sectionText} key={idx}>
                      - {req}
                    </Text>
                  ))}
                </View>
              )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👤 Report To</Text>
              <Text style={styles.sectionText}>
                {job.company.reportTo.name} ({job.branchPhoneNumber})
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {isJobAccepted ? (
        <View style={[styles.buttonRow, styles.currentJobContainer]}>
          <Text style={styles.currentJobText}>It is your current job</Text>
        </View>
      ) : (
        <View
          style={[
            styles.buttonRow,
            {
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.noBtn}
            onPress={(e) => {
              e.stopPropagation();
              onRejectJob();
            }}
          >
            <Text style={styles.noBtnText}>No Thanks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.yesBtn}
            onPress={(e) => {
              e.stopPropagation();
              onAcceptJob();
            }}
          >
            <Text style={styles.yesBtnText}>I will Take it</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  company: {
    fontSize: 16,
    color: "#222",
    marginBottom: 12,
  },
  rowGreen: {
    flexDirection: "row",
    backgroundColor: "#6ee7b7",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#222",
    fontWeight: "600",
  },
  distance: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#222",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rate: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#222",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  sectionText: {
    paddingVertical: 4,
    fontSize: 14,
    color: "#222",
  },
  sectionSubText: {
    fontSize: 12,
    color: "#888",
  },
  buttonRow: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  noBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 6,
    marginRight: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  noBtnText: {
    color: "#bbb",
    fontWeight: "bold",
    fontSize: 16,
  },
  yesBtn: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#111",
  },
  yesBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  currentJobContainer: {
    backgroundColor: "#4CAF50",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  currentJobText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  showMoreButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    width: "80%",
    alignSelf: "center",
  },
  showMoreText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
