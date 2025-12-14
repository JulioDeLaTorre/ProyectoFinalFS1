const mongoose = require('mongoose');

const dbConexion = async()=>{
    try {
        const conexion = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Conectado ${conexion.connection.host}`);
    }
    catch (err){
        console.log(err);
        process.exit(1);
    }
};

module.exports = dbConexion;