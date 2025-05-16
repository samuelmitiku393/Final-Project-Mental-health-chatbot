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
import LoadingSpinner from "../../shared/LoadingSpinner";

const Container = styled.div`
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ProfileCard = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 20px;
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
`;

const Photo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const Text = styled.p`
  margin: 0 0 8px 0;
  color: #4a5568;
  line-height: 1.4;
  font-size: 0.9rem;
`;

const Section = styled.div`
  padding: 15px;
  border-bottom: 1px solid #edf2f7;
  &:nth-child(odd) {
    border-right: 1px solid #edf2f7;
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  h4 {
    margin: 0;
    font-size: 1rem;
    color: #2d3748;
  }

  svg {
    color: #3b4cca;
    font-size: 0.9rem;
  }
`;

const Badge = styled.span`
  background: #e0e7ff;
  color: #3b4cca;
  padding: 4px 8px;
  margin: 3px;
  border-radius: 4px;
  font-size: 0.8rem;
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
  gap: 8px;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;

  svg {
    color: #3b4cca;
    font-size: 0.9rem;
  }
`;

const LinkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  a {
    color: #3b4cca;
    text-decoration: none;
    background: #edf2f7;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;

    &:hover {
      background: #e0e7ff;
    }
  }
`;

const ContactButton = styled.button`
  background: #3b4cca;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;

  &:hover {
    background: #2f3aa3;
  }
`;

const BackButton = styled.button`
  background: #f0f4ff;
  color: #3b4cca;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;

  &:hover {
    background: #e0e7ff;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  background: #fff5f5;
  padding: 15px;
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
              therapist.photo || "https://via.placeholder.com/80?text=Therapist"
            }
            alt={`${therapist.name}'s profile`}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/80?text=Therapist")
            }
          />
          <div>
            <Name>{therapist.name}</Name>
            <Text>{therapist.credentials}</Text>
            <Text>📍 {therapist.location}</Text>
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
            <Text>{therapist.languages.join(", ")}</Text>
          </Section>
        )}

        {therapist.insurance?.length > 0 && (
          <Section>
            <LabelRow>
              <FaShieldAlt />
              <h4>Insurance</h4>
            </LabelRow>
            <Text>{therapist.insurance.join(", ")}</Text>
          </Section>
        )}

        {therapist.telehealth && (
          <Section>
            <LabelRow>
              <FaVideo />
              <h4>Services</h4>
            </LabelRow>
            <Badge style={{ background: "#48bb78", color: "white" }}>
              Telehealth
            </Badge>
          </Section>
        )}

        {therapist.years_of_experience && (
          <Section>
            <LabelRow>
              <FaUserClock />
              <h4>Experience</h4>
            </LabelRow>
            <Text>{therapist.years_of_experience} years</Text>
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
              <h4>Phone</h4>
            </LabelRow>
            <Text>{therapist.phone_number}</Text>
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
              style={{ fontSize: "0.9rem" }}
            >
              {therapist.website}
            </a>
          </Section>
        )}

        {therapist.social_links &&
          Object.keys(therapist.social_links).length > 0 && (
            <Section style={{ gridColumn: "1 / -1" }}>
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

        <Section style={{ gridColumn: "1 / -1" }}>
          <ContactButton onClick={handleContact}>
            <FaLink /> Contact Therapist
          </ContactButton>
        </Section>
      </ProfileCard>
    </Container>
  );
};

export default TherapistProfile;
