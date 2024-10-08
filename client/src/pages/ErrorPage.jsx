import { Button, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router-dom";
import CustomTypography from "../components/CustomTypography";

export default function ErrorPage() {
  const navigate = useNavigate();
  const routeError = useRouteError();

  return (
    <>
      <CustomTypography variant="h2">
        {routeError.status} error
      </CustomTypography>
      <CustomTypography variant="h4">{routeError.statusText}</CustomTypography>
      <Button variant="outlined" onClick={() => navigate("/")}>
        Home
      </Button>
    </>
  );
}
