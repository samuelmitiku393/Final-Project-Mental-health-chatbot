import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ChatApp from "./components/chat/ChatApp";
import TherapistProfile from "./components/therapist/TherapistProfile";
import PrivateRoute from "./shared/PrivateRoute";
import HomePage from "./components/home/HomePage";
import { AuthProvider } from "./components/auth/AuthContext";
import CrisisHelpLine from "./components/crisisHelpLine/CrisisHelpLine";

// Lazy-loaded components
const Chatbox = lazy(() => import("./components/chat/Chatbox"));
const SymptomAssessment = lazy(() =>
  import("./components/symptomAssesment/SymptomAssessment")
);
const MoodTracking = lazy(() => import("./components/mood/MoodTracking"));
const ResourceLibrary = lazy(() =>
  import("./components/resources/ResourceLibrary")
);
const TherapistDirectory = lazy(() =>
  import("./components/therapist/TherapistDirectory")
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main app routes with ChatApp layout */}
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <ChatApp />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div style={{ padding: 20, color: "#fff" }}>Loading...</div>
                  }
                >
                  <Chatbox />
                </Suspense>
              }
            />
            <Route
              path="chat"
              element={
                <Suspense
                  fallback={
                    <div style={{ padding: 20, color: "#fff" }}>Loading...</div>
                  }
                >
                  <Chatbox />
                </Suspense>
              }
            />
            <Route
              path="assessment"
              element={
                <Suspense
                  fallback={
                    <div style={{ padding: 20, color: "#fff" }}>Loading...</div>
                  }
                >
                  <SymptomAssessment />
                </Suspense>
              }
            />
            <Route
              path="mood"
              element={
                <Suspense
                  fallback={
                    <div style={{ padding: 20, color: "#fff" }}>Loading...</div>
                  }
                >
                  <MoodTracking />
                </Suspense>
              }
            />
            <Route
              path="resources"
              element={
                <Suspense
                  fallback={
                    <div style={{ padding: 20, color: "#fff" }}>Loading...</div>
                  }
                >
                  <ResourceLibrary />
                </Suspense>
              }
            />
            <Route
              path="therapists"
              element={
                <Suspense
                  fallback={
                    <div style={{ padding: 20, color: "#fff" }}>Loading...</div>
                  }
                >
                  <TherapistDirectory />
                </Suspense>
              }
            />
            <Route
              path="crisis"
              element={
                <Suspense
                  fallback={
                    <div style={{ padding: 20, color: "#fff" }}>Loading...</div>
                  }
                >
                  <CrisisHelpLine />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/therapists/:id"
            element={
              <PrivateRoute>
                <TherapistProfile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
