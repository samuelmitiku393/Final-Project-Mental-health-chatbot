import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ResourceCard from "./ResourceCard";
import axios from "axios";

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

const SearchBar = styled.div`
  display: flex;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #667eea;
    }
  }
`;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background: ${({ active }) => (active ? "#667eea" : "white")};
  color: ${({ active }) => (active ? "white" : "#333")};
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background: ${({ active }) => (active ? "#5a6fd1" : "#f5f5f5")};
  }
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  color: #e53e3e;
  background: #fff5f5;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ResourceLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResourcesAndCategories = async () => {
      try {
        setLoading(true);

        // Fetch resources
        const resourcesResponse = await axios.get(
          "http://localhost:8000/api/resources"
        );
        setResources(resourcesResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:8000/api/resources/categories"
        );
        setCategories(["all", ...categoriesResponse.data.categories]);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch resources");
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResourcesAndCategories();
  }, []);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeFilter === "all" || resource.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container>
        <Title>Self-Help Resource Library</Title>
        <LoadingMessage>Loading resources...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Self-Help Resource Library</Title>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Self-Help Resource Library</Title>

      <SearchBar>
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <FilterButtons>
        {categories.map((category) => (
          <FilterButton
            key={category}
            active={activeFilter === category}
            onClick={() => setActiveFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </FilterButtons>

      <ResourcesGrid>
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <p>No resources found matching your criteria.</p>
        )}
      </ResourcesGrid>
    </Container>
  );
};

export default ResourceLibrary;
