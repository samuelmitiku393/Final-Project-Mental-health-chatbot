import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { useAuth } from "../auth/AuthContext";
import { debounce } from "lodash";

// Modern animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientBackground = css`
  background: linear-gradient(
    135deg,
    rgba(47, 54, 69, 0.95) 0%,
    rgba(30, 37, 51, 0.98) 100%
  );
  backdrop-filter: blur(20px);
`;

const AppWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  ${gradientBackground}
  color: #e0e0e0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${gradientBackground}
  padding: 24px 16px;
  width: 96px;
  height: 100vh;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  animation: ${slideIn} 0.3s ease-out forwards;

  @media (max-width: 768px) {
    width: 280px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
    ${({ $isOpen }) => $isOpen && `transform: translateX(0);`}
  }
`;

const NavButton = styled.button`
  width: 100%;
  height: 72px;
  margin-bottom: 8px;
  background: ${({ $active }) =>
    $active ? "rgba(74, 144, 226, 0.15)" : "transparent"};
  border: none;
  border-radius: 16px;
  color: ${({ $active }) => ($active ? "#4a90e2" : "rgba(255, 255, 255, 0.7)")};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  gap: 6px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(74, 144, 226, 0.1);
    color: #4a90e2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #4a90e2;
    outline-offset: 2px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #4a90e2;
    transform: ${({ $active }) => ($active ? "scaleY(1)" : "scaleY(0)")};
    transform-origin: top;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: flex-start;
    padding: 0 20px;
    height: 56px;
    font-size: 20px;
    border-radius: 12px;
  }
`;

const ButtonLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  transition: all 0.2s ease;
  @media (max-width: 768px) {
    font-size: 14px;
    margin-top: 0;
    margin-left: 16px;
    font-weight: 600;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  height: 56px;
  margin-top: 16px;
  background: rgba(255, 107, 107, 0.1);
  border: none;
  border-radius: 12px;
  color: #ff6b6b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  gap: 8px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #ff6b6b;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding: 0 20px;
    margin-top: 24px;
    height: 48px;
  }
`;

const LogoutIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const ToggleButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 24px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 101;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:focus-visible {
    outline: 2px solid #4a90e2;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TopBar = styled.div`
  display: none;
  ${gradientBackground}
  padding: 12px 24px;
  height: 72px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 99;
  animation: ${fadeIn} 0.3s ease-out;

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
  ${gradientBackground}
  @media (max-width: 768px) {
    height: calc(100vh - 72px);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 32px;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const AppTitle = styled.div`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(to right, #4a90e2, #6a5acd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.2s ease-out;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #4a90e2;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 99;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

function ChatApp() {
  const [activeTab, setActiveTab] = useState("chat");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = useMemo(
    () => [
      { key: "chat", label: "💬", title: "Chat", ariaLabel: "Chat" },
      {
        key: "assessment",
        label: "🩺",
        title: "Assessment",
        ariaLabel: "Symptom Assessment",
      },
      {
        key: "mood",
        label: "😊",
        title: "Mood",
        ariaLabel: "Mood Tracking",
      },
      {
        key: "resources",
        label: "📚",
        title: "Resources",
        ariaLabel: "Resource Library",
      },
      {
        key: "therapists",
        label: "👩‍⚕️",
        title: "Therapists",
        ariaLabel: "Therapist Directory",
      },
    ],
    []
  );

  useEffect(() => {
    const path = location.pathname.replace("/app/", "");
    if (path && tabs.some((tab) => tab.key === path)) {
      setActiveTab(path);
    }
  }, [location, tabs]);

  const handleResize = useCallback(
    debounce(() => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel();
    };
  }, [handleResize]);

  const handleTabChange = useCallback(
    (key) => {
      setActiveTab(key);
      setMobileMenuOpen(false);
      navigate(`/app/${key}`);
    },
    [navigate]
  );

  const handleLogout = useCallback(async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        setIsLoggingOut(true);
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        setIsLoggingOut(false);
      }
    }
  }, [logout, navigate]);

  return (
    <AppWrapper>
      {isMobile && (
        <>
          <TopBar>
            <AppTitle>MindCare</AppTitle>
            <ToggleButton
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </ToggleButton>
          </TopBar>
          <Overlay
            $isOpen={isMobileMenuOpen}
            onClick={() => setMobileMenuOpen(false)}
          />
        </>
      )}

      <Sidebar $isOpen={isMobileMenuOpen}>
        <nav aria-label="Main navigation">
          {tabs.map(({ key, label, title, ariaLabel }) => (
            <NavButton
              key={key}
              $active={activeTab === key}
              onClick={() => handleTabChange(key)}
              title={title}
              aria-label={ariaLabel}
              aria-current={activeTab === key ? "page" : undefined}
            >
              {label}
              <ButtonLabel>{title}</ButtonLabel>
            </NavButton>
          ))}
        </nav>

        <LogoutButton
          onClick={handleLogout}
          aria-label="Logout"
          disabled={isLoggingOut}
        >
          <LogoutIcon>⎋</LogoutIcon>
          {isMobile && "Logout"}
        </LogoutButton>
      </Sidebar>

      <MainContent>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainContent>

      {isLoggingOut && (
        <LoadingOverlay role="status" aria-live="polite">
          <LoadingSpinner />
          <p style={{ marginTop: "16px" }}>Logging out...</p>
        </LoadingOverlay>
      )}
    </AppWrapper>
  );
}

export default React.memo(ChatApp);
