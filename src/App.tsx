// App.tsx
import { Route, Routes, Navigate } from "react-router";
import RegisterPage from "./page/Register";
import LoginPage from "./page/Login";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Subscription from "./page/Subscription";
import { useUserContext } from "./context/userContext";
import Pic from "./page/Pic";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedAuth>
            <Home />
          </ProtectedAuth>
        }
      />
      <Route
        path="/my-images"
        element={
          <ProtectedAuth>
            <Pic />
          </ProtectedAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedAuth>
            <Profile />
          </ProtectedAuth>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedAuth>
            <Subscription />
          </ProtectedAuth>
        }
      />
    </Routes>
  );
}

function ProtectedAuth({ children }: { children: React.ReactNode }) {
  const { loading, isLoggedIn } = useUserContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default App;
