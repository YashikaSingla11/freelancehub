import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Freelancers from "./pages/Freelancers";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import FindWork from "./pages/FindWork";
import WorkDetails from "./pages/WorkDetails";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/findwork" element={<FindWork />} />
        <Route path="/work/:id" element={<WorkDetails />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}