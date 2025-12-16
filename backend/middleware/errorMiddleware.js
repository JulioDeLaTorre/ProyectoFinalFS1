const errorHandler = (err, req, res, next) => {
    const codigoEstado = res.statusCode ? res.statusCode : 500;
    res.status(codigoEstado);
    res.json({ mensaje: err.message});
};

module.exports = { errorHandler };