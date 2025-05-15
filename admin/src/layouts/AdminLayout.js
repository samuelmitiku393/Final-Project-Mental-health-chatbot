import React from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AdminHome from "../pages/AdminHome";
import TherapistManagement from "../pages/TherapistManagement";
import UserManagement from "../pages/UserManagement";
import ResourceManagement from "../pages/ResourceManagement";
import { Routes, Route, Navigate } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: "100%", sm: "calc(100% - 240px)" },
          marginLeft: { xs: 0, sm: "240px" },
          marginTop: { xs: "56px", sm: "64px" },
          transition: "all 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/therapists" element={<TherapistManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/resources" element={<ResourceManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminLayout;
