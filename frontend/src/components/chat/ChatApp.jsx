import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { useAuth } from "../auth/AuthContext";
import { debounce } from "lodash";
import CrisisHelpLine from "../crisisHelpLine/CrisisHelpLine";

// Modern animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
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
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${gradientBackground}
  padding: 24px 16px;
  width: 96px;
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  animation: ${slideIn} 0.3s ease-out forwards;
  position: relative;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
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
`;

const ButtonLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  transition: all 0.2s ease;
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
  ${gradientBackground}
  padding: 12px 24px;
  height: 72px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: fixed;
  top: 0;
  left: ${({ $isMobile }) => ($isMobile ? "0" : "96px")};
  right: 0;
  z-index: 99;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  justify-content: ${({ $isMobile }) =>
    $isMobile ? "space-between" : "flex-end"};
  align-items: center;
  width: ${({ $isMobile }) => ($isMobile ? "100%" : "calc(100% - 96px)")};

  @media (max-width: 768px) {
    left: 0;
    width: 100%;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  ${gradientBackground}
  margin-left: 96px;
  width: calc(100% - 96px);
  position: relative;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    margin-top: 72px;
    height: calc(100vh - 72px);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 32px;
  animation: ${fadeIn} 0.3s ease-out;
  margin-top: 72px;
  overflow-y: auto;
  height: calc(100% - 72px);

  @media (max-width: 768px) {
    padding: 24px 16px;
    width: 100%;
    margin-top: 0;
    height: 100%;
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

const DropdownMenu = styled.div`
  position: fixed;
  top: 84px;
  right: 24px;
  background: rgba(30, 37, 51, 0.98);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  z-index: 100;
  animation: ${slideInRight} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  min-width: 240px;
  transform-origin: top right;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 14px 16px;
  background: ${({ $active }) =>
    $active ? "rgba(74, 144, 226, 0.2)" : "transparent"};
  border: none;
  border-radius: 12px;
  color: ${({ $active }) => ($active ? "#4a90e2" : "rgba(255, 255, 255, 0.8)")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    background: rgba(74, 144, 226, 0.15);
    color: #4a90e2;
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(4px) scale(0.98);
  }
`;

const DropdownItemIcon = styled.span`
  font-size: 22px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
`;

const MenuBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 99;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  animation: ${fadeIn} 0.2s ease-out;
`;

function ChatApp() {
  const [activeTab, setActiveTab] = useState("chat");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
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
        label: "📊",
        title: "Mood Logger",
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

  // Set active tab based on current route
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path && tabs.some((tab) => tab.key === path)) {
      setActiveTab(path);
    } else {
      // Default to chat if no valid path
      navigate("/app/chat", { replace: true });
    }
  }, [location.pathname, tabs, navigate]);

  const handleResize = useCallback(
    debounce(() => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setDropdownOpen(false);
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
      setDropdownOpen(false);
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

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !event.target.closest("#dropdown-menu") &&
        !event.target.closest("#menu-toggle")
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <AppWrapper>
      {/* Top bar - visible on all screens */}
      <TopBar $isMobile={isMobile}>
        {isMobile && <AppTitle>Mental Health Chatbot</AppTitle>}
        {isMobile ? (
          <ToggleButton
            id="menu-toggle"
            onClick={toggleDropdown}
            aria-label={isDropdownOpen ? "Close menu" : "Open menu"}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            {isDropdownOpen ? "✕" : "☰"}
          </ToggleButton>
        ) : (
          <AppTitle>Mental Health Chatbot</AppTitle>
        )}
      </TopBar>

      {/* Sidebar - only visible on desktop */}
      {!isMobile && (
        <Sidebar>
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
          </LogoutButton>
        </Sidebar>
      )}

      {/* Mobile dropdown menu with backdrop */}
      {isMobile && (
        <>
          <MenuBackdrop
            $isOpen={isDropdownOpen}
            onClick={() => setDropdownOpen(false)}
          />
          <DropdownMenu id="dropdown-menu" $isOpen={isDropdownOpen}>
            {tabs.map(({ key, label, title, ariaLabel }) => (
              <DropdownItem
                key={key}
                $active={activeTab === key}
                onClick={() => handleTabChange(key)}
                aria-label={ariaLabel}
                aria-current={activeTab === key ? "page" : undefined}
              >
                <DropdownItemIcon>{label}</DropdownItemIcon>
                {title}
                {activeTab === key && (
                  <span style={{ marginLeft: "auto" }}>✓</span>
                )}
              </DropdownItem>
            ))}
            <DropdownDivider />
            <DropdownItem
              onClick={handleLogout}
              aria-label="Logout"
              disabled={isLoggingOut}
              style={{ color: "#ff6b6b" }}
            >
              <DropdownItemIcon>⎋</DropdownItemIcon>
              Logout
              {isLoggingOut && (
                <span style={{ marginLeft: "auto" }}>
                  <LoadingSpinner
                    style={{
                      width: "16px",
                      height: "16px",
                      borderWidth: "2px",
                      margin: "0",
                    }}
                  />
                </span>
              )}
            </DropdownItem>
          </DropdownMenu>
        </>
      )}

      {/* Main content area */}
      <MainContent>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainContent>

      {/* Crisis Help Line - always available */}
      <CrisisHelpLine />

      {/* Loading overlay */}
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
