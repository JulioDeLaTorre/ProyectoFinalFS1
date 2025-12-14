import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './app/components/Login';
import Registro from './app/components/Registro';
import Dashboard from './app/components/Dashboard';
import Header from './app/components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Router>
        <div className="Container">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;