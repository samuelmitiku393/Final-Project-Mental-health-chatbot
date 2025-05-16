// src/components/MoodTracking/MoodAnalytics.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

// ---------- Styled Components ----------
const Container = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  max-width: 1000px;
  margin: 0 auto;
`;

const MoodTitle = styled.h2`
  color: #2f3645;
  font-size: 28px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 25px;
`;

const ChartContainer = styled.div`
  margin-bottom: 30px;
  height: 320px;
`;

const StatsHeader = styled.h4`
  font-size: 18px;
  color: #444;
  margin-bottom: 10px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background: ${({ color }) => color || "#f7fafc"};
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: scale(1.03);
  }
`;

const StatValue = styled.div`
  font-size: 26px;
  font-weight: bold;
  color: ${({ color }) => color || "#667eea"};
  margin-bottom: 6px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #555;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  padding: 20px;
  text-align: center;
`;

// ---------- Component ----------
const MoodAnalytics = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const [chartResponse, statsResponse] = await Promise.all([
          axiosInstance.get("/api/mood/chart", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get("/api/mood/stats", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        const chartData = {
          labels: chartResponse.data.labels,
          datasets: [
            {
              label: "Mood Score",
              data: chartResponse.data.values,
              borderColor: "#667eea",
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#667eea",
            },
          ],
        };

        setMoodData(chartData);
        setStats(statsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch mood data");
        setLoading(false);
      }
    };

    if (user) {
      fetchMoodData();
    }
  }, [user]);

  if (loading) {
    return <LoadingMessage>Loading your mood trends...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <MoodTitle>Mood Analytics</MoodTitle>
      <Description>
        Tracking your mood can reveal patterns that help you improve your
        emotional well-being. These analytics give you insights into how your
        emotions change over time, what influences them, and how consistent
        you've been with self-check-ins.
      </Description>

      <ChartContainer>
        <Line
          data={moodData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Mood Progress Over Time",
                font: { size: 18 },
                color: "#333",
              },
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                min: 1,
                max: 5,
                ticks: {
                  stepSize: 1,
                  callback: (value) => {
                    const labels = [
                      "",
                      "Awful",
                      "Bad",
                      "Okay",
                      "Good",
                      "Great",
                    ];
                    return labels[value];
                  },
                  color: "#666",
                },
                title: {
                  display: true,
                  text: "Mood",
                  color: "#333",
                },
              },
              x: {
                ticks: {
                  color: "#666",
                },
              },
            },
          }}
        />
      </ChartContainer>

      <StatsHeader>Summary</StatsHeader>
      <StatsContainer>
        <StatCard>
          <StatValue>{stats?.average?.toFixed(1) || "N/A"}</StatValue>
          <StatLabel>Average Mood</StatLabel>
        </StatCard>
        <StatCard color="#fff7ed">
          <StatValue color="#ed8936">{stats?.highest || "N/A"}</StatValue>
          <StatLabel>Highest Mood</StatLabel>
        </StatCard>
        <StatCard color="#fff5f5">
          <StatValue color="#f56565">{stats?.lowest || "N/A"}</StatValue>
          <StatLabel>Lowest Mood</StatLabel>
        </StatCard>
        <StatCard color="#f0fff4">
          <StatValue color="#38a169">{stats?.count || "0"}</StatValue>
          <StatLabel>Entries This Week</StatLabel>
        </StatCard>
      </StatsContainer>
    </Container>
  );
};

export default MoodAnalytics;
