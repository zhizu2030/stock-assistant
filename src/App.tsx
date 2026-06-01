
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Watchlist from "./pages/Watchlist";
import Profile from "./pages/Profile";
import StockDetail from "./pages/StockDetail";
import { BottomNav } from "./components/BottomNav";

function AppContent() {
  const location = useLocation();
  const showBottomNav = !location.pathname.startsWith('/stock/');

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stock/:code" element={<StockDetail />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

