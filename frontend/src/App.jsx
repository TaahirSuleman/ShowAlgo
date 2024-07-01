import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { UserContextProvider } from "./context/userContext";

// set the base URL of the backend server
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <ChakraProvider theme={theme}>
      <UserContextProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/logout" element={<Home />}></Route> */}
        </Routes>
      </UserContextProvider>
    </ChakraProvider>
  );
}

export default App;
