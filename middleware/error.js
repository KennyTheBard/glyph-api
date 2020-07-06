

const errorHandler = (param) => {
    return (err, req, res, next) => {
        console.trace(err);
        let status = 500;
        let message = 'Something Bad Happened';
        if (err.httpStatus) {
            status = err.httpStatus;
            message = err.message;
        }
        res.status(status).json({
            error: message,
        });
    }
}


module.exports = {
    errorHandler
}