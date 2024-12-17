import React, { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import Navbar from "./navbar"; // Navbar for navigation
import "../styles/teamManagement.css"; // Separate CSS for Team Management styling
import axios from "axios"; // Axios for API calls

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    age: "",
    role: "",
    matchesPlayed: "",
    team: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [userRole, setUserRole] = useState(""); // Store the user role
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const API_URL = "http://localhost:5000/api/team"; // Replace with your backend URL
  const token = localStorage.getItem("token"); // Replace with your auth token retrieval method

  // Fetch user role and team members on component mount
  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get role
      setUserRole(decodedToken.role); // Set user role (captain, member, etc.)
    }

    fetchTeamMembers();
    document.title = "Team Management";
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };
  const name = localStorage.getItem("userName")

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        // Edit existing member
        const updatedMember = {
          ...newMember,
          matchesPlayed: parseInt(newMember.matchesPlayed, 10),
          age: parseInt(newMember.age, 10),
        };

        await axios.put(`${API_URL}/${teamMembers[editingIndex]._id}`, updatedMember, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchTeamMembers(); // Refresh data
        setEditingIndex(null);
      } else {
        // Add new member
        
        await axios.post(API_URL, {
          ...newMember,
          matchesPlayed: parseInt(newMember.matchesPlayed, 10),
          age: parseInt(newMember.age, 10),
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Create a new notification for the user/team
        const notification = {
          message : `You added a player named ${newMember.name}`,
          name: name,
        };

await axios.post("http://localhost:5000/api/StoreNotification", notification);
        

        fetchTeamMembers(); // Refresh data
      }

      setNewMember({ name: "", age: "", role: "", matchesPlayed: "", team: "" });
      setErrorMessage(""); // Clear errors on success
    } catch (error) {
      console.error("Error saving team member:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const handleEditClick = (index) => {
    setNewMember(teamMembers[index]);
    setEditingIndex(index);
  };

  const handleRemoveClick = async (index) => {
    try {
      await axios.delete(`${API_URL}/${teamMembers[index]._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTeamMembers(); // Refresh data
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="team-management-container">
        <div className="team-management-content">
          <Typography variant="h2" align="center" color="error" gutterBottom>
            Team Management
          </Typography>

          {/* Team Table */}
          <div className="team-table-section">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Age</th>
                  <th>Role</th>
                  <th>Matches Played</th>
                  {/* <th>Team</th> */}
                  {userRole === "captain" && <th>Actions</th>}
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr key={index}>
                    <td>{member.name}</td>
                    <td>{member.age}</td>
                    <td>{member.role}</td>
                    <td>{member.matchesPlayed}</td>
                    {/* <td>{member.team}</td> */}
                   
                      {userRole === "captain" && (
                        <td>
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditClick(index)}
                            className="action-button edit"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleRemoveClick(index)}
                            className="action-button remove"
                          >
                            Remove
                          </Button>
                        </>
                        </td>
                      )}
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add or Edit Member */}
          {userRole === "captain" && (
            <div className="add-member-section">
              <Typography variant="h3" align="center" color="error" gutterBottom>
                {editingIndex !== null ? "Edit Member" : "Add New Member"}
              </Typography>
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  name="name"
                  value={newMember.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="input-field"
                  required
                />
                <input
                  type="number"
                  name="age"
                  value={newMember.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  className="input-field"
                  required
                  min="0"
                />
                <input
                  type="text"
                  name="role"
                  value={newMember.role}
                  onChange={handleInputChange}
                  placeholder="Role"
                  className="input-field"
                  required
                />
                <input
                  type="number"
                  name="matchesPlayed"
                  value={newMember.matchesPlayed}
                  onChange={handleInputChange}
                  placeholder="Matches Played"
                  className="input-field"
                  required
                  min="0"
                />
                <input
                  type="text"
                  name="team"
                  value={newMember.team}
                  onChange={handleInputChange}
                  placeholder="Team"
                  className="input-field"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="action-button add"
                >
                  {editingIndex !== null ? "Update Member" : "Add Member"}
                </Button>
              </form>
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
