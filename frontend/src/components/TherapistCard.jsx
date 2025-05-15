import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #f0f2f7;
  align-items: center;
`;

const Photo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 3px solid #f0f4ff;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  margin: 0 0 5px 0;
  color: #2d3748;
  font-size: 1.1rem;
`;

const Credentials = styled.p`
  margin: 0 0 5px 0;
  color: #4a5568;
  font-size: 0.85rem;
  font-weight: 500;
`;

const Location = styled.p`
  margin: 0;
  color: #718096;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CardBody = styled.div`
  padding: 15px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SpecialtyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const Specialty = styled.span`
  background: #f0f4ff;
  color: #3b4cca;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Bio = styled.p`
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DetailsList = styled.div`
  margin-bottom: 15px;
  margin-top: auto;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 8px;
  font-size: 0.85rem;
  align-items: flex-start;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #4a5568;
  min-width: 80px;
`;

const DetailValue = styled.span`
  color: #718096;
  flex: 1;
`;

const TelehealthBadge = styled.span`
  display: inline-block;
  background: #48bb78;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #3b4cca;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  margin-top: auto;

  &:hover {
    background: #2f3aa3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TherapistCard = ({ therapist }) => {
  const navigate = useNavigate();
  const defaultPhoto =
    "https://cdn-icons-png.flaticon.com/512/3006/3006876.png";

  const handleViewProfile = () => {
    // Ensure therapist.id or therapist._id is present
    if (!therapist?.id && !therapist?._id) {
      console.error("Therapist ID is missing", therapist);
      return;
    }

    // Use the correct ID property, depending on your backend response
    const therapistId = therapist.id || therapist._id;

    navigate(`/therapists/${therapistId}`, {
      state: { from: window.location.pathname },
    });
  };

  return (
    <Card>
      <CardHeader>
        <Photo
          src={therapist.photo || defaultPhoto}
          alt={therapist.name}
          onError={(e) => {
            e.target.src = defaultPhoto;
          }}
        />
        <Info>
          <Name>{therapist.name}</Name>
          {therapist.credentials && (
            <Credentials>{therapist.credentials}</Credentials>
          )}
          {therapist.location && (
            <Location>
              <span>📍</span>
              {therapist.location}
            </Location>
          )}
        </Info>
      </CardHeader>

      <CardBody>
        {therapist.specialties?.length > 0 && (
          <SpecialtyList>
            {therapist.specialties.slice(0, 3).map((specialty) => (
              <Specialty key={specialty}>{specialty}</Specialty>
            ))}
            {therapist.specialties.length > 3 && (
              <Specialty>+{therapist.specialties.length - 3}</Specialty>
            )}
          </SpecialtyList>
        )}

        {therapist.bio && <Bio>{therapist.bio}</Bio>}

        <DetailsList>
          {therapist.languages?.length > 0 && (
            <DetailItem>
              <DetailLabel>Languages:</DetailLabel>
              <DetailValue>
                {therapist.languages.slice(0, 2).join(", ")}
                {therapist.languages.length > 2 && "..."}
              </DetailValue>
            </DetailItem>
          )}

          {therapist.insurance?.length > 0 && (
            <DetailItem>
              <DetailLabel>Insurance:</DetailLabel>
              <DetailValue>
                {therapist.insurance.slice(0, 2).join(", ")}
                {therapist.insurance.length > 2 && "..."}
              </DetailValue>
            </DetailItem>
          )}

          {therapist.telehealth && (
            <DetailItem>
              <DetailLabel>Services:</DetailLabel>
              <DetailValue>
                <TelehealthBadge>Teletherapy Available</TelehealthBadge>
              </DetailValue>
            </DetailItem>
          )}
        </DetailsList>

        <Button onClick={handleViewProfile}>View Full Profile</Button>
      </CardBody>
    </Card>
  );
};

TherapistCard.propTypes = {
  therapist: PropTypes.shape({
    id: PropTypes.string, // Changed to accept either `id` or `_id`
    _id: PropTypes.string, // Ensure the backend provides either `id` or `_id`
    name: PropTypes.string.isRequired,
    credentials: PropTypes.string,
    location: PropTypes.string,
    photo: PropTypes.string,
    specialties: PropTypes.arrayOf(PropTypes.string),
    bio: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    insurance: PropTypes.arrayOf(PropTypes.string),
    telehealth: PropTypes.bool,
  }).isRequired,
};

export default TherapistCard;
