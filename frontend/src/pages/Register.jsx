import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault(); // such that page does not auto-reload
    // destructure data
    const { username, email, password } = data;
    try {
      const { data } = await axios.post("/register", {
        username,
        email,
        password,
      });

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        // clear the form
        setData({})
        toast({
          title: "Success",
          description: "Register Successful! Please login with your new credentials.",
          status: "success",
          duration: 9000,
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
      <form onSubmit={registerUser}>
        <label>Username</label>
        <input
          type="text"
          placeholder="enter username..."
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="enter email..."
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="enter password..."
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Register;
