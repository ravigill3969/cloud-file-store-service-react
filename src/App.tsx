// App.tsx
import { Route, Routes, Navigate } from "react-router";
import RegisterPage from "./page/Register";
import LoginPage from "./page/Login";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Subscription from "./page/Subscription";
import { useUserContext } from "./context/userContext";
import Pic from "./page/Pic";
import Upload from "./page/Upload";
import Success from "./page/Success";
import RateLimitPage from "./page/RateLimiting";
import DeletedImages from "./page/DeletedImages";
import Video from "./page/Video";
import VideoPlayer from "./page/VideoPlayer";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedAuth>
            <Home />
          </ProtectedAuth>
        }
      />
      <Route
        path="/deleted-images"
        element={
          <ProtectedAuth>
            <DeletedImages />
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

      <Route
        path="/upload"
        element={
          <ProtectedAuth>
            <Upload />
          </ProtectedAuth>
        }
      />
      <Route
        path="/video"
        element={
          <ProtectedAuth>
            <Video />
          </ProtectedAuth>
        }
      />

      <Route path="/video-player" element={<VideoPlayer />} />
      <Route path="/success" element={<Success />} />
      <Route path="/rate-limit" element={<RateLimitPage />} />
    </Routes>
  );
}

function ProtectedAuth({ children }: { children: React.ReactNode }) {
  const { loading, isLoggedIn } = useUserContext();

  console.log(loading, isLoggedIn);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default App;
