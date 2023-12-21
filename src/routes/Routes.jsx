import {
    createBrowserRouter
  } from "react-router-dom";
import Main from "../pages/main/Main";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";


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
            element: <Dashboard/>,
        }
      ]
    },
  ]);