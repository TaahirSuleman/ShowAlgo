import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import axios from "axios";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

// set the base URL of the backend server
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <ChakraProvider theme={theme}>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </ChakraProvider>
);
}

export default App;
