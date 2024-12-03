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
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import UserSchema from './UserSchema';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from '../config/config';
import { AuthRequest } from '../middlewares/authenticate';
import express from 'express';
// import express from 'express'

function encodeResetToken(token: string, flag: 0 | 1) {
  if (flag !== 0 && flag !== 1) {
    throw new Error('Invalid flag entered');
  }

  if (token.length !== 64) {
    throw new Error('Invalid token length');
  }

  let asciiStringSum = 0;
  for (const char of token) {
    asciiStringSum += char.charCodeAt(0);
  }

  const index = asciiStringSum % 64;

  const finalToken = [...token];
  finalToken.splice(index, 0, flag.toString());
  return finalToken.join('');
}

function decodeResetToken(token: string, flag: 0 | 1) {
  if (token.length !== 65) {
    throw new Error('Invalid token length');
  }

  const flagUnicode = flag.toString().charCodeAt(0);

  let asciiStringSum = 0;
  for (const char of token) {
    asciiStringSum += char.charCodeAt(0);
  }

  asciiStringSum -= flagUnicode;

  const index = asciiStringSum % 64;
  const expectedFlag = token[index];

  return {
    flag: parseInt(expectedFlag, 16),
    // isValidFlag: expectedFlag == '0' || expectedFlag == '1',
  };
}

const getEmployee = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { id } = request.params;
    const employee = await UserSchema.findById(id);
    if (employee) {
      response.status(200).json({ data: employee });
    } else {
      response.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    response.status(400).json({ message: 'Error fetching employee' });
  }
};

const createEmployee = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { name, email, mobile, dob, doj } = request.body;

    const user = await UserSchema.findOne({ email });
    if (!user) {
      return response
        .status(400)
        .json({ message: 'User with this email does not exist' });
    }

    const { role } = user;
    const employee = new UserSchema({
      name,
      email,
      mobile,
      dob,
      doj,
      role,
    });
    await employee.save();

    return response
      .status(201)
      .json({ message: 'Employee created', data: employee });
  } catch (error) {
    return response.status(400).json({ message: 'Error creating employee' });
  }
};

// const createEmployee = async (
//   request: express.Request,
//   response: express.Response
// ) => {
//   try {
//     const { name, email, mobile, dob, doj } = request.body;
//     const employee = new UserSchema({
//       name,
//       email,
//       mobile,
//       dob,
//       doj,

//     });
//     await employee.save();
//     response.status(201).json({ message: 'Employee created', data: employee });
//   } catch (error) {
//     response.status(400).json({ message: 'Error creating employee' });
//   }
// };
const getAllEmployee = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const employees = await UserSchema.find(
      {},
      'name email mobile dob doj role verified'
    );
    response.status(200).json({ data: employees });
  } catch (error) {
    response.status(400).json({ message: 'Error fetching employees' });
  }
};

const updateEmployee = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { id } = request.params;
    const { name, email, mobile, dob, doj } = request.body;
    const employee = await UserSchema.findById(id);
    if (employee) {
      employee.name = name;
      employee.email = email;
      employee.mobile = mobile;
      employee.dob = dob;
      employee.doj = doj;
      await employee.save();
      response
        .status(200)
        .json({ message: 'Employee updated', data: employee });
    } else {
      response.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    response.status(400).json({ message: 'Error updating employee' });
  }
};

const deleteEmployee = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { id } = request.params;
    const result = await UserSchema.findByIdAndDelete(id);
    if (result) {
      response.status(200).json({ message: 'Employee deleted' });
    } else {
      response.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    response.status(400).json({ message: 'Error deleting employee' });
  }
};

// ........................REGISTERED USER CONTROLLER.........................................
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
    console.log(error);
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
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

