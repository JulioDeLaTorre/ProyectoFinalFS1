const mongoose = require('mongoose')

const dbConexion = async () => {
    try{
        const conexion = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conexion.connection.host}`);
        }catch (error){
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = dbConexion