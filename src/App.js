import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/AppContext";
import FetchRoutes from "./components/FetchRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/*" element={<FetchRoutes />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
