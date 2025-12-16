import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/autenticacion/authSlice";
import { FaSignInAlt, FaSignOutAlt, FaUser, FaTools } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      {/* LOGO */}
      <Link to={user ? "/dashboard" : "/login"} className="logo">
  <img
    src="/auxilio.ico"
    alt="AUX.XILIO"
    className="logo-img"
  />
  <span>
    AUX<span className="dot">.</span>XILIO
  </span>
</Link>


      {/* MENU */}
      <ul>
        {user ? (
          <>
            <li className="user-name">
              👋 {user.nombre || "Usuario"}
            </li>
            <li>
              <button className="btn" onClick={onLogout}>
                <FaSignOutAlt /> Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/registro">
                <FaUser /> Registro
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;
