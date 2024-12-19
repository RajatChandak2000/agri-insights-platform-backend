import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { SignInDto, SignUpDto } from './dto';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignUpDto): Promise<User> {
    const { username, email, password } = dto;
    try {
      const hashedPassword = await argon2.hash(password);
      const newUser = await new this.userModel({
        username,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      // Convert the document to a plain JavaScript object
      const userObj = savedUser.toObject();
      // Remove the password field
      delete userObj.password;
      return userObj;
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        // Handle duplicate key error
        if (error.keyValue && error.keyValue.email) {
          throw new ForbiddenException('Email is already taken');
        }
      } else {
        throw error;
      }
    }
  }

  async signin(dto: SignInDto): Promise<{
    accessToken: string;
    user: { username: string; email: string };
  }> {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
    }
    const payload = { email: user.email, sub: user._id };
    const accessToken = await this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async sendPasswordResetLink(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:3000/resetPassword?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password reset',
      text: `You requested a password reset. Click here to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Failed to send reset link. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, //Checking if the token  is still valid
    });

    if (!user) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    user.resetToken = undefined; // Invalidate the token
    user.resetTokenExpiry = undefined; // Invalidate the expiry date
    await user.save();
  }
}
