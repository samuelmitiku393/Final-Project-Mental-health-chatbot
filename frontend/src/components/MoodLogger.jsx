import React, { useState } from "react";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Container = styled.div`
  background: #fefefe;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 28px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #4a5568;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const MoodScale = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 25px 0;
  gap: 10px;
`;

const MoodOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const Emoji = styled.span`
  font-size: 36px;
  margin-bottom: 6px;
  opacity: ${({ selected }) => (selected ? 1 : 0.5)};
  transform: ${({ selected }) => (selected ? "scale(1.3)" : "scale(1)")};
  transition: all 0.25s ease-in-out;
`;

const Label = styled.span`
  font-size: 13px;
  color: ${({ selected }) => (selected ? "#4c51bf" : "#718096")};
  font-weight: ${({ selected }) => (selected ? "600" : "normal")};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 20px;
  background: #f7fafc;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(120deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  width: 100%;
  transition: all 0.25s;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  color: #38a169;
  font-weight: 600;
  margin-top: 20px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-weight: 600;
  margin-top: 20px;
  text-align: center;
`;

const MoodLogger = () => {
  const { user } = useAuth();
  const [mood, setMood] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const moodOptions = [
    { emoji: "😭", label: "Awful", value: 1 },
    { emoji: "😞", label: "Bad", value: 2 },
    { emoji: "😐", label: "Okay", value: 3 },
    { emoji: "🙂", label: "Good", value: 4 },
    { emoji: "😁", label: "Great", value: 5 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axiosInstance.post(
        "/api/mood/log",
        { value: mood, notes },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMood(null);
        setNotes("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to log mood");
    }
  };

  return (
    <Container>
      <Title>Mood Tracker</Title>
      <Description>
        Logging your mood regularly can help you identify patterns in your
        emotions and better understand your mental health. Choose the emoji that
        best describes how you're feeling today, and optionally share a few
        words about what's on your mind.
        <br />
        <br />
        <strong>Why use this?</strong>
        <br />
        Tracking your mood daily provides insights into your emotional wellbeing
        and helps spot triggers or improvements over time. It’s like a journal
        for your feelings—quick, private, and powerful.
      </Description>

      <MoodScale>
        {moodOptions.map((option) => (
          <MoodOption key={option.value} onClick={() => setMood(option.value)}>
            <Emoji selected={mood === option.value}>{option.emoji}</Emoji>
            <Label selected={mood === option.value}>{option.label}</Label>
          </MoodOption>
        ))}
      </MoodScale>

      <form onSubmit={handleSubmit}>
        <TextArea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What's affecting your mood today? (Optional)"
        />

        <SubmitButton type="submit" disabled={mood === null || submitted}>
          {submitted ? "Mood Logged!" : "Log My Mood"}
        </SubmitButton>

        {submitted && (
          <SuccessMessage>
            🎉 Your mood has been recorded! View your progress in the analytics
            section.
          </SuccessMessage>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
    </Container>
  );
};

export default MoodLogger;
