const Config = require('../config');
const { AppEnv } = require('../enums');

const { env } = Config.app
const appEnv =  Object.values(AppEnv)

class GeneralMiddleware {
  static ErrorHandler(error, _req, res, _next)  {
    if (res.headerSent) return;

    if (!appEnv.includes(env)) console.log(error)

    if ('getType' in error) {
      return res.status(error.statusCode).json({
        status: 'error',
        code: error.statusCode,
        name: error.name,
        timestamp: Date.now(),
        ...(!error.errors? { message: error.message} : { message: error.message, errors: error.errors}),
        ...(!appEnv.includes(env) ? {} : { stack: error.stack} 
        )
      });
    }

    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        status: 'error',
        code:500,
        name: "MulterError",
        timestamp: Date.now(),
        message: "A Multer error occurred when uploading"
      })
    }

    return res.status(500).json({
      status: "error",
      code: 500,
      name: 'InternalServerError',
      timestamp: Date.now(),
      message: 'Something went wrong, Please contact our support team!',
      ...(!appEnv.includes(env) ? {} : { stack: error.stack} )
    });
  }

  static NotFoundError(req, res, _next) {
    return res.status(404).json({
      status: 'error',
      name: 'NotFoundError',
      code: 404,
      timestamp: Date.now(),
      message: `${req.url} endpoint not found!`,
    });
  }

  static DevLogs(req, _res, next) {
    console.log(`request - ${req.url}`)
    next()
  }
}

module.exports = GeneralMiddleware;