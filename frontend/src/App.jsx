/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the main App component which houses the routing logic of the application
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import axios from "axios";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { UserContextProvider } from "./context/userContext";
import IDE from "./pages/IDE";
import LearningMode from "./pages/LearningMode";
import Documentation from "./pages/Documentation";
import LevelSelection from "./pages/LevelSelection";
import Layout from "./components/Layout";
import Level from "./pages/Level";
import GuestIDE from "./pages/GuestIDE";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLevelSelection from "./pages/AdminLevelSelection";
import AdminLevel from "./pages/AdminLevel";
import PrivateRoute from "./components/PrivateRoute";
import PrivateAdminRoute from "./components/PrivateAdminRoute";

// base URL of the backend server
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <ChakraProvider theme={theme}>
      <UserContextProvider>
        <Routes>
          <Route element={<Layout navBar="none"/>}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<Layout navBar="guest" />}>
            <Route path="/guest-ide" element={<GuestIDE />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/about" element={<PrivateRoute element={About} />} />
            <Route path="/ide" element={<PrivateRoute element={IDE} />} />
            <Route
              path="/learning-mode"
              element={<PrivateRoute element={LearningMode} />}
            />
            <Route
              path="/learning-mode/:sectionHeading"
              element={<PrivateRoute element={LevelSelection} />}
            />
            <Route
              path="/learning-mode/:sectionRoute/:levelRoute"
              element={<PrivateRoute element={Level} />}
            />
            <Route
              path="/documentation"
              element={<PrivateRoute element={Documentation} />}
            />
          </Route>

          <Route element={<Layout navBar="guest" />}>
            <Route
              path="/admin-dashboard"
              element={<PrivateAdminRoute element={AdminDashboard} />}
            />
            <Route
              path="/admin-dashboard/:sectionHeading"
              element={<PrivateAdminRoute element={AdminLevelSelection} />}
            />
            <Route
              path="/admin-dashboard/:sectionRoute/:levelRoute"
              element={<PrivateAdminRoute element={AdminLevel} />}
            />
          </Route>
        </Routes>
      </UserContextProvider>
    </ChakraProvider>
  );
}

export default App;
