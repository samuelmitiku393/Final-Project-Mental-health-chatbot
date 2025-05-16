import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1f2b 0%, #2f3645 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 3rem;
  max-width: 800px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  color: #7fd1ae;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #a0a8c0;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Description = styled.div`
  max-width: 700px;
  color: #cbd5e1;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(30, 37, 51, 0.9);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(30, 37, 51, 1);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #7fd1ae;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #f8fafc;
`;

const FeatureDescription = styled.p`
  color: #a0a8c0;
  font-size: 0.95rem;
`;

const Button = styled.button`
  background: linear-gradient(to right, #7fd1ae, #5db391);
  color: #1e2533;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(127, 209, 174, 0.3);

  &:hover {
    background: linear-gradient(to right, #6dc0a0, #4ca181);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(127, 209, 174, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login"); // Changed from "/app" to "/login"
  };

  return (
    <Container>
      <Header>
        <Title>Mental Health Support Platform</Title>
        <Subtitle>For Haramaya University</Subtitle>
      </Header>

      <Description>
        Our platform combines advanced AI technology with professional therapist
        matching to provide personalized mental health support for the
        university community.
      </Description>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI Chat Assistant</FeatureTitle>
          <FeatureDescription>
            24/7 confidential conversations with our trained mental health AI
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>👩‍⚕️</FeatureIcon>
          <FeatureTitle>Counselor Matching</FeatureTitle>
          <FeatureDescription>
            Connect with university counselors tailored to your needs
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Progress Tracking</FeatureTitle>
          <FeatureDescription>
            Monitor your mental health journey with personalized insights
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <Button onClick={handleGetStarted}>Get Started →</Button>
    </Container>
  );
};

export default HomePage;
