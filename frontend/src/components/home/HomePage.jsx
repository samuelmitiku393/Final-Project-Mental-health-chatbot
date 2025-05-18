import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #1a1f2b, #2a3245, #1e2a3a, #2f3645);
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 2rem;
  text-align: center;
  box-sizing: border-box;
  overflow-x: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 20% 50%,
      rgba(127, 209, 174, 0.15) 0%,
      transparent 40%
    );
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4rem;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  width: 100%;
  flex-wrap: wrap;
  z-index: 2;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const LeftSection = styled.div`
  max-width: 650px;
  flex: 1;
  text-align: left;
  animation: ${fadeIn} 0.8s ease-out forwards;

  @media (max-width: 1024px) {
    max-width: 100%;
    text-align: center;
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #7fd1ae, #9be7c7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.05em;

  span {
    display: block;
    font-size: 2.5rem;
    font-weight: 600;
    background: linear-gradient(to right, #a0a8c0, #d1d5e0);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;

    span {
      font-size: 2rem;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(160, 168, 192, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 90%;

  @media (max-width: 1024px) {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Description = styled.div`
  color: rgba(203, 213, 225, 0.9);
  font-size: 1.15rem;
  line-height: 1.8;
  margin-bottom: 3rem;
  position: relative;
  padding-left: 1.5rem;
  border-left: 3px solid rgba(127, 209, 174, 0.5);

  @media (max-width: 1024px) {
    border-left: none;
    padding-left: 0;
    text-align: center;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(30, 37, 51, 0.6);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  backdrop-filter: blur(8px);
  text-align: left;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: ${(props) => props.delay || "0s"};

  &:hover {
    background: rgba(40, 47, 61, 0.8);
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(127, 209, 174, 0.3);
  }

  &:nth-child(1) {
    animation-delay: 0.2s;
  }
  &:nth-child(2) {
    animation-delay: 0.4s;
  }
  &:nth-child(3) {
    animation-delay: 0.6s;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #7fd1ae, #5db391);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(30, 37, 51, 0.7);
  border: 1px solid rgba(127, 209, 174, 0.2);
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #f8fafc;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: rgba(160, 168, 192, 0.8);
  font-size: 1rem;
  line-height: 1.6;
`;

const Button = styled.button`
  background: linear-gradient(to right, #7fd1ae, #5db391);
  color: #1e2533;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(127, 209, 174, 0.4);
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #6dc0a0, #4ca181);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(127, 209, 174, 0.5);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const RightSection = styled.div`
  flex: 1;
  max-width: 600px;
  width: 100%;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out forwards;

  @media (max-width: 1024px) {
    margin-top: 2rem;
    max-width: 500px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${float} 6s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(127, 209, 174, 0.2) 0%,
      transparent 50%
    );
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  @media (max-width: 768px) {
    height: 350px;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(127, 209, 174, 0.1);
  filter: blur(40px);

  &:nth-child(1) {
    width: 300px;
    height: 300px;
    top: -50px;
    right: -100px;
  }

  &:nth-child(2) {
    width: 200px;
    height: 200px;
    bottom: 50px;
    left: -50px;
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <Container>
      <FloatingElements>
        <FloatingCircle />
        <FloatingCircle />
      </FloatingElements>

      <ContentWrapper>
        <LeftSection>
          <Header>
            <Title>
              Mental Health Support
              <span>For Haramaya University</span>
            </Title>
          </Header>

          <Description>
            Our innovative platform combines cutting-edge AI technology with
            professional therapist matching to provide comprehensive,
            personalized mental health support tailored specifically for the
            university community.
          </Description>

          <FeaturesGrid>
            <FeatureCard delay="0.2s">
              <FeatureIcon>🤖</FeatureIcon>
              <FeatureTitle>AI Chat Assistant</FeatureTitle>
              <FeatureDescription>
                Engage in confidential, 24/7 conversations with our advanced
                mental health AI, trained to provide immediate support and
                guidance.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard delay="0.4s">
              <FeatureIcon>👩‍⚕️</FeatureIcon>
              <FeatureTitle>Counselor Matching</FeatureTitle>
              <FeatureDescription>
                Our intelligent system connects you with university-approved
                counselors perfectly matched to your specific needs and
                preferences.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard delay="0.6s">
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>Progress Tracking</FeatureTitle>
              <FeatureDescription>
                Visualize and understand your mental health journey with
                personalized insights and progress analytics.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>

          <Button onClick={handleGetStarted}>
            Get Started
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="#1e2533"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </LeftSection>

        <RightSection>
          <ImageContainer>
            <img
              src="/assets/logo.png"
              alt="Mental health support illustration"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1593814681464-eef5af2b0628?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
              }}
            />
          </ImageContainer>
        </RightSection>
      </ContentWrapper>
    </Container>
  );
};

export default HomePage;
