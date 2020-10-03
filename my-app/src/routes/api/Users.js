import express        from 'express';
import * as UserLists from '../../users.json';

const API_UserRouter = express.Router(),
    uuid             = require('uuid'),
    users            = UserLists.users;

/**
 * Get all users
 */
API_UserRouter.get('/', (req, res) => {
    res.json(users);
});

/**
 * Get a single user
 */
API_UserRouter.get('/:id', (req, res) => {
    const found = users.filter(user => user.id === Number.parseInt(req.params.id));
    if (found.length > 0) {
        res.json(found);
    } else {
        res.status(400).json({
            'msg': 'User not found'
        });
    }
});


/**
 * Insert a user data
 */
API_UserRouter.post('/', (req, res) => {
    const newUser = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    };

    if (! newUser.name || ! newUser.email) {
        res.status(400).json({'msg': 'Please fill in the name and email fields.'});
    } else {
        users.push(newUser);
        res.json(newUser);
        // res.redirect('/');
    }
});

/**
 * Update an existing user
 */
API_UserRouter.put("/", (req, res) => {
    let user;
    const found = users.filter(user => user.id === Number.parseInt(req.body.id));

  if (!found || found.length < 1) {
    res.status(400).json({
        msg    : "Update failed, user not found.",
        success: false
    });
  } else {
    user = found[0];

    let updatedUser,
      email = req.body.email,
      name = req.body.name;

    if (!email || email.trim().length <= 5) {
      email = user.email;
    }

    if (!name || name.trim().length <= 1) {
      name = user.name;
    }

    updatedUser = Object.assign({}, user, {
      name: name,
      email: email,
    });

    res.json({
        success: true,
        data: {
            old: user,
            new: updatedUser,
        }
    });
  }
});

/**
 * Delete a single user
 */
API_UserRouter.delete('/:id', (req, res) => {
    const found = users.some(user => user.id === Number.parseInt(req.params.id));

    if (found) {
        res.json({
            success: true,
            msg: "User deleted successfully",
            users: users.filter(user => user.id !== Number.parseInt(req.params.id))
        });
    } else {
        res.status(400).json({
            msg    : 'Deletion failed, user not found',
            success: false
        });
    }
});

export default API_UserRouter;