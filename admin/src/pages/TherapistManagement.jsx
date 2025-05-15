import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const TherapistManagement = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    credentials: "",
    specialties: "",
    location: "",
    languages: "",
    insurance: "",
    telehealth: false,
    photo: "",
    bio: "",
    phone_number: "",
    website: "",
    social_links: "",
    years_of_experience: "",
    availability: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    credentials: false,
    specialties: false,
    location: false,
    languages: false,
    insurance: false,
    bio: false,
    phone_number: false,
    years_of_experience: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const requiredFields = [
    "name",
    "credentials",
    "specialties",
    "location",
    "languages",
    "insurance",
    "bio",
    "phone_number",
    "years_of_experience",
  ];

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        errors[field] = true;
        isValid = false;
      } else {
        errors[field] = false;
      }
    });

    if (isNaN(formData.years_of_experience)) {
      errors.years_of_experience = true;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const fetchTherapists = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/therapists", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTherapists(res.data);
      setError(null);
    } catch (err) {
      let errorMessage = "Failed to fetch therapists.";
      if (err.response) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      }
      setError(errorMessage);
      setTherapists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleDialogOpen = (therapist = null) => {
    if (therapist) {
      setFormData({
        name: therapist.name,
        credentials: therapist.credentials,
        specialties: therapist.specialties.join(", "),
        location: therapist.location,
        languages: therapist.languages.join(", "),
        insurance: therapist.insurance.join(", "),
        telehealth: therapist.telehealth,
        photo: therapist.photo,
        bio: therapist.bio,
        phone_number: therapist.phone_number || "",
        website: therapist.website || "",
        social_links: therapist.social_links
          ? Object.values(therapist.social_links).join(", ")
          : "",
        years_of_experience: therapist.years_of_experience || "",
        availability: therapist.availability || "",
      });
      setEditingId(therapist.id);
    } else {
      setFormData({
        name: "",
        credentials: "",
        specialties: "",
        location: "",
        languages: "",
        insurance: "",
        telehealth: false,
        photo: "",
        bio: "",
        phone_number: "",
        website: "",
        social_links: "",
        years_of_experience: "",
        availability: "",
      });
      setEditingId(null);
    }
    setFormErrors({
      name: false,
      credentials: false,
      specialties: false,
      location: false,
      languages: false,
      insurance: false,
      bio: false,
      phone_number: false,
      years_of_experience: false,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({
      name: "",
      credentials: "",
      specialties: "",
      location: "",
      languages: "",
      insurance: "",
      telehealth: false,
      photo: "",
      bio: "",
      phone_number: "",
      website: "",
      social_links: "",
      years_of_experience: "",
      availability: "",
    });
    setEditingId(null);
  };

  const parseFormData = () => {
    // Convert comma-separated strings into arrays where needed
    const socialLinksArray = formData.social_links
      .split(",")
      .map((s) => s.trim());
    const socialLinksObj = {};
    socialLinksArray.forEach((link, index) => {
      if (link) socialLinksObj[`link${index}`] = link;
    });

    return {
      name: formData.name.trim(),
      credentials: formData.credentials.trim(),
      specialties: formData.specialties.split(",").map((s) => s.trim()),
      location: formData.location.trim(),
      languages: formData.languages.split(",").map((l) => l.trim()),
      insurance: formData.insurance.split(",").map((i) => i.trim()),
      telehealth: formData.telehealth,
      photo: formData.photo.trim(),
      bio: formData.bio.trim(),
      phone_number: formData.phone_number.trim(),
      website: formData.website.trim(),
      social_links: socialLinksObj,
      years_of_experience: parseInt(formData.years_of_experience) || 0,
      availability: formData.availability.trim(),
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields with valid data",
        severity: "error",
      });
      return;
    }

    const payload = parseFormData();
    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/therapists/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbar({
          open: true,
          message: "Therapist updated successfully",
          severity: "success",
        });
      } else {
        await axios.post("http://localhost:8000/api/therapists", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({
          open: true,
          message: "Therapist created successfully",
          severity: "success",
        });
      }
      fetchTherapists();
      handleDialogClose();
    } catch (error) {
      let errorMessage = "Operation failed";
      if (error.response) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/therapists/${deleteConfirmId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSnackbar({
        open: true,
        message: "Therapist deleted successfully",
        severity: "success",
      });
      setDeleteConfirmId(null);
      fetchTherapists();
    } catch (error) {
      let errorMessage = "Failed to delete therapist";
      if (error.response) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const isSubmitDisabled = () => {
    return requiredFields.some((field) => {
      if (field === "years_of_experience") {
        return !formData[field] || isNaN(formData[field]);
      }
      return !formData[field] || formData[field].toString().trim() === "";
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Therapist Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => handleDialogOpen()}
      >
        Add Therapist
      </Button>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          {therapists.map((t) => (
            <Grid item xs={12} sm={6} md={4} key={t.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t.name}</Typography>
                  <Typography color="textSecondary">
                    {t.specialties.join(", ")}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {t.credentials}
                  </Typography>
                  <Typography variant="body2">
                    Experience: {t.years_of_experience} years
                  </Typography>
                  <Typography variant="body2">
                    {t.telehealth ? "Telehealth Available" : "In-person Only"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleDialogOpen(t)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteConfirmId(t.id)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingId ? "Edit Therapist" : "Add Therapist"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
            * indicates required field
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name *"
                fullWidth
                margin="dense"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={formErrors.name}
                helperText={formErrors.name ? "Name is required" : ""}
                required
              />
              <TextField
                label="Credentials *"
                fullWidth
                margin="dense"
                value={formData.credentials}
                onChange={(e) =>
                  setFormData({ ...formData, credentials: e.target.value })
                }
                error={formErrors.credentials}
                helperText={
                  formErrors.credentials ? "Credentials are required" : ""
                }
                required
              />
              <TextField
                label="Specialties (comma-separated) *"
                fullWidth
                margin="dense"
                value={formData.specialties}
                onChange={(e) =>
                  setFormData({ ...formData, specialties: e.target.value })
                }
                error={formErrors.specialties}
                helperText={
                  formErrors.specialties
                    ? "At least one specialty is required"
                    : ""
                }
                required
              />
              <TextField
                label="Location *"
                fullWidth
                margin="dense"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                error={formErrors.location}
                helperText={formErrors.location ? "Location is required" : ""}
                required
              />
              <TextField
                label="Languages (comma-separated) *"
                fullWidth
                margin="dense"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                error={formErrors.languages}
                helperText={
                  formErrors.languages
                    ? "At least one language is required"
                    : ""
                }
                required
              />
              <TextField
                label="Insurance (comma-separated) *"
                fullWidth
                margin="dense"
                value={formData.insurance}
                onChange={(e) =>
                  setFormData({ ...formData, insurance: e.target.value })
                }
                error={formErrors.insurance}
                helperText={
                  formErrors.insurance
                    ? "At least one insurance is required"
                    : ""
                }
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.telehealth}
                    onChange={(e) =>
                      setFormData({ ...formData, telehealth: e.target.checked })
                    }
                  />
                }
                label="Telehealth Available"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Photo URL"
                fullWidth
                margin="dense"
                value={formData.photo}
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.value })
                }
              />
              <TextField
                label="Phone Number *"
                fullWidth
                margin="dense"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                error={formErrors.phone_number}
                helperText={
                  formErrors.phone_number ? "Phone number is required" : ""
                }
                required
              />
              <TextField
                label="Website"
                fullWidth
                margin="dense"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
              <TextField
                label="Social Links (comma-separated)"
                fullWidth
                margin="dense"
                value={formData.social_links}
                onChange={(e) =>
                  setFormData({ ...formData, social_links: e.target.value })
                }
                helperText="Enter comma-separated social media links"
              />
              <TextField
                label="Years of Experience *"
                fullWidth
                margin="dense"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.years_of_experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    years_of_experience: e.target.value,
                  })
                }
                error={formErrors.years_of_experience}
                helperText={
                  formErrors.years_of_experience
                    ? "Valid number is required"
                    : ""
                }
                required
              />
              <TextField
                label="Availability"
                fullWidth
                margin="dense"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
                helperText="Enter availability details"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio *"
                fullWidth
                margin="dense"
                multiline
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                error={formErrors.bio}
                helperText={formErrors.bio ? "Bio is required" : ""}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this therapist?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default TherapistManagement;
