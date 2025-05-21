import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import {
  FaPhoneAlt,
  FaGlobe,
  FaCalendarAlt,
  FaUserClock,
  FaLink,
  FaInfoCircle,
  FaLanguage,
  FaShieldAlt,
  FaVideo,
  FaNetworkWired,
  FaArrowLeft,
  FaEnvelope,
  FaStar,
} from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import LoadingSpinner from "../../shared/LoadingSpinner";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Gradient colors
const primaryGradient = "linear-gradient(135deg, #6e45e2, #88d3ce)";
const secondaryGradient = "linear-gradient(135deg, #88d3ce, #6e45e2)";

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(to bottom, #f8f9ff, #eef2ff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileCard = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  animation: ${fadeIn} 0.6s ease-out;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CardHeader = styled.div`
  background: ${primaryGradient};
  padding: 2rem;
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    transform: rotate(30deg);
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const Name = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Credentials = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  backdrop-filter: blur(5px);
`;

const Text = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${(props) => (props.light ? "rgba(255,255,255,0.9)" : "#4a5568")};
  line-height: 1.6;
  font-size: 0.95rem;
  z-index: 1;
`;

const Section = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #edf2f7;
  transition: all 0.3s ease;

  &:nth-child(odd) {
    border-right: 1px solid #edf2f7;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;

  h4 {
    margin: 0;
    font-size: 1.1rem;
    color: #2d3748;
    font-weight: 600;
  }

  svg {
    color: #6e45e2;
    font-size: 1rem;
  }
`;

const Badge = styled.span`
  background: ${(props) => (props.highlight ? "#6e45e2" : "#e0e7ff")};
  color: ${(props) => (props.highlight ? "white" : "#6e45e2")};
  padding: 0.4rem 0.8rem;
  margin: 0.3rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SectionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #4a5568;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;

  svg {
    color: #6e45e2;
    font-size: 0.95rem;
    flex-shrink: 0;
  }
`;

const LinkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;

  a {
    color: #6e45e2;
    text-decoration: none;
    background: #edf2f7;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background: #e0e7ff;
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

const ContactButton = styled.button`
  background: ${primaryGradient};
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(110, 69, 226, 0.3);

  &:hover {
    background: ${secondaryGradient};
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(110, 69, 226, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled.button`
  background: white;
  color: #6e45e2;
  border: 2px solid #e0e7ff;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  align-self: flex-start;

  &:hover {
    background: #f8fafc;
    border-color: #d1d8f0;
    transform: translateX(-5px);
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  background: #fff5f5;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 800px;
  width: 100%;
  margin: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.5s ease;
`;

const RatingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #fff4e5;
  color: #ff8c00;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${primaryGradient};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(110, 69, 226, 0.4);
  z-index: 10;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: scale(1.1) translateY(-5px);
    box-shadow: 0 8px 25px rgba(110, 69, 226, 0.5);
  }
`;

const TherapistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No therapist ID provided");
      setLoading(false);
      navigate("/app");
      return;
    }

    const fetchTherapist = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `http://localhost:8000/api/therapists/${id}`
        );
        if (!res.data) throw new Error("Therapist not found");
        setTherapist(res.data);

        // Check if therapist is in favorites (mock implementation)
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.includes(id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
        navigate("/app", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id, navigate]);

  const handleContact = () => {
    console.log("Contacting therapist:", therapist?.name);
    // In a real app, this would open a contact modal or email form
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (isFavorite) {
      const updatedFavorites = favorites.filter((favId) => favId !== id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      localStorage.setItem("favorites", JSON.stringify([...favorites, id]));
    }
    setIsFavorite(!isFavorite);
  };

  if (loading)
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Directory
          </BackButton>
        </ErrorMessage>
      </Container>
    );
  }

  if (!therapist) {
    return (
      <Container>
        <ErrorMessage>
          <h3>Profile Not Found</h3>
          <p>The requested therapist profile could not be found.</p>
          <BackButton onClick={() => navigate("/app/therapists")}>
            <FaArrowLeft /> Back to Directory
          </BackButton>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate("/app/therapists")}>
        <FaArrowLeft /> Back to Therapist Directory
      </BackButton>

      <ProfileCard>
        <CardHeader>
          <Photo
            src={
              therapist.photo ||
              "https://via.placeholder.com/100?text=Therapist"
            }
            alt={`${therapist.name}'s profile`}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/100?text=Therapist")
            }
          />
          <div>
            <Name>
              {therapist.name}
              {therapist.rating && (
                <RatingBadge>
                  <FaStar /> {therapist.rating}
                </RatingBadge>
              )}
            </Name>
            {therapist.credentials && (
              <Credentials>{therapist.credentials}</Credentials>
            )}
            <Text light>📍 {therapist.location}</Text>
          </div>
        </CardHeader>

        <Section>
          <LabelRow>
            <FaInfoCircle />
            <h4>About</h4>
          </LabelRow>
          <Text>{therapist.bio || "No bio available."}</Text>
        </Section>

        {therapist.specialties?.length > 0 && (
          <Section>
            <LabelRow>
              <FaNetworkWired />
              <h4>Specialties</h4>
            </LabelRow>
            <SectionGrid>
              {therapist.specialties.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </SectionGrid>
          </Section>
        )}

        {therapist.languages?.length > 0 && (
          <Section>
            <LabelRow>
              <FaLanguage />
              <h4>Languages</h4>
            </LabelRow>
            <SectionGrid>
              {therapist.languages.map((lang) => (
                <Badge key={lang}>{lang}</Badge>
              ))}
            </SectionGrid>
          </Section>
        )}

        {therapist.insurance?.length > 0 && (
          <Section>
            <LabelRow>
              <FaShieldAlt />
              <h4>Insurance</h4>
            </LabelRow>
            <SectionGrid>
              {therapist.insurance.map((ins) => (
                <Badge key={ins}>{ins}</Badge>
              ))}
            </SectionGrid>
          </Section>
        )}

        <Section>
          <LabelRow>
            <FaVideo />
            <h4>Services</h4>
          </LabelRow>
          <SectionGrid>
            {therapist.telehealth && (
              <Badge highlight>
                <FaVideo /> Telehealth
              </Badge>
            )}
            {therapist.in_person && (
              <Badge>
                <FaUserClock /> In-Person
              </Badge>
            )}
          </SectionGrid>
        </Section>

        {therapist.years_of_experience && (
          <Section>
            <LabelRow>
              <FaUserClock />
              <h4>Experience</h4>
            </LabelRow>
            <Text>{therapist.years_of_experience} years of experience</Text>
          </Section>
        )}

        {therapist.availability && therapist.availability.trim() !== "" && (
          <Section>
            <LabelRow>
              <FaCalendarAlt />
              <h4>Availability</h4>
            </LabelRow>
            <Text>{therapist.availability}</Text>
          </Section>
        )}

        {therapist.phone_number && (
          <Section>
            <LabelRow>
              <FaPhoneAlt />
              <h4>Contact</h4>
            </LabelRow>
            <InfoRow>
              <FaPhoneAlt />
              <a href={`tel:${therapist.phone_number}`}>
                {therapist.phone_number}
              </a>
            </InfoRow>
            {therapist.email && (
              <InfoRow>
                <FaEnvelope />
                <a href={`mailto:${therapist.email}`}>{therapist.email}</a>
              </InfoRow>
            )}
          </Section>
        )}

        {therapist.website && therapist.website !== "af" && (
          <Section>
            <LabelRow>
              <FaGlobe />
              <h4>Website</h4>
            </LabelRow>
            <a
              href={therapist.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {therapist.website.replace(/^https?:\/\//, "")}{" "}
              <FiExternalLink size={14} />
            </a>
          </Section>
        )}

        {therapist.social_links &&
          Object.keys(therapist.social_links).length > 0 && (
            <Section style={{ gridColumn: "1 / -1" }}>
              <LabelRow>
                <FaLink />
                <h4>Connect</h4>
              </LabelRow>
              <LinkList>
                {Object.entries(therapist.social_links).map(([key, link]) => (
                  <a
                    key={key}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {key} <FiExternalLink size={12} />
                  </a>
                ))}
              </LinkList>
            </Section>
          )}

        <Section style={{ gridColumn: "1 / -1" }}>
          <ContactButton onClick={handleContact}>
            <FaEnvelope /> Contact Therapist
          </ContactButton>
        </Section>
      </ProfileCard>

      <FloatingActionButton onClick={toggleFavorite}>
        <FaStar style={{ color: isFavorite ? "#ffd700" : "white" }} />
      </FloatingActionButton>
    </Container>
  );
};

export default TherapistProfile;
