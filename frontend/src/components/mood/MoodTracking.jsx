// src/components/MoodTracking/index.jsx
import React, { useState } from "react";
import styled from "styled-components";
import MoodLogger from "./MoodLogger";
import MoodAnalytics from "./MoodAnalytics";

const Container = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  background: #f5f7fa;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 10px 20px;
  background: ${({ active }) => (active ? "#667eea" : "transparent")};
  color: ${({ active }) => (active ? "white" : "#333")};
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${({ active }) => (active ? "#5a6fd1" : "#f0f0f0")};
  }
`;

const MoodTracking = () => {
  const [activeTab, setActiveTab] = useState("log");

  return (
    <Container>
      <Title>Mood Tracking & Analytics</Title>
      <Tabs>
        <Tab active={activeTab === "log"} onClick={() => setActiveTab("log")}>
          Log Mood
        </Tab>
        <Tab
          active={activeTab === "analytics"}
          onClick={() => setActiveTab("analytics")}
        >
          View Analytics
        </Tab>
      </Tabs>

      {activeTab === "log" ? <MoodLogger /> : <MoodAnalytics />}
    </Container>
  );
};

export default MoodTracking;
