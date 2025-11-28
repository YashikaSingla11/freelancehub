import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Freelancers from "./pages/Freelancers";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import FindWork from "./pages/FindWork";
import WorkDetails from "./pages/WorkDetails";

function AppContent() {
  const location = useLocation();
  
  // hide navbar on login/signup page
  const hideNavbar = location.pathname === "/" || location.pathname === "/auth";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/findwork" element={<FindWork />} />
        <Route path="/work/:id" element={<WorkDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
