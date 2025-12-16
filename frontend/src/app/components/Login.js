/*import React, { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../../features/autenticacion/authSlice";
import Spinner from "./Spinner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/dashboard'); // Ajustado a dashboard según flujo normal
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = e => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page-container">
      <section className='heading'>
        <h1>
          <FaSignInAlt /> Acceso
        </h1>
        <p>Inicia sesión para gestionar tus tickets</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Correo electrónico'
              onChange={onChange}
            />
          </div>

          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Contraseña'
              onChange={onChange}
            />
          </div>

          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Entrar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;*/

import React, { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../../features/autenticacion/authSlice";
import Spinner from "./Spinner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/dashboard'); 
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = e => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page-container">
      <section className='heading'>
        <h1>
          <FaSignInAlt /> Acceso
        </h1>
        <p>Inicia sesión para gestionar tus tickets</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Correo electrónico'
              onChange={onChange}
              autoComplete="email" 
            />
          </div>

          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Contraseña'
              onChange={onChange}
              autoComplete="current-password"
            />
          </div>

          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Entrar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;