// import { useState } from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Entry from "./components/Entry";
import Login from './components/user/Login';
import Register from './components/user/Register';
import Verifyotp from './components/user/Verifyotp';
import Home from './components/app/Home';

function App() {
  // const [count, setCount] = useState(0);

  // Define routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Entry />,
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/verifyotp/:id",
      element: <Verifyotp />
    },
    {
      path:"/home/:id",
      element: <Home />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
