import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 2rem;
  text-align: center;
`;

const Header = styled(motion.div)`
  margin-bottom: 3rem;
  max-width: 800px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #7dd3fc, #38bdf8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #94a3b8;
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

const FeatureCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(30, 41, 59, 0.8);
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #38bdf8;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #f8fafc;
`;

const FeatureDescription = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
`;

const Button = styled(motion.button)`
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    background: linear-gradient(to right, #2563eb, #4f46e5);
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /app after 5 seconds if user doesn't interact
    const timer = setTimeout(() => {
      navigate("/app");
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/app");
  };

  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Mental Health Support Platform</Title>
        <Subtitle>AI-powered mental wellness at your fingertips</Subtitle>
      </Header>

      <Description>
        Our platform combines advanced AI technology with professional therapist
        matching to provide personalized mental health support. Whether you need
        immediate assistance or long-term care, we're here to help.
      </Description>

      <FeaturesGrid>
        <FeatureCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI Chat Assistant</FeatureTitle>
          <FeatureDescription>
            24/7 confidential conversations with our trained mental health AI
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <FeatureIcon>👩‍⚕️</FeatureIcon>
          <FeatureTitle>Therapist Matching</FeatureTitle>
          <FeatureDescription>
            Connect with licensed professionals tailored to your needs
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Progress Tracking</FeatureTitle>
          <FeatureDescription>
            Monitor your mental health journey with personalized insights
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <Button
        onClick={handleGetStarted}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started →
      </Button>
    </Container>
  );
};

export default HomePage;
