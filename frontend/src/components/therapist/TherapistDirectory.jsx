import React, { useState, useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import TherapistCard from "./TherapistCard";
import SearchFilters from "../search/SearchFilters";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const Container = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  background: #f5f7fa;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const TherapistsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const TherapistDirectory = () => {
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    location: "",
    specialty: "",
    insurance: "",
    language: "",
    telehealth: false,
  });

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTherapists = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = buildQueryParams(filters);
      const res = await axios.get(
        `http://localhost:8000/api/therapists?${query}`
      );
      setTherapists(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch therapists.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const buildQueryParams = (filters) => {
    const params = new URLSearchParams();
    if (filters.location) params.append("location", filters.location);
    if (filters.specialty) params.append("specialty", filters.specialty);
    if (filters.insurance) params.append("insurance", filters.insurance);
    if (filters.language) params.append("language", filters.language);
    if (filters.telehealth) params.append("telehealth", true);
    return params.toString();
  };

  useEffect(() => {
    fetchTherapists();
  }, [fetchTherapists]);

  return (
    <Container>
      <Title>Find a Therapist</Title>

      <SearchFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <p>Loading therapists...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : therapists.length > 0 ? (
        <TherapistsList>
          {therapists.map((therapist) => {
            console.log("Therapist info:", therapist);
            return (
              <TherapistCard
                key={therapist.id} // Ensure the key is set to therapist.id
                therapist={therapist}
              />
            );
          })}
        </TherapistsList>
      ) : (
        <NoResults>
          <h3>No therapists match your current filters</h3>
          <p>Try adjusting your search criteria</p>
        </NoResults>
      )}
    </Container>
  );
};

export default TherapistDirectory;
