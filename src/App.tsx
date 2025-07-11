import { createBrowserRouter, RouterProvider } from "react-router";
import RegisterPage from "./page/Register";
import LoginPage from "./page/Login";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Subscription from "./page/Subscription";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/subscription",
    element: <Subscription />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
