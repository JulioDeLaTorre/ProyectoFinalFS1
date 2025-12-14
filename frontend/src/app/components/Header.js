import { FaSignInAlt,FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Creador de Tareas</Link>
            </div>
            <ul>
                <li>
                    <Link to="/login ">
                        <FaSignInAlt />Login
                    </Link>
                </li>
                <li>
                    <Link to="/registro">
                        <FaUser />Registro
                    </Link>
                </li>
            </ul>
        </header>
    );
}

export default Header;