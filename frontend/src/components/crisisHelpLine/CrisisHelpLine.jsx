import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaPhone,
  FaTimes,
  FaExclamationTriangle,
  FaHeart,
} from "react-icons/fa";
import { MdOutlinePsychology } from "react-icons/md";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const CrisisButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 15px 20px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(255, 94, 98, 0.4);
  z-index: 1000;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 94, 98, 0.5);
  }

  svg {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
    bottom: 16px;
    right: 16px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  animation: ${fadeIn} 0.3s ease;
  padding: 20px;
  box-sizing: border-box;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  padding: 25px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #333;
    transform: rotate(90deg);
  }
`;

const Title = styled.h2`
  color: #ff5e62;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  margin-right: 30px;
`;

const ResourceList = styled.div`
  margin: 20px 0;
`;

const ResourceItem = styled.div`
  background: #fff5f5;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:hover {
    background: #ffecec;
    transform: translateY(-2px);
  }
`;

const ResourceTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
`;

const ResourceDescription = styled.p`
  margin: 0 0 10px 0;
  color: #666;
  font-size: 0.9rem;
`;

const ResourceLink = styled.a`
  display: inline-block;
  background: #ff5e62;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 8px;

  &:hover {
    background: #ff4757;
    transform: translateY(-1px);
  }
`;

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const Disclaimer = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin-top: 20px;
  text-align: center;
`;

const CrisisHelpLine = () => {
  const [isOpen, setIsOpen] = useState(false);

  const crisisResources = [
    {
      name: "Abrhot Specialized Psychotherapy Center ",
      description:
        "Established by a group of young Ethiopian psychologists who were eager to see change in psychological practices in the country, especially in the quality of services delivered.",
      phone: "+251 91 199 8619",
      link: "https://web.facebook.com/abrhot/",
      icon: <FaHeart />,
    },
    {
      name: "Ethiopia Women Lawyers Association (EWLA)",
      description: "Ethiopia Women Lawyers Association (EWLA)",
      phone: "+251 11 508783",
      link: "https://ewla-et.org/",
      icon: <MdOutlinePsychology />,
    },

    {
      name: "Lebeza psychiatry consultation ",
      description:
        "Established with an aim and vision of providing quality mental health service in area of mental health promotion",
      phone: "+251 118 352929",
      link: "https://web.facebook.com/LebezaP/",
      icon: <FaExclamationTriangle />,
    },
    {
      name: "AWSAD Helpline (The Association for Women’s Sanctuary and Development) ",
      description:
        "AWSAD (Association for Women’s Sanctuary and Development) runs shelters for women and girl survivors of violence in Addis Ababa, Adama, Hawassa and Dessie.",
      phone: "+251 11 667 2290",
      link: "https://web.facebook.com/AWSADET/",
      icon: <MdOutlinePsychology />,
    },
  ];

  return (
    <>
      <CrisisButton onClick={() => setIsOpen(true)}>
        <FaExclamationTriangle /> Crisis Help
      </CrisisButton>

      {isOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsOpen(false)}>
              <FaTimes />
            </CloseButton>
            <Title>
              <FaExclamationTriangle /> Immediate Help Resources
            </Title>

            <ResourceList>
              {crisisResources.map((resource, index) => (
                <ResourceItem key={index}>
                  <ResourceTitle>
                    {resource.icon} {resource.name}
                  </ResourceTitle>
                  <ResourceDescription>
                    {resource.description}
                  </ResourceDescription>
                  <LinkContainer>
                    <ResourceLink
                      href={`tel:${resource.phone.replace(/\D/g, "")}`}
                    >
                      <FaPhone /> {resource.phone}
                    </ResourceLink>
                    {resource.link && (
                      <ResourceLink
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </ResourceLink>
                    )}
                  </LinkContainer>
                </ResourceItem>
              ))}
            </ResourceList>

            <Disclaimer>
              These resources are provided for immediate help. If you're in
              danger, please call emergency services.
            </Disclaimer>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default CrisisHelpLine;
