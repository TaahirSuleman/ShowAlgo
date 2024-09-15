/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the Register page which allows users to create an account
 */

import { useState } from "react";
import axios from "axios";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  IconButton,
  FormHelperText,
  Box,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";

function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // function to validate the input fields
  const validateInput = () => {
    const { username, password, confirmPassword } = data;
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
    if (password !== confirmPassword) {
      toast({
        title: "Invalid Input",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  // function to register the user
  const registerUser = async (e) => {
    e.preventDefault(); // such that page does not auto-reload

    if (!validateInput()) {
      return; // Stop execution if validation fails
    }

    // destructure data
    const { username, password, role } = data;
    try {
      const { data } = await axios.post("/register", {
        username,
        password,
        role,
      });

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // clear the form
        setData({  username: "", password: "", confirmPassword: "", role: "user"  });
        toast({
          title: "Success",
          description:
            "Register Successful! Please login with your new credentials.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // redirect to login page
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Center
        p="10"
        flexDirection="column"
      >
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
          <Heading>Sign up.</Heading>
          <Text fontSize="lg" color="gray.400">
            Be sure to save your credentials in a safe place.
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
              />
              <FormHelperText mb="4" fontSize="small" color="gray">
                Username should be at least 6 characters long{" "}
              </FormHelperText>

              <FormLabel color="whitesmoke">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter password..."
                  border="1px solid gray"
                  textColor="gray.800"
                  color="gray.100"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
                <InputRightElement width="4.5rem">
                  <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText mb="4" fontSize="small" color="gray">
                Password should be at least 6 characters long{" "}
              </FormHelperText>

              <FormLabel color="whitesmoke">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm password..."
                  border="1px solid gray"
                  textColor="gray.800"
                  color="gray.100"
                  value={data.confirmPassword}
                  onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText mb="4" fontSize="small" color="gray">
                Please confirm your password{" "}
              </FormHelperText>

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
                  onClick={registerUser}
                >
                  Create Account
                </Button>
              </div>
            </FormControl>
          </Stack>

          <Stack justify="center" color="whiteAlpha.700" spacing="3">
            <Text as="div" textAlign="center">
              <span>Already have an account?</span>
              <Button colorScheme="purple" variant="link" ml="1">
                <Link to="/login">Log in</Link>
              </Button>
            </Text>
          </Stack>
        </Stack>
      </Center>
    </Box>
  );
}

export default Register;
