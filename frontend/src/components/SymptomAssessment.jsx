// src/components/SymptomAssessment/index.js
import React, { useState } from "react";
import styled from "styled-components";
import AssessmentTools from "./AssessmentTools";

const Container = styled.div`
  padding: 30px;
  height: 100%;
  overflow-y: auto;
  background: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1e2533; /* Secondary color */
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`;

const Description = styled.p`
  color: #555;
  margin-bottom: 30px;
  line-height: 1.8;
  font-size: 1.1rem;
  text-align: center;
`;

const ToolSelector = styled.div`
  display: flex;
  margin-bottom: 30px;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const ToolButton = styled.button`
  padding: 12px 20px;
  background: ${({ active }) => (active ? "#667eea" : "white")};
  color: ${({ active }) =>
    active ? "white" : "#1e2533"}; /* Secondary color */
  border: 2px solid ${({ active }) => (active ? "#667eea" : "#ddd")};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1.1rem;
  text-transform: uppercase;

  &:hover {
    background: ${({ active }) => (active ? "#5a6fd1" : "#f0f0f0")};
    border-color: ${({ active }) => (active ? "#5a6fd1" : "#ccc")};
  }
`;

const ToolDescription = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const SymptomAssessment = () => {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: "phq9",
      name: "PHQ-9 (Depression)",
      description:
        "The PHQ-9 is a widely used questionnaire to assess the severity of depressive symptoms over the last two weeks. It helps in identifying the presence of depression and monitoring its severity.",
    },
    {
      id: "gad7",
      name: "GAD-7 (Anxiety)",
      description:
        "The GAD-7 is a self-assessment tool designed to evaluate the severity of anxiety symptoms. It is used to screen for generalized anxiety disorder and measure anxiety levels.",
    },
    {
      id: "pss10",
      name: "PSS-10 (Stress)",
      description:
        "The PSS-10 is a tool for measuring perceived stress over the last month. It helps assess how unpredictable, uncontrollable, and overloaded a person feels, which are key factors in stress levels.",
    },
  ];

  const activeToolObj = tools.find((tool) => tool.id === activeTool);

  return (
    <Container>
      <Title>Symptom Assessment Tools</Title>
      <Description>
        These validated screening tools can help you better understand your
        symptoms. Please note these are not diagnostic tools, but can help track
        symptoms over time.
      </Description>

      <ToolSelector>
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            active={activeTool === tool.id}
            onClick={() => setActiveTool(tool.id)}
          >
            {tool.name}
          </ToolButton>
        ))}
      </ToolSelector>

      {activeTool && (
        <ToolDescription>
          <h3>{activeToolObj.name}</h3>
          <p>{activeToolObj.description}</p>
        </ToolDescription>
      )}

      {activeTool && <AssessmentTools tool={activeTool} />}
    </Container>
  );
};

export default SymptomAssessment;
