// src/components/ResourceLibrary/ResourceCard.js
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: ${({ type }) =>
    type === "article"
      ? "#667eea"
      : type === "video"
      ? "#f56565"
      : type === "app"
      ? "#48bb78"
      : type === "book"
      ? "#ed8936"
      : type === "crisis"
      ? "#e53e3e"
      : "#9f7aea"};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 18px;
`;

const Source = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 10px 0;
`;

const Description = styled.p`
  color: #555;
  font-size: 14px;
  flex-grow: 1;
  margin-bottom: 15px;
`;

const Link = styled.a`
  display: inline-block;
  padding: 8px 16px;
  background: #f0f4ff;
  color: #667eea;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #e0e7ff;
  }
`;

const ResourceCard = ({ resource }) => {
  return (
    <Card>
      <TypeBadge type={resource.type}>{resource.type}</TypeBadge>
      <Title>{resource.title}</Title>
      <Source>{resource.source}</Source>
      <Description>{resource.description}</Description>
      <Link href={resource.url} target="_blank" rel="noopener noreferrer">
        View Resource
      </Link>
    </Card>
  );
};

export default ResourceCard;
