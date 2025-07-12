// App.tsx
import { Route, Routes, Navigate } from "react-router";
import RegisterPage from "./page/Register";
import LoginPage from "./page/Login";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Subscription from "./page/Subscription";
import { useUserContext } from "./context/userContext";

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
  const { apiData, loading } = useUserContext();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user data, redirect to login
  if (!apiData) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default App;
