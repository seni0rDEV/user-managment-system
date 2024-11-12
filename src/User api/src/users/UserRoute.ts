//  import  express from "express";
// import { register, login, me } from "./UserController";
// import authenticate from "../middlewares/authenticate";

// const UserRoute = express.Router();

//  UserRoute.post('/register', register);
//  UserRoute.post('/login', login);
//  UserRoute.get('/me', authenticate, me);


// export default UserRoute;

import express from 'express';
import { register, login, admin , superAdmin,getUsers, updateUserRole, forgotPassword, resetPassword} from './UserController';

import authenticate from '../middlewares/authenticate';

const UserRoute = express.Router();

// Public routes
UserRoute.post('/register', register);
UserRoute.post('/login', login);
UserRoute.post('/forgetpassword', forgotPassword);
UserRoute.post('/resetpassword/:token', resetPassword);

// Protected routes
UserRoute.get('/admin', authenticate(), admin); // User-specific route
UserRoute.get('/superadmin', authenticate(), superAdmin);
UserRoute.put('/:userId/role', authenticate(['superadmin']), updateUserRole);
UserRoute.get('/', authenticate(['superadmin']), getUsers);
UserRoute.get('/user', authenticate(['user']), (req, res) => {
  res.json({ message: 'Welcome !' });
});

export default UserRoute;


