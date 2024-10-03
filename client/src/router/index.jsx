import { Outlet, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";

const AuthLayout = () => {
  return <Outlet />;
};
export default createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <Home />,
        path: "/",
      },
      {
        element: <Login />,
        path: "/login",
      },
    ],
  },
]);
