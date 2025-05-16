import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../auth/AuthContext";

const AppWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #2f3645;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #1e2533;
  padding: 20px;
  width: 80px;
  height: 100vh;
  transition: all 0.3s;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    height: auto;
    display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
    padding: 10px;
  }
`;

const NavButton = styled.button`
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  background: ${({ active }) =>
    active ? "rgba(255, 255, 255, 0.3)" : "transparent"};
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${({ isMobile }) => (isMobile ? "flex-start" : "center")};
  font-size: 18px;
  padding: ${({ isMobile }) => (isMobile ? "0 12px" : "0")};
  gap: 10px;
  transition: background-color 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 20px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  color: #ff6b6b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  gap: 8px;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.5);
  }
  &:active {
    transform: scale(0.98);
  }
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding: 0 12px;
    margin-top: 30px;
  }
`;

const LogoutIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const ToggleButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 26px;
  padding: 10px;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
  }
`;

const TopBar = styled.div`
  display: none;
  background-color: #1e2533;
  padding: 10px;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  @media (max-width: 768px) {
    height: auto;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

function ChatApp() {
  const [activeTab, setActiveTab] = useState("chat");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { key: "chat", label: "💬", title: "Chat" },
    { key: "assessment", label: "🩺", title: "Symptom Assessment" },
    { key: "mood", label: "😊", title: "Mood Tracking" },
    { key: "resources", label: "📚", title: "Resource Library" },
    { key: "therapists", label: "👩‍⚕️", title: "Therapist Directory" },
  ];

  useEffect(() => {
    const path = location.pathname.replace("/app/", "");
    if (path && tabs.some((tab) => tab.key === path)) {
      setActiveTab(path);
    }
  }, [location, tabs]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setMobileMenuOpen(false);
    navigate(`/app/${key}`);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <AppWrapper>
      {isMobile && (
        <TopBar>
          <div style={{ color: "#fff", fontSize: "20px" }}>
            Mental Health App
          </div>
          <ToggleButton onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? "✕" : "☰"}
          </ToggleButton>
        </TopBar>
      )}

      <Sidebar $isOpen={!isMobile || isMobileMenuOpen}>
        <div>
          {tabs.map(({ key, label, title }) => (
            <NavButton
              key={key}
              active={activeTab === key}
              onClick={() => handleTabChange(key)}
              title={title}
              isMobile={isMobile}
            >
              {label}
              {isMobile && <span style={{ fontSize: "16px" }}>{title}</span>}
            </NavButton>
          ))}
        </div>

        <LogoutButton onClick={handleLogout}>
          <LogoutIcon>⎋</LogoutIcon>
          {isMobile ? "Logout" : "Logout"}
        </LogoutButton>
      </Sidebar>

      <MainContent>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainContent>
    </AppWrapper>
  );
}

export default ChatApp;
