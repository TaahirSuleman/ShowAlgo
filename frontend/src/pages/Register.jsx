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
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";

function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault(); // such that page does not auto-reload
    // destructure data
    const { username, password } = data;
    try {
      const { data } = await axios.post("/register", {
        username,
        password,
      });

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // clear the form
        setData({});
        toast({
          title: "Success",
          description:
            "Register Successful! Please login with your new credentials.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // redirect to login page
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Center
        p="10"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
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
              <FormLabel color="gray">Username</FormLabel>
              <Input
                type="text"
                id="username"
                placeholder="enter username..."
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                border="1px solid gray"
                textColor="gray.100"
              />
              <FormHelperText mb="4" fontSize="small" color="whiteAlpha.400">
                Username should be at least 6 characters long{" "}
              </FormHelperText>

              <FormLabel color="gray">Password</FormLabel>
              <Input
                type="password"
                id="password"
                placeholder="Enter password..."
                border="1px solid gray"
                textColor="gray.800"
                color="gray.100"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <FormHelperText mb="4" fontSize="small" color="whiteAlpha.400">
                Password should be at least 6 characters long{" "}
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

          <Stack justify="center" color="gray.600" spacing="3">
            <Text as="div" textAlign="center">
              <span>Already have an account?</span>
              <Button colorScheme="purple" variant="link" ml="1">
                <Link to="/login">Log in</Link>
              </Button>
            </Text>
          </Stack>
        </Stack>
      </Center>
    </div>
  );
}

export default Register;
