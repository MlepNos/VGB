import { Routes, Route } from "react-router-dom";
import Header from "../components/Header/Header";
import Home from "../pages/Home/Home";
import Games from "../pages/Games/Games";
import Discover from "../pages/Discover/Discover";
import GameDetail from "../pages/GameDetail/GameDetail";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register"; // if you created it
import UserProfile from "../pages/UserProfile/UserProfile";

function FetchRoutes() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
        <Route path="/games/:id" element={<ProtectedRoute><GameDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<UserProfile />} />

      </Routes>
    </div>
  );
}

export default FetchRoutes;
