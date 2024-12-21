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

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    description: "",
    status: "",
    vehicleId: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch existing schedules
  useEffect(() => {
    fetch("http://localhost:5000/schedules")
      .then((response) => response.json())
      .then((data) => setSchedules(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    fetch("http://localhost:5000/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => {
        alert(
          "Schedule added successfully, An E-mail was sent to the Customer!"
        );
        setDialogOpen(false);
        setForm({
          startTime: "",
          endTime: "",
          description: "",
          status: "",
          vehicleId: "",
        });
        // Refresh the list of schedules
        fetch("http://localhost:5000/schedules")
          .then((response) => response.json())
          .then((data) => setSchedules(data));
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
        Manage Maintenance Schedules
      </Typography>

      {/* Schedule Table */}
      <TableContainer component={Paper} sx={{ width: "90%", marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Vehicle ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.id}</TableCell>
                <TableCell>
                  {new Date(schedule.startTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(schedule.endTime).toLocaleString()}
                </TableCell>
                <TableCell>{schedule.description}</TableCell>
                <TableCell>{schedule.status}</TableCell>
                <TableCell>{schedule.vehicleId}</TableCell>
                <TableCell>
                  {new Date(schedule.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(schedule.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Schedule Button */}
      <Button
        variant="contained"
        sx={{ marginTop: 3 }}
        onClick={() => setDialogOpen(true)}
      >
        Add Schedule
      </Button>

      {/* Add Schedule Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Schedule</DialogTitle>
        <DialogContent>
          <TextField
            name="startTime"
            label="Start Time (YYYY-MM-DDTHH:mm:ss)"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="endTime"
            label="End Time (YYYY-MM-DDTHH:mm:ss)"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="status"
            label="Status"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="vehicleId"
            label="Vehicle ID"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Add Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Schedules;
