import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  useTheme,
  styled,
} from "@mui/material";

const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  backgroundImage: "none",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
  height: "100%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const AdminHome = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <DashboardPaper elevation={3}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 3,
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
            fontSize: { xs: "0.95rem", sm: "1rem" },
          }}
        >
          Manage all aspects of the Mental Health Chatbot system. Monitor user
          activity, therapist engagements, and resource utilization.
        </Typography>
        <Divider sx={{ mb: 4, borderColor: theme.palette.divider }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FeatureCard elevation={0}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.primary.main,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1.5,
                  }}
                >
                  👥
                </Box>
                User Management
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                View, edit, or remove users. Approve therapist applications and
                assign roles.
              </Typography>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FeatureCard elevation={0}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.primary.main,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1.5,
                  }}
                >
                  🧠
                </Box>
                Therapist Portal
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Approve new therapists, verify credentials, and monitor active
                sessions.
              </Typography>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FeatureCard elevation={0}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.primary.main,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1.5,
                  }}
                >
                  📚
                </Box>
                Resources
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Add or update mental health resources, articles, and educational
                content.
              </Typography>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FeatureCard elevation={0}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.primary.main,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1.5,
                  }}
                >
                  📊
                </Box>
                Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Track usage statistics, chatbot interactions, and user feedback.
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </DashboardPaper>
    </Box>
  );
};

export default AdminHome;
