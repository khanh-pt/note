import { Typography, Button } from "@mui/material";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [loginSucces, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const handleLoginWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      setLoginSuccess(true);
      navigate("/");
    } catch (error) {
      setLoginError(error.message);
    }
  };

  useEffect(() => {
    if (loginSucces) {
      navigate("/");
    }
  }, [loginSucces]);

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: "10px" }}>
        Welcome to Note app
      </Typography>
      <Button variant="outlined" onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
      <div className="">
        <Typography variant="p" sx={{ color: "red" }}>
          {loginError}
        </Typography>
      </div>
    </>
  );
}
