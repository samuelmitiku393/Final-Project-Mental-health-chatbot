import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  styled,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const StyledDrawer = styled(Drawer)({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    top: "64px",
    "@media (max-width: 600px)": {
      top: "56px",
    },
  },
});

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "& .MuiListItemIcon-root": {
      color: "white",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: "white",
    "& .MuiListItemIcon-root": {
      color: "white",
    },
  },
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1.5),
  padding: theme.spacing(1, 2),
  transition: "all 0.2s ease",
}));

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/" },
    { text: "Therapists", icon: <PersonIcon />, path: "/therapists" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Resources", icon: <SettingsIcon />, path: "/resources" },
  ];

  return (
    <StyledDrawer variant="permanent">
      <Toolbar />
      <Divider />
      <List sx={{ padding: 1.5 }}>
        {menuItems.map((item) => (
          <StyledListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ variant: "body1" }}
            />
          </StyledListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
