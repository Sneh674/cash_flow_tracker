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
import Addcategory from './components/app/Addcategory';
import Transacforcat from './components/app2/Transacforcat';
import Editcat from './components/app2/Editcat';
import Addtransac from './components/app2/Addtransac';
import Edittransac from './components/app2/Edittransac';

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
    },
    {
      path:"/home/:id/addcat",
      element: <Addcategory />
    },
    {
      path:"/home/:id/selectedsubcat/:mainc/:subc",
      element: <Transacforcat />
    },
    {
      path:"/home/:id/editsubcat/:mainc/:subc",
      element: <Editcat />
    },
    {
      path:"/home/:id/addtransaction/:mainc/:subc",
      element: <Addtransac />
    },
    {
      path:"/home/:id/edittransaction/:mainc/:subc/:tid",
      element: <Edittransac />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
