import { Button, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  const routeError = useRouteError();

  return (
    <>
      <Typography variant="h2">{routeError.status} error</Typography>
      <Typography variant="h4">{routeError.statusText}</Typography>
      <Button variant="outlined" onClick={() => navigate("/")}>
        Home
      </Button>
    </>
  );
}
