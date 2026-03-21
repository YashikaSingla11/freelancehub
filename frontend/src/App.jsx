import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Freelancers from "./pages/Freelancers";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import FindWork from "./pages/FindWork";
import WorkDetails from "./pages/WorkDetails";
import { useAuth, AuthProvider } from "./contexts/AuthContext";

// 👇 AppContent (routes + navbar)
function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}

      <Routes>
        <Route path="/" element={<AuthPage />} />
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

// 👇 FINAL EXPORT
export default function App() {
  return (
    <Router> {/* ✅ Router OUTSIDE */}
      <AuthProvider> {/* ✅ Auth inside Router */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}