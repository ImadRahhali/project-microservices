import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Customers from "./pages/Customers";
import Vehicles from "./pages/Vehicles";
import Schedules from "./pages/Schedules";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/customers" element={<Customers />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/schedules" element={<Schedules />} />
    </Routes>
  </Router>
);

export default App;