//.............................................................................................
// Forgot Password function
const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const resetToken = encodeResetToken(
      crypto.randomBytes(32).toString('hex'),
      0
    );
    const resetTokenExpiry = Date.now() + 60 * 1000 * 10; // Token valid for 10 mins

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
    const resetUrl = `http://localhost:4300/resetpassword/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env['EMAIL_USER'],
      subject: 'Reset Password!',
      text: `Hello ${user.name},\n\nYou are receiving this email because you (or someone else) requested the reset of the password for your account.\n\n
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
    if (decodeResetToken(token, 1).flag === 1) {
      user.verified = true;
    }
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

const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.body;
  const userId = req.params['userId'];
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
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserSchema.find({}, 'name email mobile dob doj role');

    return res.status(200).json({
      status: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
// .....................REGISTERED USER CONTROLLER ...............

// ................ HANDLE VERIFICATION .............
const verifyUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    // Generate a reset token
    const resetToken = encodeResetToken(
      crypto.randomBytes(32).toString('hex'),
      1
    );
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // Token valid for 10 mins

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

    const resetUrl = `http://localhost:4300/resetpassword/${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: process.env['EMAIL_USER'],
      subject: 'Account Verification - Reset Password',
      text: `Hello ${user.name},\n\nPlease click the following link to verify your account by resetting your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      status: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// const verifyUser = async (req: Request, res: Response) => {
//   try {
//     const { token } = req.params; // Reset token from the URL
//     const { newPassword } = req.body; // New password from the request body

//     // Hash the token to match the stored resetPasswordToken
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     // Find the user by the reset token and ensure it hasn't expired
//     const user = await UserSchema.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() }, // Token expiration validation
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     // Update user details
//     if (newPassword) {
//       user.password = newPassword; // Update the password if provided
//     }
//     user.verified = true; // Mark the user as verified
//     user.resetPasswordToken = undefined; // Clear reset token
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     return res.status(200).json({
//       message: newPassword
//         ? 'Password reset and user verified successfully'
//         : 'User verified successfully',
//     });
//   } catch (error) {
//     // Ensure an error response is returned for unhandled exceptions
//     return res
//       .status(500)
//       .json({ message: 'Error occurred during verification', error });
//   }
// };

// const verifyUser = async (req: Request, res: Response) => {
//   try {
//     const { token } = req.params; // Reset token from the URL
//     const { newPassword } = req.body; // New password from the request body

//     // Hash the token to match the stored resetPasswordToken
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     // Find the user by the reset token and ensure it hasn't expired
//     const user = await UserSchema.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() + 60 * 1000 * 10 }, // Token expires in 10 mins
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     // If password is provided, update the password
//     if (newPassword) {
//       user.password = newPassword; // Update the password
//     }

//     // Mark the user as verified
//     user.verified = true;
//     user.resetPasswordToken = undefined; // Clear reset token
//     user.resetPasswordExpires = undefined;

//     // Save the updated user details
//     await user.save();

//     // Send an email notifying the user of the reset and verification
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail', // or your email service
//       auth: {
//         user: process.env['EMAIL_USER'],
//         pass: process.env['EMAIL_PASS'],
//       },
//     });

//     const mailOptions = {
//       // to: user.email,
//       from: process.env['EMAIL_USER'],
//       to: user.email,
//       subject: 'Your account has been verified',
//       text: 'Your account has been successfully verified. You can now log in with your new password.',
//     };

//     // Send email notification
//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.error('Error sending email:', err);
//       } else {
//         console.log('Email sent:', info.response);
//       }
//     });

//     return res.status(200).json({
//       message: newPassword
//         ? 'Password reset and user verified successfully'
//         : 'User verified successfully',
//     });
//   } catch (error) {
//     // Ensure an error response is returned for unhandled exceptions
//     return res
//       .status(500)
//       .json({ message: 'Error occurred during verification', error });
//   }
// };

export {
  register,
  login,
  admin,
  superAdmin,
  getUsers,
  updateUserRole,
  verifyUser,
  forgotPassword,
  resetPassword,
  getAllEmployee,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
