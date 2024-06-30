import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";

function Dashboard() {
  // access the user state from the UserContext
  // const {user} = useContext(UserContext)

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      <h1>Dashboard</h1>
      {!!user && <h2>Hi {user.username}!</h2>}
    </div>
  );
}

export default Dashboard;
