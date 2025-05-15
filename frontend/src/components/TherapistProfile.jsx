import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
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
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

const Container = styled.div`
  padding: 30px;
  background: #f5f7fa;
  min-height: 100vh;
  overflow: auto;
`;

const ProfileCard = styled.div`
  max-width: 800px;
  margin: auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  color: white;
`;

const Photo = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 1.8rem;
`;

const Text = styled.p`
  margin: 0 0 10px 0;
  color: #4a5568;
  line-height: 1.6;
`;

const Section = styled.div`
  padding: 20px 30px;
  border-top: 1px solid #edf2f7;
  background-color: ${(props) => (props.highlight ? "#f8fafc" : "white")};
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  h4 {
    margin: 0;
    font-size: 1.2rem;
    color: #2d3748;
  }

  svg {
    color: #3b4cca;
  }
`;

const Badge = styled.span`
  background: #e0e7ff;
  color: #3b4cca;
  padding: 6px 12px;
  margin: 5px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
`;

const SectionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a5568;
  margin-bottom: 10px;

  svg {
    color: #3b4cca;
  }
`;

const LinkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  a {
    color: #3b4cca;
    text-decoration: none;
    background: #edf2f7;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.95rem;

    &:hover {
      background: #e0e7ff;
    }
  }
`;

const ContactButton = styled.button`
  background: #3b4cca;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #2f3aa3;
  }
`;

const BackButton = styled.button`
  background: #f0f4ff;
  color: #3b4cca;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #e0e7ff;
    transform: translateX(-3px);
  }

  span {
    font-size: 1.2rem;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  background: #fff5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 800px;
  margin: auto;
`;

const TherapistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            <span>←</span> Back to Directory
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
          <BackButton onClick={() => navigate("/app")}>
            <span>←</span> Back to Directory
          </BackButton>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate("/app")}>
        <span>←</span> Back to Directory
      </BackButton>

      <ProfileCard>
        <CardHeader>
          <Photo
            src={
              therapist.photo ||
              "https://via.placeholder.com/120?text=Therapist"
            }
            alt={`${therapist.name}'s profile`}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/120?text=Therapist")
            }
          />
          <div>
            <Name>{therapist.name}</Name>
            <p>{therapist.credentials}</p>
            <p>📍 {therapist.location}</p>
          </div>
        </CardHeader>

        <Section highlight>
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
              <h4>Languages Spoken</h4>
            </LabelRow>
            <Text>{therapist.languages.join(", ")}</Text>
          </Section>
        )}

        {therapist.insurance?.length > 0 && (
          <Section>
            <LabelRow>
              <FaShieldAlt />
              <h4>Insurance Accepted</h4>
            </LabelRow>
            <Text>{therapist.insurance.join(", ")}</Text>
          </Section>
        )}

        {therapist.telehealth && (
          <Section>
            <LabelRow>
              <FaVideo />
              <h4>Available Services</h4>
            </LabelRow>
            <Badge style={{ background: "#48bb78", color: "white" }}>
              Telehealth Available
            </Badge>
          </Section>
        )}

        {therapist.years_of_experience && (
          <Section>
            <LabelRow>
              <FaUserClock />
              <h4>Experience</h4>
            </LabelRow>
            <InfoRow>
              <Text>{therapist.years_of_experience} years of experience</Text>
            </InfoRow>
          </Section>
        )}

        {therapist.availability && therapist.availability.trim() !== "" && (
          <Section>
            <LabelRow>
              <FaCalendarAlt />
              <h4>Availability</h4>
            </LabelRow>
            <InfoRow>
              <Text>{therapist.availability}</Text>
            </InfoRow>
          </Section>
        )}

        {therapist.phone_number && (
          <Section>
            <LabelRow>
              <FaPhoneAlt />
              <h4>Phone</h4>
            </LabelRow>
            <InfoRow>
              <Text>{therapist.phone_number}</Text>
            </InfoRow>
          </Section>
        )}

        {therapist.website && therapist.website !== "af" && (
          <Section>
            <LabelRow>
              <FaGlobe />
              <h4>Website</h4>
            </LabelRow>
            <InfoRow>
              <a
                href={therapist.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {therapist.website}
              </a>
            </InfoRow>
          </Section>
        )}

        {therapist.social_links &&
          Object.keys(therapist.social_links).length > 0 && (
            <Section>
              <LabelRow>
                <FaLink />
                <h4>Social Links</h4>
              </LabelRow>
              <LinkList>
                {Object.entries(therapist.social_links).map(([key, link]) => (
                  <a
                    key={key}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {key}
                  </a>
                ))}
              </LinkList>
            </Section>
          )}

        <Section>
          <ContactButton onClick={handleContact}>
            <FaLink /> Contact Therapist
          </ContactButton>
        </Section>
      </ProfileCard>
    </Container>
  );
};

export default TherapistProfile;
