import * as restify from 'restify';
import {EventEmitter} from 'events';
import {NotFoundError} from 'restify-errors';

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: restify.Server);

  render(res: restify.Response, next: restify.Next) {
    return (err, document) => {
      if(!err && document) {
        this.emit('beforeRender', document);
        res.json(document);
      } else {
        return next(err);
      }
    }
  }
}
