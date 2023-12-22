import {
    createBrowserRouter
  } from "react-router-dom";
import Main from "../pages/main/Main";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Register from "../pages/userAuthentication/register/Register";
import Login from "../pages/userAuthentication/login/Login";
import PrivateRoute from "./PrivateRoutes";


export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children: [
        {
            path: '/',
            element: <Home/>,
        },
        {
            path: '/dashboard',
            element: <PrivateRoute><Dashboard/></PrivateRoute>,
        },
        {
          path: '/register',
          element: <Register/>,
        },
        {
          path: '/login',
          element: <Login/>,
        }
      ]
    },
  ]);