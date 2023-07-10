const notfound = (req,res,next) => {
    const error=new Error(`Not Found `);
    res.status(404);
    next(error);
};

const errorHandler = (err,req,res,next) => {
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV ==="production" ? null : err.stack,
    });
}

module.exports ={ notfound,errorHandler};