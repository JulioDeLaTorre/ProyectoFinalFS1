/*import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from "../../features/autenticacion/authSlice";
import Spinner from './Spinner';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        password2: ''
    });
    const { nombre, email, password, password2 } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess || user) navigate('/');
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
        if (password !== password2) {
            toast.error('Las contraseñas no coinciden');
        } else {
            const userData = { nombre, email, password };
            dispatch(register(userData));
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="page-container">
            <section className='heading'>
                <h1>
                    <FaUser /> Registro
                </h1>
                <p>Crea tu cuenta de soporte</p>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input type='text' className='form-control' id='nombre' name='nombre' value={nombre}
                            placeholder='Nombre completo' onChange={onChange} />
                    </div>
                    <div className='form-group'>
                        <input type='email' className='form-control' id='email' name='email' value={email}
                            placeholder='Correo electrónico' onChange={onChange} />
                    </div>
                    <div className='form-group'>
                        <input type='password' className='form-control' id='password' name='password' value={password}
                            placeholder='Contraseña' onChange={onChange} />
                    </div>
                    <div className='form-group'>
                        <input type='password' className='form-control' id='password' name='password2' value={password2}
                            placeholder='Confirmar contraseña' onChange={onChange} />
                    </div>
                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>Registrarme</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default Registro;*/

import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from "../../features/autenticacion/authSlice";
import Spinner from './Spinner';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        password2: ''
    });
    const { nombre, email, password, password2 } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess || user) navigate('/');
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
        if (password !== password2) {
            toast.error('Las contraseñas no coinciden');
        } else {
            const userData = { nombre, email, password };
            dispatch(register(userData));
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="page-container">
            <section className='heading'>
                <h1>
                    <FaUser /> Registro
                </h1>
                <p>Crea tu cuenta de soporte</p>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input 
                            type='text' 
                            className='form-control' 
                            id='nombre' 
                            name='nombre' 
                            value={nombre}
                            placeholder='Nombre completo' 
                            onChange={onChange} 
                            autoComplete="name"
                        />
                    </div>
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
                            autoComplete="new-password"
                        />
                    </div>
                    <div className='form-group'>
                        <input 
                            type='password' 
                            className='form-control' 
                            id='password2' 
                            name='password2' 
                            value={password2}
                            placeholder='Confirmar contraseña' 
                            onChange={onChange} 
                            autoComplete="new-password"
                        />
                    </div>
                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>Registrarme</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default Registro;