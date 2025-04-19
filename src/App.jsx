import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage"; // Import LoginPage component
import ScanPage from "./ScanPage"; // Import Dashboard or another component

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/scan" element={<ScanPage />} />
      {/* Add other routes as needed */}
    </Routes>
  );
}

export default App;
