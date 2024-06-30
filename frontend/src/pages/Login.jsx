import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const loginUser = async (e) => {
    e.preventDefault(); // such that page does not auto-reload
    const { email, password } = data;
    try {
      const { data } = await axios.post("/login", {
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
        // redirect to login page
        navigate("/");
        toast({
          title: "Success",
          description: "Login Successful! Welcome back!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <label>Email</label>
        <input
          type="email"
          placeholder="enter email..."
          value={data.email}
          onChange={(e) => setData({...data, email: e.target.value})}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="enter password..."
          value={data.password}
          onChange={(e) => setData({...data, password: e.target.value})}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
