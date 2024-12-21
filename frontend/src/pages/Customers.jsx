import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { Box } from "@mui/system";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false); // Modal state
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // Fetch existing customers
  useEffect(() => {
    fetch("http://localhost:3000/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    fetch("http://localhost:3000/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      alert("Customer added successfully!");
      setOpen(false); // Close modal
      setForm({ id: "", name: "", email: "", phoneNumber: "", address: "" }); // Reset form

      // Refresh customer list
      fetch("http://localhost:3000/customers")
        .then((response) => response.json())
        .then((data) => setCustomers(data));
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        padding: 3,
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
        overflow: "hidden", // Prevent overflow scrollbars
      }}
    >
      <Typography variant="h4" gutterBottom>
        Manage Customers
      </Typography>

      {/* Existing Customers */}
      <Paper
        sx={{
          width: "90%", // Adjusted to fit within margins
          marginTop: 3,
          overflow: "auto",
          maxHeight: "60%", // Prevent table from exceeding container
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Button to open modal */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ marginTop: 3 }}
      >
        Add Customer
      </Button>

      {/* Modal for Adding Customer */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Customer</DialogTitle>
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
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
