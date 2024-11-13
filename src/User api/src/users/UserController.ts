// import { NextFunction, Request, Response } from 'express';
// import UserSchema from './UserSchema';
// import bcrypt from 'bcrypt';
// import { sign } from 'jsonwebtoken';
// import config from '../config/config';
// import { AuthRequest } from '../middlewares/authenticate';

// // import { eventNames } from "process";

// const register = async (req: Request, res: Response, next: NextFunction) => {
//   const { name, email, password} = req.body; //just added role

//   if (!name || !email || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const user = await UserSchema.findOne({ email });
//   if (user) {
//     return res.status(400).json({ error: 'User already exists.' });
//   }
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await UserSchema.create({
//       name,
//       email,
//       password: hashedPassword,
//       // role: role || 'user', // default role until changed // just added this too
//     });
//     return res.status(201).json({
//       status: true,
//       message: 'User created',
//       data: { _id: newUser._id, email: newUser.email },
//     });
//   } catch (error) {
//     return res.status(500).json({ error: 'something went wrong' });
//   }
// };

// const login = async (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const user = await UserSchema.findOne({ email });
//   if (!user) {
//     return res.status(400).json({ error: 'User not found.' });
//   }

//   const isPasswordMactch = await bcrypt.compare(password, user.password);
//   if (!isPasswordMactch) {
//     return res.status(400).json({ error: 'Incorrect credentials.' });
//   }
//   try {
//     const token = sign({ sub: user._id }, config.JwtSecret as string, {
//       expiresIn: '1d',
//     });

//     return res.status(200).json({
//       status: true,
//       message: 'User loggedin',
//       data: { _id: user._id, email: user.email, name: user.name },
//       token,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: 'something went wrong' });
//   }
// };

// // loggedin user
// const me = async (req: Request, res: Response, next: NextFunction) => {
//   const _request = req as AuthRequest;
//   const user = await UserSchema.findById(_request.UserId);
//   if (user) {
//     return res.status(200).json({
//       status: true,
//       data: { _id: user._id, email: user.email, name: user.name },
//     });
//   }
//   return res.status(500).json({ error: 'something went wrong' });
//   // res.json({ message: 'me function' });
// };

// export { register, login, me };


import { NextFunction, Request, Response } from 'express';
import nodemailer from 'nodemailer'
import crypto from 'crypto';
import UserSchema from './UserSchema';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from '../config/config';
import { AuthRequest } from '../middlewares/authenticate';

// Registration function
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  
  try {
    // console.log('not first')
    const user = await UserSchema.findOne({ email });
    // console.log('345678 first')
    if (user) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserSchema.create({
      name,
      email, 
      password: hashedPassword,
      role: 'user', // Set role or default to 'user'
    });

    return res.status(201).json({
      status: true,
      message: 'User created',
      data: { _id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.log(error) 
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Login function
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const user = await UserSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User not found.' });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ error: 'Incorrect credentials.' });
  }

  try {
    const token = sign(
      { sub: user._id, role: user.role },
      config.JwtSecret as string,
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      status: true,
      message: 'logged in',
      data: { _id: user._id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};


//.............................................................................................
// Forgot Password function
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try { 
    const user = await UserSchema.findOne({ email });
    if (!user) { 
      return res.status(400).json({ error: 'User not found' }); 
    } 
  
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex'); 
    const resetTokenExpiry = Date.now() + (60* 1000 * 10); // Token valid for 10 mins

    // Update user with the reset token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASS'],
      },
    });

    // const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const resetUrl = `http://localhost:3500/resetpassword/${resetToken}`;


    const mailOptions = {
      to: user.email,
      from: process.env['EMAIL_USER'],
      subject: 'Reset Password!',
      text: `You are receiving this email because you (or someone else) requested the reset of the password for your account.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      status: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Reset Password function
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const { token } = req.params; 

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }

  try {
   
    // console.log(`Received token: ${token}`);
    const user = await UserSchema.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      status: true,
      message: 'Password has been reset',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};


//.............................................................................................


// Logged-in admin details
const admin = async (req: Request, res: Response, next: NextFunction) => {
  const _request = req as AuthRequest;
  const user = await UserSchema.findById(_request.UserId);
  if (user) {
    return res.status(200).json({
      status: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }
  return res.status(500).json({ error: 'Something went wrong' });
};

//  logged-in superAdmin 
const superAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const _request = req as AuthRequest;
  const user = await UserSchema.findById(_request.UserId);
  if (user) {
    return res.status(200).json({
      status: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }
  return res.status(500).json({ error: 'Something went wrong' });
};

const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.body;
  const userId = req.params['userId']
  try {
    const user = await UserSchema.updateOne(
      {
        _id: userId,
      },
      { role }
    );

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try{

    const users = await UserSchema.find();
  
      return res.status(200).json({
        status: true,
        data: users,
      });
    
  } catch(error){
  return res.status(500).json({ error: 'Something went wrong' });
  }
};

export { register, login, admin, superAdmin, getUsers, updateUserRole, forgotPassword, resetPassword};
