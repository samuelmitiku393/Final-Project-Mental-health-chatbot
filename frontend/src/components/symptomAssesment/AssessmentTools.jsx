// src/components/SymptomAssessment/AssessmentTools.js
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiCheckCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
  100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
`;

// Styled Components
const ToolContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
  border: 1px solid #e9edf5;
`;

const ToolHeader = styled.div`
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f2f7;
`;

const ToolTitle = styled.h3`
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToolSubtitle = styled.p`
  color: #718096;
  font-size: 1rem;
  line-height: 1.5;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #edf2f7;
  border-radius: 3px;
  margin: 25px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${(props) => props.progress}%;
  transition: width 0.5s ease;
  border-radius: 3px;
`;

const Question = styled.div`
  margin-bottom: 25px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const QuestionText = styled.p`
  font-weight: 500;
  margin-bottom: 15px;
  color: #2d3748;
  font-size: 1.1rem;
  line-height: 1.4;
`;

const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ checked }) => (checked ? "#f0f4ff" : "#f8fafc")};
  border: 1px solid ${({ checked }) => (checked ? "#667eea" : "#e2e8f0")};
  box-shadow: ${({ checked }) =>
    checked ? "0 4px 6px rgba(102, 126, 234, 0.1)" : "none"};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.15);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ checked }) => (checked ? "#667eea" : "transparent")};
    transition: background 0.3s ease;
  }

  input {
    margin-right: 12px;
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e0;
    border-radius: 50%;
    transition: all 0.2s ease;
    position: relative;

    &:checked {
      border-color: #667eea;
      background: #667eea;
      box-shadow: inset 0 0 0 3px white;
    }
  }

  span {
    font-size: 0.95rem;
    color: #4a5568;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 30px;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
    opacity: 0.95;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.7;
  }
`;

const ResultContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  border-left: 4px solid #667eea;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Interpretation = styled.div`
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  background: ${(props) => {
    if (props.severity === "severe") return "#fff5f5";
    if (props.severity === "moderate") return "#fffaf0";
    return "#f0fff4";
  }};
  border-left: 4px solid
    ${(props) => {
      if (props.severity === "severe") return "#f56565";
      if (props.severity === "moderate") return "#ed8936";
      return "#48bb78";
    }};
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const Disclaimer = styled.div`
  font-size: 0.85rem;
  color: #718096;
  padding: 12px;
  background: #f7fafc;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
`;

// Data

const ASSESSMENT_DATA = {
  phq9: {
    title: "PHQ-9 Depression Assessment",
    description:
      "The PHQ-9 is a validated diagnostic tool for depression. Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead or of hurting yourself in some way",
    ],
    scoring:
      "Scores range from 0-27. Cutpoints: 5 (mild), 10 (moderate), 15 (moderately severe), 20 (severe).",
  },
  gad7: {
    title: "GAD-7 Anxiety Assessment",
    description:
      "The GAD-7 is a validated diagnostic tool for anxiety. Over the last 2 weeks, how often have you been bothered by the following problems?",
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ],
    scoring:
      "Scores range from 0-21. Cutpoints: 5 (mild), 10 (moderate), 15 (severe).",
  },
  pss10: {
    title: "Perceived Stress Scale (PSS-10)",
    description:
      "The PSS-10 measures the degree to which situations in your life are appraised as stressful. In the last month, how often have you:",
    questions: [
      "Been upset because of something that happened unexpectedly?",
      "Felt that you were unable to control the important things in your life?",
      "Felt nervous and 'stressed'?",
      "Felt confident about your ability to handle your personal problems? (reverse scored)",
      "Felt that things were going your way? (reverse scored)",
      "Found that you could not cope with all the things that you had to do?",
      "Been able to control irritations in your life? (reverse scored)",
      "Felt that you were on top of things? (reverse scored)",
      "Been angered because of things that happened that were outside of your control?",
      "Felt difficulties were piling up so high that you could not overcome them?",
    ],
    scoring:
      "Scores range from 0-40. 0-13 = low stress; 14-26 = moderate stress; 27-40 = high perceived stress.",
  },
};

const AssessmentTools = ({ tool }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [severity, setSeverity] = useState("");

  const {
    title,
    description,
    questions = [],
    scoring,
  } = ASSESSMENT_DATA[tool] || {};
  const totalQuestions = questions.length;
  const progress = Math.round(
    (Object.keys(answers).length / totalQuestions) * 100
  );

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setSeverity("");
  }, [tool]);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: parseInt(value) }));
  };

  const calculateScore = () => {
    let total = 0;
    if (tool === "pss10") {
      const reverseScoreIndices = [3, 4, 6, 7];
      Object.entries(answers).forEach(([index, value]) => {
        const val = parseInt(index);
        total += reverseScoreIndices.includes(val) ? 3 - value : value;
      });
    } else {
      total = Object.values(answers).reduce((acc, val) => acc + val, 0);
    }
    setScore(total);
    setSubmitted(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const getInterpretation = () => {
    if (tool === "phq9") {
      if (score <= 4) return "Minimal depression.";
      if (score <= 9) return "Mild depression.";
      if (score <= 14) return "Moderate depression.";
      if (score <= 19) return "Moderately severe depression.";
      return "Severe depression.";
    }
    if (tool === "gad7") {
      if (score <= 4) return "Minimal anxiety.";
      if (score <= 9) return "Mild anxiety.";
      if (score <= 14) return "Moderate anxiety.";
      return "Severe anxiety.";
    }
    if (tool === "pss10") {
      if (score <= 13) return "Low stress.";
      if (score <= 26) return "Moderate stress.";
      return "High perceived stress.";
    }
    return "";
  };

  useEffect(() => {
    if (submitted) getInterpretation();
  }, [submitted]);

  return (
    <ToolContainer>
      <ToolHeader>
        <ToolTitle>{title}</ToolTitle>
        <ToolSubtitle>{description}</ToolSubtitle>
      </ToolHeader>
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>
      {questions.map((q, index) => (
        <Question key={index}>
          <QuestionText>{q}</QuestionText>
          <Options>
            {[0, 1, 2, 3].map((value) => (
              <Option key={value} checked={answers[index] === value}>
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={value}
                  checked={answers[index] === value}
                  onChange={() => handleAnswerChange(index, value)}
                />
                <span>
                  {tool === "pss10"
                    ? ["Never", "Almost never", "Sometimes", "Often"][value]
                    : [
                        "Not at all",
                        "Several days",
                        "More than half",
                        "Nearly every day",
                      ][value]}
                </span>
              </Option>
            ))}
          </Options>
        </Question>
      ))}
      <SubmitButton disabled={progress < 100} onClick={calculateScore}>
        Submit Assessment
      </SubmitButton>
      {submitted && (
        <ResultContainer>
          <ScoreDisplay>
            <span>Total Score:</span>
            <ScoreValue>{score}</ScoreValue>
          </ScoreDisplay>
          <Interpretation severity={severity}>
            {severity === "severe" && (
              <FiAlertTriangle color="#e53e3e" size={20} />
            )}
            {severity === "moderate" && <FiInfo color="#dd6b20" size={20} />}
            {severity === "mild" && <FiCheckCircle color="#38a169" size={20} />}
            <div>{getInterpretation()}</div>
          </Interpretation>
          <Disclaimer>
            <FiInfo size={18} />
            This tool does not provide a diagnosis. For proper evaluation,
            consult a healthcare professional.
          </Disclaimer>
        </ResultContainer>
      )}
    </ToolContainer>
  );
};

export default AssessmentTools;
