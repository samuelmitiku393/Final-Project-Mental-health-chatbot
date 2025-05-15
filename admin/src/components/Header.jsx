import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  useTheme,
  styled,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
  transition: "all 0.3s ease",
}));

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ px: { xs: 1.5, sm: 3 } }}>
        <MedicalServicesIcon sx={{ mr: 2, fontSize: { xs: 24, sm: 30 } }} />
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: { xs: 0.2, sm: 0.5 },
            fontSize: { xs: "0.9rem", sm: "1.25rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          HU Mental Health Admin
        </Typography>
        {user && (
          <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{
                  ml: 1,
                  display: { xs: "none", md: "block" },
                  fontWeight: 500,
                }}
              >
                {user.name}
              </Typography>
            </Box>
            <IconButton
              color="inherit"
              onClick={logout}
              sx={{
                p: 0.8,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
              aria-label="logout"
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
