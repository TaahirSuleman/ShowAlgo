/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the Login page which authenticates the user
 */

import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdHome } from "react-icons/io";

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // function to validate the input fields
  const validateInput = () => {
    const { username, password } = data;
    if (username.length < 6) {
      toast({
        title: "Invalid Input",
        description: "Username should be at least 6 characters long.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (password.length < 6) {
      toast({
        title: "Invalid Input",
        description: "Password should be at least 6 characters long.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  // function to login the user
  const loginUser = async (e) => {
    e.preventDefault(); // such that page does not auto-reload

    if (!validateInput()) {
      return; // Stop execution if validation fails
    }

    // extract the data from the state
    const { username, password, role } = data;
    // send the data to the server
    try {
      const { data } = await axios.post("/login", {
        username,
        password,
        role,
      });

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      } else {
        // save the user data in local storage
        localStorage.setItem("user", JSON.stringify(data));
        // clear the form
        setData({});
        // redirect based on user role
        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/about");
        }
        toast({
          title: "Success",
          description: "Login Successful! Welcome back!",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Center p="10" flexDirection="column">
        <Stack boxShadow="md" bg="blackAlpha.900" p="20" rounded="md">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton
              icon={<IoMdHome />}
              w="5vh"
              onClick={() => navigate("/")}
            />
          </div>
          <Heading>Log in.</Heading>
          <Text fontSize="lg" color="gray.400">
            Please log in using your username and password.
          </Text>
          <Stack>
            <FormControl>
              <FormLabel color="whitesmoke">Username</FormLabel>
              <Input
                type="text"
                id="username"
                placeholder="Enter username..."
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                border="1px solid gray"
                textColor="gray.100"
                mb="4"
              />

              <FormLabel color="whitesmoke">Password</FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password..."
                  border="1px solid gray"
                  textColor="gray.800"
                  color="gray.100"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  mb="4"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  onClick={loginUser}
                >
                  Login
                </Button>
              </div>
            </FormControl>
          </Stack>

          <Stack justify="center" color="gray.600" spacing="3">
            <Text as="div" textAlign="center">
              <span>Don&lsquo;t have an account?</span>
              <Button colorScheme="purple" variant="link" ml="1">
                <Link to="/register">Sign up</Link>
              </Button>
            </Text>
          </Stack>
        </Stack>
      </Center>
    </Box>
  );
}

export default Login;
