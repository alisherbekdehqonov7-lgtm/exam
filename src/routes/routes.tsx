import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import SignUp from "../pages/sign-up";
import SignIn from "../pages/sign-in";
import NotFound from "../pages/not-found";
import Profile from "../pages/profile";
import RootLayout from "../components/layouts/root-layout";
import ProtectedRoute from "./protected-route";
import Books from "../pages/Books";
import Authors from "../pages/Authors";
import Favorites from "../pages/Favorites";
export const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      { path: "books", element: <Books /> },
      { path: "authors", element: <Authors /> },
      { path: "favorites", element: <Favorites /> },
    ],
  },
  {
    path: "sign-up",
    element: (
      <ProtectedRoute>
        <SignUp />
      </ProtectedRoute>
    ),
  },
  {
    path: "sign-in",
    element: (
      <ProtectedRoute>
        <SignIn />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
]);
