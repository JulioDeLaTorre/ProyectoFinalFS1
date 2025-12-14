import {FaSignInAlt } from 'react-icons/fa';
import { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({ email:'', password: ''});
    const {email, password} = formData;

    const onChange = e => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const onSubmit = e => {
        e.preventDefault();
        console.log('Login enviado',formData);
    }

    return (
        <>
        <section className='heading'>
            <h1 align="center"><FaSignInAlt/> Inicio de Sesión</h1>
        </section>
        <section className='form'>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <input type='email' className='form-control' id='email' value={email} placeholder='Introduzca su email'
                    onChange={onChange}/> 
                </div>
                <div className='form-group'>
                    <input type='password' className='form-control' id='password' name='password' value={password}
                    placeholder='Introduzca su contraseña' onChange={onChange}/>
                </div>
                <div className='form-group'>
                    <button type='submit' className='btn btn-block'>
                        Enviar
                    </button>
                </div>
            </form>
        </section>
        </>
    );
}

export default Login;