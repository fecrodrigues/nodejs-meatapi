import * as restify from 'restify';

export const handleError = (req: restify.Request, res: restify.Response, err, done) => {

  err.toJSON = () => {
    return {
      message: err.message
    }
  }

  switch(err.name) {
    case 'CastError':
      err.statusCode = 400;
    break;
    case 'MongoError':
      err.statusCode = 400;
    break;
    case 'ValidationError':
      err.statusCode = 400;
    break;
  }

  done();
}