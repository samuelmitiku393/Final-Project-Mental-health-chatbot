// src/components/TherapistDirectory/SearchFilters.js
import React from "react";
import styled from "styled-components";

const FiltersContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const FilterGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  margin-left: 8px;
  font-size: 14px;
`;

const SearchFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <FiltersContainer>
      <FilterGroup>
        <Label>Location</Label>
        <Input
          type="text"
          name="location"
          placeholder="City or ZIP code"
          value={filters.location}
          onChange={handleChange}
        />
      </FilterGroup>

      <FilterGroup>
        <Label>Specialty</Label>
        <Input
          type="text"
          name="specialty"
          placeholder="e.g. Anxiety, Trauma, CBT"
          value={filters.specialty}
          onChange={handleChange}
        />
      </FilterGroup>

      <FilterGroup>
        <Label>Insurance</Label>
        <Input
          type="text"
          name="insurance"
          placeholder="e.g. Aetna, Blue Cross"
          value={filters.insurance}
          onChange={handleChange}
        />
      </FilterGroup>

      <FilterGroup>
        <Label>Language</Label>
        <Input
          type="text"
          name="language"
          placeholder="e.g. Spanish, Mandarin"
          value={filters.language}
          onChange={handleChange}
        />
      </FilterGroup>

      <FilterGroup>
        <CheckboxContainer>
          <input
            type="checkbox"
            name="telehealth"
            checked={filters.telehealth}
            onChange={handleChange}
          />
          <CheckboxLabel>Teletherapy Available</CheckboxLabel>
        </CheckboxContainer>
      </FilterGroup>
    </FiltersContainer>
  );
};

export default SearchFilters;
