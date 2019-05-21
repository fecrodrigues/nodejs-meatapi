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
      user.save((err, user) => {
        if(!err) {
          res.status(201);
          user.password = undefined;
          res.json({ message: 'User created successfully!', user: user });
        } else {
          res.status(400);
          res.json({ message: 'Problems to save user, check the body in the requisition', error: err.message || err.errmsg });
        }

        return next();
      })
    });

    application.put('/users/:id', (req, res, next) => {
      const options = { overwrite: true }
      User.update({ _id: req.params.id }, req.body, options, (err) => {
        if(!err) {
          User.findOne({ _id: req.params.id }, (err, user) => {
            if(!err) {
              res.json({ message: 'User successfully replaced', user: user });
            }

            return next();
          })

        } else {
          res.status(404);
          res.json({ message: 'User not found', error: err.message || err.errmsg });
          return next();
        }
      });
    });

  }
}

export const usersRouter = new UsersRouter();
