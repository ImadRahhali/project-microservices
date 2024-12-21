import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    id: "",
    registrationNumber: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    mileage: "",
    fuelType: "",
    purchaseDate: "",
    ownerId: "",
    status: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch existing vehicles
  useEffect(() => {
    fetch("http://localhost:4000/vehicles")
      .then((response) => response.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    fetch("http://localhost:4000/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => {
        alert("Vehicle added successfully!");
        setDialogOpen(false);
        setForm({
          id: "",
          registrationNumber: "",
          brand: "",
          model: "",
          year: "",
          color: "",
          mileage: "",
          fuelType: "",
          purchaseDate: "",
          ownerId: "",
          status: "",
        });
        // Refresh the list of vehicles
        fetch("http://localhost:4000/vehicles")
          .then((response) => response.json())
          .then((data) => setVehicles(data));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        padding: 3,
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Manage Vehicles
      </Typography>

      {/* Vehicle Table */}
      <TableContainer component={Paper} sx={{ width: "90%", marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Registration Number</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Mileage</TableCell>
              <TableCell>Fuel Type</TableCell>
              <TableCell>Owner ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.id}</TableCell>
                <TableCell>{vehicle.registrationNumber}</TableCell>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell>{vehicle.mileage}</TableCell>
                <TableCell>{vehicle.fuelType}</TableCell>
                <TableCell>{vehicle.ownerId}</TableCell>
                <TableCell>{vehicle.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Vehicle Button */}
      <Button
        variant="contained"
        sx={{ marginTop: 3 }}
        onClick={() => setDialogOpen(true)}
      >
        Add Vehicle
      </Button>

      {/* Add Vehicle Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          {Object.keys(form).map((key) => (
            <TextField
              key={key}
              name={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Add Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicles;
