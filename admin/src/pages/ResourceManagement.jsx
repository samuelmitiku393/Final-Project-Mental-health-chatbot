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
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Box,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
}));

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "article",
    category: "articles",
    source: "",
    url: "",
    description: "",
    featured: false,
    tags: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: false,
    type: false,
    category: false,
    source: false,
    url: false,
    description: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const resourceTypes = [
    "article",
    "video",
    "app",
    "book",
    "crisis",
    "self-help",
    "tool",
    "worksheet",
  ];

  const resourceCategories = [
    "articles",
    "videos",
    "apps",
    "books",
    "crisis",
    "self-help",
    "tools",
    "worksheets",
  ];

  const requiredFields = [
    "title",
    "type",
    "category",
    "source",
    "url",
    "description",
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

    // Validate URL format if URL is provided
    if (formData.url.trim() && !isValidUrl(formData.url.trim())) {
      errors.url = true;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/resources", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setResources(res.data);
      setError(null);
    } catch (err) {
      let errorMessage = "Failed to fetch resources.";
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
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDialogOpen = (resource = null) => {
    if (resource) {
      setFormData({
        title: resource.title,
        type: resource.type,
        category: resource.category,
        source: resource.source,
        url: resource.url,
        description: resource.description,
        featured: resource.featured || false,
        tags: resource.tags ? resource.tags.join(", ") : "",
      });
      setEditingId(resource._id);
    } else {
      setFormData({
        title: "",
        type: "article",
        category: "articles",
        source: "",
        url: "",
        description: "",
        featured: false,
        tags: "",
      });
      setEditingId(null);
    }
    setFormErrors({
      title: false,
      type: false,
      category: false,
      source: false,
      url: false,
      description: false,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({
      title: "",
      type: "article",
      category: "articles",
      source: "",
      url: "",
      description: "",
      featured: false,
      tags: "",
    });
    setEditingId(null);
  };

  const parseFormData = () => {
    return {
      title: formData.title.trim(),
      type: formData.type,
      category: formData.category,
      source: formData.source.trim(),
      url: formData.url.trim(),
      description: formData.description.trim(),
      featured: formData.featured,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
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
          `http://localhost:8000/api/resources/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbar({
          open: true,
          message: "Resource updated successfully",
          severity: "success",
        });
      } else {
        await axios.post("http://localhost:8000/api/resources", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({
          open: true,
          message: "Resource created successfully",
          severity: "success",
        });
      }
      fetchResources();
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
    if (!deleteConfirmId) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/resources/${deleteConfirmId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSnackbar({
        open: true,
        message: "Resource deleted successfully",
        severity: "success",
      });
      setDeleteConfirmId(null);
      fetchResources();
    } catch (error) {
      let errorMessage = "Failed to delete resource";
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
      return !formData[field] || formData[field].toString().trim() === "";
    });
  };

  const getGridColumns = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 6;
    return 4;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: { xs: 2, sm: 0 } }}>
          Resource Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
          size={isSmallScreen ? "medium" : "large"}
        >
          {isSmallScreen ? "Add" : "Add Resource"}
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={getGridColumns()} key={resource._id}>
              <StyledCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {resource.title}
                    </Typography>
                    {resource.featured && (
                      <Chip
                        label="Featured"
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <Box sx={{ mb: 1.5 }}>
                    <Chip
                      label={resource.type}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label={resource.category}
                      size="small"
                      color="secondary"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                    sx={{ wordBreak: "break-word" }}
                  >
                    Source: {resource.source}
                  </Typography>
                  {resource.tags && resource.tags.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                      {resource.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                  <Typography
                    variant="body2"
                    paragraph
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {resource.description}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2,
                  }}
                >
                  <Button
                    size="small"
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mr: 1 }}
                  >
                    Visit
                  </Button>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleDialogOpen(resource)}
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteConfirmId(resource._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        fullScreen={isSmallScreen}
      >
        <DialogTitle>
          {editingId ? "Edit Resource" : "Add Resource"}
          <Typography variant="subtitle2" color="textSecondary">
            * indicates required field
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title *"
                fullWidth
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={formErrors.title}
                helperText={formErrors.title ? "Title is required" : ""}
                required
                margin="normal"
                size={isSmallScreen ? "small" : "medium"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type *</InputLabel>
                <Select
                  value={formData.type}
                  label="Type *"
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  error={formErrors.type}
                  size={isSmallScreen ? "small" : "medium"}
                >
                  {resourceTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.category}
                  label="Category *"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  error={formErrors.category}
                  size={isSmallScreen ? "small" : "medium"}
                >
                  {resourceCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Source *"
                fullWidth
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                error={formErrors.source}
                helperText={formErrors.source ? "Source is required" : ""}
                required
                margin="normal"
                size={isSmallScreen ? "small" : "medium"}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="URL *"
                fullWidth
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                error={formErrors.url}
                helperText={
                  formErrors.url
                    ? formData.url.trim() && !isValidUrl(formData.url.trim())
                      ? "Please enter a valid URL"
                      : "URL is required"
                    : ""
                }
                required
                margin="normal"
                size={isSmallScreen ? "small" : "medium"}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Tags (comma-separated)"
                fullWidth
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                helperText="Enter comma-separated tags for this resource"
                margin="normal"
                size={isSmallScreen ? "small" : "medium"}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    size={isSmallScreen ? "small" : "medium"}
                  />
                }
                label="Featured Resource"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description *"
                fullWidth
                multiline
                rows={isSmallScreen ? 3 : 4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                error={formErrors.description}
                helperText={
                  formErrors.description ? "Description is required" : ""
                }
                required
                margin="normal"
                size={isSmallScreen ? "small" : "medium"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDialogClose}
            size={isSmallScreen ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            size={isSmallScreen ? "small" : "medium"}
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        fullScreen={isSmallScreen}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this resource? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteConfirmId(null)}
            size={isSmallScreen ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            size={isSmallScreen ? "small" : "medium"}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{
          vertical: isSmallScreen ? "bottom" : "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResourceManagement;
