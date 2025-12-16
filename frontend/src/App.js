import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./app/components/Header";
import Login from "./app/components/Login";
import Registro from "./app/components/Registro";
import Dashboard from "./app/components/Dashboard";
import Ticket from "./app/components/Ticket";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ticket/:ticketId" element={<Ticket />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
