import { Typography, Button } from "@mui/material";
export default function Login() {
  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: "10px" }}>
        Welcome to Note app
      </Typography>
      <Button variant="outlined">Login with Google</Button>
    </>
  );
}
