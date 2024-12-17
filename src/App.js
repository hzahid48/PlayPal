import React from "react";
import "./App.css";
// import Navbar from "./components/navbar"; // Navbar component
import HomePage from "./components/HomePage";
import Dashboard from "./components/dashboard"; // Dashboard component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeamManagement from "./components/teamManagement";
import MatchScheduler from "./components/matchScheduler";
import Store from "./components/store";
import Reports from "./components/Reports";
import Payment from "./components/Payment";
import Signup from "./components/signup";
import Signin from "./components/signin";
import CaptainForm from "./components/captainForm";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <NavigationLinks /> Navbar with links */}
        
        <Routes>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teamManagement" element={<TeamManagement />} />
          <Route path="/matchScheduler" element={<MatchScheduler />} />
          <Route path="/store" element={<Store />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/captainForm" element={<CaptainForm/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
