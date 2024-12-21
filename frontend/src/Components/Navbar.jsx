import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" component={Link} to="/customers">
        Customers
      </Button>
      <Button color="inherit" component={Link} to="/vehicles">
        Vehicles
      </Button>
      <Button color="inherit" component={Link} to="/schedules">
        Scheduled jobs
      </Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;
