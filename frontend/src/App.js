import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ChatApp from "./components/chat/ChatApp";
import TherapistProfile from "./components/therapist/TherapistProfile";
import PrivateRoute from "./shared/PrivateRoute";
import HomePage from "./components/home/HomePage"; // 👈 New HomePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <ChatApp />
            </PrivateRoute>
          }
        />
        <Route
          path="/therapists/:id"
          element={
            <PrivateRoute>
              <TherapistProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
