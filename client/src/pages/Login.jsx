import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTypography from "../components/CustomTypography";
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
      <CustomTypography variant="h4" className="mb-[10px]">
        Welcome to Note app
      </CustomTypography>
      <CustomTypography variant="button" onClick={handleLoginWithGoogle}>
        Login with Google
      </CustomTypography>
      <div className="mt-3">
        <CustomTypography variant="p" className="text-[#f00]">
          {loginError}
        </CustomTypography>
      </div>
    </>
  );
}
