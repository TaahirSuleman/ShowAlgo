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

// set the base URL of the backend server
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <ChakraProvider theme={theme}>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<Layout navBar="guest"/>}>
            <Route path="/guest-ide" element={<GuestIDE />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/about" element={<About />} />
            <Route path="/ide" element={<IDE />}></Route>
            <Route path="/learning-mode" element={<LearningMode />}></Route>
            <Route
              path="/learning-mode/:sectionHeading"
              Component={LevelSelection}
            ></Route>
            <Route
              path="learning-mode/:sectionRoute/:levelRoute"
              element={<Level />}
            ></Route>
            <Route path="/documentation" element={<Documentation />}></Route>
          </Route>
        </Routes>
      </UserContextProvider>
    </ChakraProvider>
  );
}

export default App;
