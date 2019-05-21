import * as restify from 'restify';
import {Router} from '../common/router';
import {User} from './users.model';

class UsersRouter extends Router {

  constructor() {
    super();
    this.on('beforeRender', (document) => {
      document.password = undefined;
      //delete document.password;
    })
  }

  applyRoutes(application: restify.Server) {

    application.get('/users', (req, res, next) => {
      User.find(this.render(res, next));
    });

    application.get('/users/:id', (req, res, next) => {
      User.findById(req.params.id, this.render(res, next));
    });

    application.post('/users', (req, res, next) => {
      let user = new User(req.body);
      user.save(this.render(res, next));
    });

    application.put('/users/:id', (req, res, next) => {
      const options = { overwrite: true }
      User.update({ _id: req.params.id }, req.body, options, (err) => {
        if(!err) {
          User.findById({ _id: req.params.id }, this.render(res, next));
        } else {
          res.status(404);
          res.json({ message: 'User not found', error: err.message || err.errmsg });
          return next();
        }
      });
    });

    application.patch('/users/:id', (req, res, next) => {
      const options = { new: true };
      User.findByIdAndUpdate(req.params.id, req.body, options, this.render(res, next));
    });

    application.del('/users/:id', (req, res, next) => {
      User.deleteOne({ _id: req.params.id }, (err) => {
        if(!err) {
          res.send(204);
        } else {
          res.status(404);
          res.json({ message: 'User not found', error: err.message || err.errmsg });
        }
      })
    });

  }
}

export const usersRouter = new UsersRouter();
