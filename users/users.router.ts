import * as restify from 'restify';
import {Router} from '../common/router';
import {User} from './users.model';

class UsersRouter extends Router {

  applyRoutes(application: restify.Server) {

    application.get('/users', (req, res, next) => {
      User.find().then((users) => {
        res.json(users);
        return next();
      })
    });

    application.get('/users/:id', (req, res, next) => {
      User.findById(req.params.id).then((user) => {
        if(user) {
          res.json(user);
        } else {
          res.send(404);
        }

        return next();
      });
    });

    application.post('/users', (req, res, next) => {
      let user = new User(req.body);
      user.save((err) => {
        if(!err) {
          res.status(201);
          res.json({ message: 'User created successfully!' });
        } else {
          console.log(err, 'error')
          res.status(400);
          res.json({ message: 'Problems to save user, check the body in the requisition', error: err.message || err.errmsg });
        }

        return next();
      })
    })

  }
}

export const usersRouter = new UsersRouter();
