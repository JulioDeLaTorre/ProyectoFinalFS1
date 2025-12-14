import axios from 'axios';
const API_URL = '/api/usuarios/';

const registro = async (userData) => {
    const respuesta = await axios.post(API_URL, userData);

    if(respuesta.data){
        localStorage.setItem('user', JSON.stringify(respuesta.data));
    }
    return respuesta.data;
};

const login = async (userData) => {
    const respuesta = await axios.post(API_URL + 'login', userData);
    if(respuesta.data){
        localStorage.setItem('user', JSON.stringify(respuesta.data));
    }
    return respuesta.data;
};

const authService = {registro, login};
export default authService;